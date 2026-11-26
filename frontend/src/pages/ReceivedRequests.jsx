import React, { useState, useEffect, useCallback } from 'react';
import { Inbox, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import requestService from '../services/requestService';
import studentService from '../services/studentService';
import connectionService from '../services/connectionService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const ReceivedRequests = () => {
  const { toasts, removeToast, toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionTarget, setActionTarget] = useState(null); // { request, action: 'accept' | 'reject' }
  const [processing, setProcessing] = useState(null);
  const [senderProfiles, setSenderProfiles] = useState({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await requestService.getReceivedRequests();
      const reqs = res.data || [];
      setRequests(reqs);
      const senderIds = [...new Set(reqs.map((request) => request.senderId))];
      const profileResults = await Promise.allSettled(
        senderIds.map(async (senderId) => {
          const profileResponse = await studentService.getStudentById(senderId);
          return [senderId, profileResponse.data];
        })
      );
      const profiles = {};
      let failedProfiles = false;
      profileResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          profiles[result.value[0]] = result.value[1];
        } else {
          failedProfiles = true;
        }
      });
      setSenderProfiles(profiles);
      if (failedProfiles) {
        toast.error('Some sender profiles or skills could not be loaded.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load received requests';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAction = async () => {
    if (!actionTarget) return;
    setProcessing(actionTarget.request.id);
    try {
      const expectedStatus = actionTarget.action === 'accept' ? 'ACCEPTED' : 'REJECTED';
      let response;
      if (actionTarget.action === 'accept') {
        response = await requestService.acceptRequest(actionTarget.request.id);
        if (response.data?.status !== expectedStatus) {
          throw new Error('The server did not confirm acceptance.');
        }
        const connectionsResponse = await connectionService.getMyConnections();
        const hasConnection = (connectionsResponse.data || []).some(
          (connection) => String(connection.partnerId) === String(actionTarget.request.senderId)
        );
        if (!hasConnection) {
          throw new Error('The request was accepted, but the backend did not return the connection.');
        }
        toast.success(`Connected with ${actionTarget.request.senderName}!`);
      } else {
        response = await requestService.rejectRequest(actionTarget.request.id);
        if (response.data?.status !== expectedStatus) {
          throw new Error('The server did not confirm rejection.');
        }
        toast.info(`Request from ${actionTarget.request.senderName} rejected`);
      }
      setRequests((prev) => prev.map((request) => (
        request.id === actionTarget.request.id ? response.data : request
      )));
      window.dispatchEvent(new Event('skillswap:sidebar-counts-refresh'));
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || `Failed to ${actionTarget.action} request`);
    } finally {
      setProcessing(null);
      setActionTarget(null);
    }
  };

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  if (loading) return <div className="p-6"><Loading text="Loading received requests…" /></div>;

  const pending = requests.filter((r) => r.status === 'PENDING');
  const others = requests.filter((r) => r.status !== 'PENDING');

  const RequestCard = ({ req }) => {
    const profile = senderProfiles[req.senderId];
    const avatarColors = ['from-purple-500 to-pink-600', 'from-orange-500 to-red-500', 'from-teal-500 to-cyan-600'];
    const color = avatarColors[req.id % avatarColors.length];

    const statusConfig = {
      PENDING:   { cls: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      ACCEPTED:  { cls: 'bg-green-100 text-green-700', label: 'Accepted' },
      REJECTED:  { cls: 'bg-red-100 text-red-700', label: 'Rejected' },
      CANCELLED: { cls: 'bg-gray-100 text-gray-600', label: 'Cancelled' },
    };
    const statusInfo = statusConfig[req.status] || statusConfig.PENDING;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {getInitials(req.senderName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/students/${req.senderId}`} className="font-semibold text-gray-900 hover:text-blue-600">
                  {req.senderName}
                </Link>
                <p className="text-sm text-gray-500">{req.senderDepartment || 'Student'}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.cls}`}>{statusInfo.label}</span>
                <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
              </div>
            </div>

            {profile?.bio && <p className="text-xs text-gray-500 mt-2">{profile.bio}</p>}

            {req.message && (
              <p className="text-xs text-gray-600 mt-2 italic bg-gray-50 rounded-xl px-3 py-2">
                "{req.message}"
              </p>
            )}

            {profile && (
              <div className="mt-3 space-y-2">
                {profile.teachingSkills?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Can teach you:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.teachingSkills.slice(0, 5).map((s) => <SkillTag key={s.id} name={s.skillName} size="xs" />)}
                      {profile.teachingSkills.length > 5 && <span className="text-xs text-gray-400">+{profile.teachingSkills.length - 5}</span>}
                    </div>
                  </div>
                )}
                {profile.learningSkills?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Wants to learn:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.learningSkills.slice(0, 5).map((s) => <SkillTag key={s.id} name={s.skillName} size="xs" />)}
                      {profile.learningSkills.length > 5 && <span className="text-xs text-gray-400">+{profile.learningSkills.length - 5}</span>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {req.status === 'PENDING' && (
          <div className="mt-4 flex gap-3 justify-end">
            <button
              onClick={() => setActionTarget({ request: req, action: 'reject' })}
              disabled={processing === req.id}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <XCircle size={15} /> Reject
            </button>
            <button
              onClick={() => setActionTarget({ request: req, action: 'accept' })}
              disabled={processing === req.id}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {processing === req.id
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <CheckCircle size={15} />
              }
              Accept
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Received Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Review and respond to incoming skill exchange requests</p>
        </div>
        <button onClick={fetchRequests} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {loadError ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Couldn’t load received requests</h3>
          <p className="text-sm text-red-500">{loadError}</p>
          <button onClick={fetchRequests} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Inbox size={36} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No requests received</h3>
          <p className="text-gray-400 text-sm">When students send you exchange requests, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Clock size={14} className="text-yellow-500" />
                Pending Requests ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((req) => <RequestCard key={req.id} req={req} />)}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Past Requests ({others.length})</h2>
              <div className="space-y-3">
                {others.map((req) => <RequestCard key={req.id} req={req} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!actionTarget}
        title={actionTarget?.action === 'accept' ? 'Accept Request' : 'Reject Request'}
        message={
          actionTarget?.action === 'accept'
            ? `Accept the skill exchange request from ${actionTarget?.request.senderName}? They will appear in your connections.`
            : `Reject the request from ${actionTarget?.request.senderName}?`
        }
        confirmText={actionTarget?.action === 'accept' ? 'Accept' : 'Reject'}
        onConfirm={handleAction}
        onCancel={() => setActionTarget(null)}
        variant={actionTarget?.action === 'accept' ? 'primary' : 'danger'}
      />
      </div>
    </div>
  );
};

export default ReceivedRequests;

