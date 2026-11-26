import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Users, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import matchService from '../services/matchService';
import requestService from '../services/requestService';
import { LoadingSkeleton } from '../components/Loading';
import StudentCard from '../components/StudentCard';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import authService from '../services/authService';

const EXCLUDED_TEST_PROFILE_EMAILS = new Set([
  'skillswap.filtertest.1795705078@example.com',
]);

const FindPartners = () => {
  const { toasts, removeToast, toast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchError, setMatchError] = useState('');
  const [totalMatches, setTotalMatches] = useState(0);
  const [filters, setFilters] = useState({ skill: '', department: '', college: '' });
  const [appliedFilters, setAppliedFilters] = useState({ skill: '', department: '', college: '' });
  const [requestStatuses, setRequestStatuses] = useState({});  // studentId → status
  const [sendingTo, setSendingTo] = useState(null);
  const [confirmStudent, setConfirmStudent] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchMatches = useCallback(async (f) => {
    setLoading(true);
    setMatchError('');
    try {
      const res = await matchService.searchMatches(f.skill, f.college, f.department);
      const currentStudentId = authService.getCurrentUser()?.studentId;
      const students = (res.data?.matches || []).filter(
        (student) => String(student.studentId) !== String(currentStudentId)
          && !EXCLUDED_TEST_PROFILE_EMAILS.has(String(student.email || '').trim().toLowerCase())
      );
      setMatches(students);
      setTotalMatches(students.length);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load matches. Check the server connection and try again.';
      setMatchError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Also fetch existing sent requests to show correct status
  const fetchSentRequests = useCallback(async () => {
    try {
      const res = await requestService.getSentRequests();
      const statusMap = {};
      const seenReceivers = new Set();
      (res.data || []).forEach((request) => {
        const receiverId = String(request.receiverId);
        if (!seenReceivers.has(receiverId)) {
          seenReceivers.add(receiverId);
          if (request.status !== 'ACCEPTED') {
            statusMap[receiverId] = request.status;
          }
        }
      });
      setRequestStatuses(statusMap);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load your existing request statuses');
    }
  }, [toast]);

  useEffect(() => {
    fetchMatches({ skill: '', department: '', college: '' });
    fetchSentRequests();
  }, [fetchMatches, fetchSentRequests]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    fetchMatches(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const empty = { skill: '', department: '', college: '' };
    setFilters(empty);
    setAppliedFilters(empty);
    fetchMatches(empty);
  };

  const handleSendRequest = (student) => {
    setConfirmStudent(student);
    setRequestMessage('');
  };

  const handleConfirmSend = async () => {
    if (!confirmStudent) return;
    setSendingTo(confirmStudent.studentId);
    try {
      const response = await requestService.sendRequest(
        confirmStudent.studentId,
        requestMessage.trim() || undefined
      );
      const createdRequest = response.data;
      if (!createdRequest?.id || createdRequest.status !== 'PENDING') {
        throw new Error('The server did not confirm a pending exchange request.');
      }
      setRequestStatuses((prev) => ({ ...prev, [createdRequest.receiverId]: createdRequest.status }));
      toast.success(`Request sent to ${createdRequest.receiverName}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to send request');
    } finally {
      setSendingTo(null);
      setConfirmStudent(null);
      setRequestMessage('');
    }
  };

  const hasFilters = appliedFilters.skill || appliedFilters.department || appliedFilters.college;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Learning Partners</h1>
            <p className="text-gray-500 text-sm mt-1">Discover students whose skills perfectly match yours</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <SlidersHorizontal size={15} /> Filters {hasFilters && <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>}
            </button>
            <button
              onClick={() => fetchMatches(appliedFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2"><Filter size={16} /> Filter Partners</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { key: 'skill', placeholder: 'Filter by skill (e.g. Python)', icon: <Search size={14} /> },
              { key: 'department', placeholder: 'Filter by department', icon: <Filter size={14} /> },
              { key: 'college', placeholder: 'Filter by college', icon: <Filter size={14} /> },
            ].map(({ key, placeholder }) => (
              <div key={key} className="relative">
                <input
                  type="text"
                  value={filters[key]}
                  onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              Apply Filters
            </button>
            {hasFilters && (
              <button onClick={handleClearFilters} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 px-4 py-2 text-sm font-medium transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{totalMatches} matching partner{totalMatches !== 1 ? 's' : ''} found</span>
          </div>
          {hasFilters && (
            <button onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : matchError ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-red-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Couldn’t load partners</h3>
          <p className="text-sm text-red-500 max-w-lg mx-auto">{matchError}</p>
          <button
            onClick={() => fetchMatches(appliedFilters)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No matching partners found</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            {hasFilters
              ? 'Try adjusting your filters. Only reciprocal skill matches are shown, and existing connections are excluded.'
              : 'Only reciprocal skill matches are shown, and students you are already connected with are excluded. Add or update your skills to improve your chances of finding a new partner.'}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            {hasFilters && (
              <button onClick={handleClearFilters} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Clear all filters
              </button>
            )}
            <Link to="/skills" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage my skills
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {matches.map((student) => (
            <StudentCard
              key={student.studentId}
              student={student}
              showMatchBadge
              requestStatus={requestStatuses[student.studentId]}
              onSendRequest={
                !['PENDING', 'ACCEPTED'].includes(requestStatuses[student.studentId])
                  ? () => handleSendRequest(student)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Send Request Confirmation */}
      {confirmStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmStudent(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <button onClick={() => setConfirmStudent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">Send Exchange Request</h3>
            <p className="text-gray-500 text-sm mb-4">
              Send a skill exchange request to <span className="font-medium text-gray-700">{confirmStudent.fullName}</span>
            </p>

            {confirmStudent.skillsYouTeachTheyLearn?.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-3 mb-3 text-xs text-emerald-700">
                <strong>You'll teach:</strong> {confirmStudent.skillsYouTeachTheyLearn.join(', ')}
              </div>
            )}
            {confirmStudent.skillsTheyTeachYouLearn?.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-3 mb-4 text-xs text-blue-700">
                <strong>You'll learn:</strong> {confirmStudent.skillsTheyTeachYouLearn.join(', ')}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Say hello and introduce yourself…"
                rows={3}
                maxLength={600}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{requestMessage.length}/600</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmStudent(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={!!sendingTo}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {sendingTo ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</> : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default FindPartners;

