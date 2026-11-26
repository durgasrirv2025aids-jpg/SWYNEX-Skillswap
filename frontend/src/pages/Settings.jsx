import React from 'react';
import { Link } from 'react-router-dom';
import { User, Layers, Shield, LogOut, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = (name) => (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', desc: 'Update your name, college, department and bio', icon: User, path: '/profile' },
        { label: 'Manage Skills', desc: 'Add or remove teaching and learning skills', icon: Layers, path: '/skills' },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {getInitials(user?.fullName)}
          </div>
          <div>
            <h2 className="font-bold text-lg">{user?.fullName || 'Student'}</h2>
            <p className="text-blue-100 text-sm">{user?.email || ''}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Zap size={12} className="text-blue-200" />
              <span className="text-xs text-blue-200">{user?.role || 'STUDENT'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings groups */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.title}</p>
          </div>
          {group.items.map(({ label, desc, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>
      ))}

      {/* App info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Application</p>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={17} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">SkillSwap v1.0</p>
            <p className="text-xs text-gray-400 mt-0.5">Student Skill Exchange Platform</p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-red-50 border-b border-red-100">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Session</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors text-left"
        >
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <LogOut size={17} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-600 text-sm">Sign Out</p>
            <p className="text-xs text-gray-400 mt-0.5">Log out of your SkillSwap account</p>
          </div>
          <ChevronRight size={16} className="text-red-200" />
        </button>
      </div>
    </div>
  );
};

export default Settings;

