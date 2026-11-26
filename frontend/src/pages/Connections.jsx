import React, { useState, useEffect, useCallback } from 'react';
import { Link2, Search, Mail, GraduationCap, BookOpen, Calendar, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import connectionService from '../services/connectionService';
import skillService from '../services/skillService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const Connections = () => {
  const { toasts, removeToast, toast } = useToast();
  const [connections, setConnections] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [removeTarget, setRemoveTarget] = useState(null);
  const [partnerSkills, setPartnerSkills] = useState({});

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await connectionService.getMyConnections();
      const conns = res.data || [];
      setConnections(conns);
      setFiltered(conns);
      // Fetch skills for each partner
      const skillResults = await Promise.allSettled(
        conns.map(async (connection) => {
          const [teachResponse, learnResponse] = await Promise.all([
            skillService.getStudentSkillsByStudentId(connection.partnerId, 'TEACH'),
            skillService.getStudentSkillsByStudentId(connection.partnerId, 'LEARN'),
          ]);
          return [connection.partnerId, {
            teach: teachResponse.data || [],
            learn: learnResponse.data || [],
          }];
        })
      );
      const skillsByPartner = {};
      let failedSkills = false;
      skillResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          skillsByPartner[result.value[0]] = result.value[1];
        } else {
          failedSkills = true;
        }
      });
      setPartnerSkills(skillsByPartner);
      if (failedSkills) {
        toast.error('Some connection skills could not be loaded.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load connections';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  useEffect(() => {
    if (!searchTerm.trim()) { setFiltered(connections); return; }
    const q = searchTerm.toLowerCase();
    setFiltered(connections.filter((c) =>
      c.partnerName?.toLowerCase().includes(q) ||
      c.partnerDepartment?.toLowerCase().includes(q) ||
      c.partnerCollege?.toLowerCase().includes(q)
    ));
  }, [searchTerm, connections]);

  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      await connectionService.removeConnection(removeTarget.connectionId);
      const updated = connections.filter((c) => c.connectionId !== removeTarget.connectionId);
      setConnections(updated);
      setFiltered(updated.filter((c) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return c.partnerName?.toLowerCase().includes(q) || c.partnerDepartment?.toLowerCase().includes(q);
      }));
      toast.success('Connection removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove connection');
    } finally {
      setRemoveTarget(null);
    }
  };

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  if (loading) return <div className="p-6"><Loading text="Loading connections…" /></div>;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Connections</h1>
          <p className="text-gray-500 text-sm mt-1">{connections.length} accepted skill exchange connection{connections.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={fetchConnections} className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors self-start sm:self-auto" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {connections.length > 0 && (
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search connections by name, department…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors max-w-md"
          />
        </div>
      )}

      {loadError ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Couldn’t load connections</h3>
          <p className="text-sm text-red-500">{loadError}</p>
          <button onClick={fetchConnections} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Link2 size={36} className="text-gray-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No connections yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            When someone accepts your exchange request (or you accept theirs), they appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No connections match your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((conn) => {
            const skills = partnerSkills[conn.partnerId];
            const avatarColors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-500'];
            const color = avatarColors[conn.connectionId % avatarColors.length];

            return (
              <div key={conn.connectionId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {getInitials(conn.partnerName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{conn.partnerName}</h3>
                      {conn.partnerDepartment && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <BookOpen size={10} /> {conn.partnerDepartment}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setRemoveTarget(conn)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-400 transition-all rounded-lg hover:bg-red-50 flex-shrink-0"
                    title="Remove connection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {conn.partnerEmail && (
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                    <Mail size={11} className="text-gray-400" /> {conn.partnerEmail}
                  </p>
                )}
                {conn.partnerCollege && (
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                    <GraduationCap size={11} className="text-gray-400" /> {conn.partnerCollege}
                  </p>
                )}
                {conn.connectedAt && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
                    <Calendar size={11} /> Connected {formatDate(conn.connectedAt)}
                  </p>
                )}

                {conn.partnerBio && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{conn.partnerBio}</p>
                )}

                {skills && (
                  <div className="space-y-2 mb-4">
                    {skills.teach.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Teaches:</p>
                        <div className="flex flex-wrap gap-1">
                          {skills.teach.slice(0, 4).map((s) => <SkillTag key={s.id} name={s.skillName} size="xs" />)}
                          {skills.teach.length > 4 && <span className="text-xs text-gray-400">+{skills.teach.length - 4}</span>}
                        </div>
                      </div>
                    )}
                    {skills.learn.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Learning:</p>
                        <div className="flex flex-wrap gap-1">
                          {skills.learn.slice(0, 4).map((s) => <SkillTag key={s.id} name={s.skillName} size="xs" />)}
                          {skills.learn.length > 4 && <span className="text-xs text-gray-400">+{skills.learn.length - 4}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to={`/students/${conn.partnerId}`}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                >
                  View Full Profile <ArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remove Connection"
        message={`Remove your connection with ${removeTarget?.partnerName}?`}
        confirmText="Remove"
        onConfirm={handleRemove}
        onCancel={() => setRemoveTarget(null)}
      />
      </div>
    </div>
  );
};

export default Connections;

