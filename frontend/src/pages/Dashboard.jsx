import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Users, Send, Inbox, Link2, BookOpen, GraduationCap, Plus, Search, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import studentService from '../services/studentService';
import skillService from '../services/skillService';
import requestService from '../services/requestService';
import connectionService from '../services/connectionService';
import matchService from '../services/matchService';
import Loading from '../components/Loading';
import SkillTag from '../components/SkillTag';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {loading
        ? <div className="h-7 w-10 bg-gray-200 animate-pulse rounded-lg" />
        : <span className="text-2xl font-bold text-gray-900">{value}</span>
      }
    </div>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { toasts, removeToast, toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [connections, setConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pR, tR, lR, cR, sR, rR, mR] = await Promise.allSettled([
          studentService.getMyProfile(),
          skillService.getMyStudentSkills('TEACH'),
          skillService.getMyStudentSkills('LEARN'),
          connectionService.getMyConnections(),
          requestService.getSentRequests(),
          requestService.getReceivedRequests(),
          matchService.getMatches(),
        ]);
        const failures = [];
        const nextUnavailable = {};
        const applyResult = (key, result, setter, label, value = (response) => response.data) => {
          if (result.status === 'fulfilled') {
            setter(value(result.value));
          } else {
            nextUnavailable[key] = true;
            failures.push(label);
          }
        };
        applyResult('profile', pR, setProfile, 'profile', (response) => response.data);
        applyResult('teaching', tR, setTeachingSkills, 'teaching skills', (response) => response.data || []);
        applyResult('learning', lR, setLearningSkills, 'learning skills', (response) => response.data || []);
        applyResult('connections', cR, setConnections, 'connections', (response) => response.data || []);
        applyResult('sentRequests', sR, setSentRequests, 'sent requests', (response) => response.data || []);
        applyResult('receivedRequests', rR, setReceivedRequests, 'received requests', (response) => response.data || []);
        applyResult('matches', mR, setMatchCount, 'partner matches', (response) => response.data?.totalMatches ?? 0);
        setUnavailable(nextUnavailable);
        if (failures.length > 0) {
          toast.error(`Could not load dashboard data: ${failures.join(', ')}.`);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const pendingReceived = receivedRequests.filter((r) => r.status === 'PENDING').length;

  const quickActions = [
    { label: 'Add Skills',    path: '/skills',            icon: Plus,   color: 'bg-blue-600',    desc: 'Manage your skills' },
    { label: 'Edit Profile',  path: '/profile',          icon: User,   color: 'bg-cyan-600',    desc: 'Update your profile' },
    { label: 'Find Partners', path: '/find-partners',     icon: Search, color: 'bg-indigo-600',  desc: 'Discover matches' },
    { label: 'Sent Requests', path: '/sent-requests',     icon: Send,   color: 'bg-violet-600',  desc: 'Track your requests' },
    { label: 'Received Requests', path: '/received-requests', icon: Inbox, color: 'bg-purple-600', desc: 'Pending requests', badge: pendingReceived },
    { label: 'Connections',   path: '/connections',       icon: Link2,  color: 'bg-emerald-600', desc: 'Your network' },
  ];

  const statusColors = {
    PENDING:   'bg-yellow-100 text-yellow-700',
    ACCEPTED:  'bg-green-100 text-green-700',
    REJECTED:  'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
  };

  const firstName = profile?.fullName?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Student';
  const subtitle = profile?.department && profile?.collegeName
    ? `${profile.department} · ${profile.collegeName}`
    : profile?.department || profile?.collegeName || "Here's your skill exchange overview";

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Toast toasts={toasts} removeToast={removeToast} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {loading ? 'Welcome back!' : `Welcome back, ${firstName}! 👋`}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
          </div>
          <Link
            to="/find-partners"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors self-start sm:self-center flex-shrink-0"
          >
            <Search size={16} /> Find Partners
          </Link>
        </div>

        {/* Stats — 2 cols on mobile, 3 on md, 6 on xl */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Teaching Skills"  value={unavailable.teaching ? '—' : teachingSkills.length} icon={BookOpen} color="bg-emerald-500" loading={loading} />
          <StatCard label="Learning Skills"  value={unavailable.learning ? '—' : learningSkills.length} icon={Layers} color="bg-blue-500" loading={loading} />
          <StatCard label="Skill Matches"    value={unavailable.matches ? '—' : matchCount} icon={Users} color="bg-indigo-500" loading={loading} />
          <StatCard label="Sent Requests"    value={unavailable.sentRequests ? '—' : sentRequests.length} icon={Send} color="bg-violet-500" loading={loading} />
          <StatCard label="Pending Requests" value={unavailable.receivedRequests ? '—' : pendingReceived} icon={Inbox} color="bg-orange-500" loading={loading} />
          <StatCard label="Connections"      value={unavailable.connections ? '—' : connections.length} icon={Link2} color="bg-purple-500" loading={loading} />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {quickActions.map(({ label, path, icon: Icon, color, desc, badge }) => (
              <Link
                key={path}
                to={path}
                className="relative bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 text-center shadow-sm hover:shadow-md transition-all group"
              >
                {badge > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Skills summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">My Skills</h2>
              <Link to="/skills" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? <Loading size="sm" text="" /> : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                  <BookOpen size={12} className="text-emerald-500" /> Can Teach ({unavailable.teaching ? '—' : teachingSkills.length})
                  </p>
                  {unavailable.teaching ? (
                  <p className="text-sm text-red-500">Teaching skills could not be loaded.</p>
                  ) : teachingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {teachingSkills.slice(0, 8).map((s) => <SkillTag key={s.id} name={s.skillName} />)}
                      {teachingSkills.length > 8 && <span className="text-xs text-gray-400">+{teachingSkills.length - 8} more</span>}
                    </div>
                  ) : <p className="text-sm text-gray-400 italic">No teaching skills added yet</p>}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <GraduationCap size={12} className="text-blue-500" /> Want to Learn ({unavailable.learning ? '—' : learningSkills.length})
                  </p>
                  {unavailable.learning ? (
                    <p className="text-sm text-red-500">Learning skills could not be loaded.</p>
                  ) : learningSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {learningSkills.slice(0, 8).map((s) => <SkillTag key={s.id} name={s.skillName} />)}
                      {learningSkills.length > 8 && <span className="text-xs text-gray-400">+{learningSkills.length - 8} more</span>}
                    </div>
                  ) : <p className="text-sm text-gray-400 italic">No learning skills added yet</p>}
                </div>
                {teachingSkills.length === 0 && learningSkills.length === 0 && (
                  <Link to="/skills" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus size={14} /> Add your first skill
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sent requests */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Sent Requests</h2>
              <Link to="/sent-requests" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? <Loading size="sm" text="" /> : sentRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Send size={32} className="text-gray-200" />
                <p className="text-sm text-gray-400">No requests sent yet</p>
                <Link to="/find-partners" className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <Search size={12} /> Find Partners
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {sentRequests.slice(0, 4).map((req) => (
                  <div key={req.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{req.receiverName}</p>
                      <p className="text-xs text-gray-400 truncate">{req.receiverDepartment || 'Student'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
