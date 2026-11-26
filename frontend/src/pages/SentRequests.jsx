import React, { useState, useEffect, useCallback } from 'react';
import { Send, Clock, CheckCircle, XCircle, Ban, RefreshCw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import requestService from '../services/requestService';
import matchService from '../services/matchService';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const statusConfig = {
  PENDING:   { label: 'Pending',   icon: Clock,         cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ACCEPTED:  { label: 'Accepted',  icon: CheckCircle,   cls: 'bg-green-100 text-green-700 border-green-200' },
  REJECTED:  { label: 'Rejected',  icon: XCircle,       cls: 'bg-red-100 text-red-700 border-red-200' },
  CANCELLED: { label: 'Cancelled', icon: Ban,           cls: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const SentRequests = () => {
  const { toasts, removeToast, toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [matchingDetails, setMatchingDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await requestService.getSentRequests();
      const sentRequests = res.data || [];
      setRequests(sentRequests);
      const matchResults = await Promise.allSettled(
        sentRequests.map(async (request) => {
          const response = await matchService.getMatchDetails(request.receiverId);
          return [request.id, response.data];
        })
      );
      const details = {};
      let failedMatches = false;
      matchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          details[result.value[0]] = result.value[1];
        } else {
          failedMatches = true;
        }
      });
      setMatchingDetails(details);
      if (failedMatches) {
        toast.error('Matching skill details are unavailable for some requests.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load sent requests';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(cancelTarget.id);
    try {
      const response = await requestService.cancelRequest(cancelTarget.id);
      if (response.data?.status !== 'CANCELLED') {
        throw new Error('The server did not confirm cancellation.');
      }
      setRequests((prev) => prev.map((request) => (
        request.id === cancelTarget.id ? response.data : request
      )));
      toast.success('Request cancelled');
      await fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel request');
    } finally {
      setCancelling(null);
      setCancelTarget(null);
    }
  };

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const filteredRequests = requests.filter((request) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesText = !query || [
      request.receiverName,
      request.receiverDepartment,
      request.message,
    ].some((value) => value?.toLowerCase().includes(query));
    return matchesText && (statusFilter === 'ALL' || request.status === statusFilter);
  });

  if (loading) return <div className="w-full p-6"><Loading text="Loading sent requests…" /></div>;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sent Requests</h1>
          <p className="text-gray-500 text-sm mt-1">Track all exchange requests you've sent</p>
        </div>
        <button onClick={fetchRequests} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {loadError ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Couldn’t load sent requests</h3>
          <p className="text-sm text-red-500">{loadError}</p>
          <button onClick={fetchRequests} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Send size={36} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No requests sent yet</h3>
          <p className="text-gray-400 text-sm">Go to "Find Partners" to discover and connect with matching students.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex flex-wrap gap-3 mb-2">
            {Object.entries(statusConfig).map(([status, { label, cls }]) => {
              const count = requests.filter((r) => r.status === status).length;
              if (count === 0) return null;
              return (
                <span key={status} className={`text-xs px-3 py-1 rounded-full border font-medium ${cls}`}>
                  {count} {label}
                </span>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-[1fr_190px] gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search recipients or messages"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter requests by status"
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            >
              <option value="ALL">All statuses</option>
              {Object.entries(statusConfig).map(([status, { label }]) => (
                <option key={status} value={status}>{label}</option>
              ))}
            </select>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-500">No sent requests match these filters.</p>
            </div>
          ) : filteredRequests.map((req) => {
            const statusInfo = statusConfig[req.status] || statusConfig.PENDING;
            const StatusIcon = statusInfo.icon;
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {getInitials(req.receiverName)}
                    </div>
                    <div>
                      <Link to={`/students/${req.receiverId}`} className="font-semibold text-gray-900 hover:text-blue-600">
                        {req.receiverName}
                      </Link>
                      <p className="text-sm text-gray-500">{req.receiverDepartment || 'Student'}</p>
                      {req.message && (
                        <p className="text-xs text-gray-500 mt-2 italic bg-gray-50 rounded-lg px-3 py-2 max-w-sm">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${statusInfo.cls}`}>
                      <StatusIcon size={12} /> {statusInfo.label}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
                  </div>
                </div>
                {matchingDetails[req.id] && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                      <strong>You teach:</strong> {matchingDetails[req.id].skillsYouTeachTheyLearn.join(', ')}
                    </p>
                    <p className="text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                      <strong>You learn:</strong> {matchingDetails[req.id].skillsTheyTeachYouLearn.join(', ')}
                    </p>
                  </div>
                )}
                {req.status === 'PENDING' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setCancelTarget(req)}
                      disabled={cancelling === req.id}
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium border border-red-100"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelTarget}
        title="Cancel Request"
        message={`Cancel your exchange request to ${cancelTarget?.receiverName}?`}
        confirmText="Yes, Cancel"
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
      </div>
    </div>
  );
};

export default SentRequests;

