import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Layers, Users, Send, Inbox, Link2,
  Settings, LogOut, Menu, X, Zap, Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import requestService from '../services/requestService';
import notificationService from '../services/notificationService';
import Toast from './Toast';
import useToast from '../hooks/useToast';

const navItems = [
  { label: 'Dashboard',         path: '/dashboard',         icon: LayoutDashboard },
  { label: 'My Profile',        path: '/profile',           icon: User },
  { label: 'My Skills',         path: '/skills',            icon: Layers },
  { label: 'Find Partners',     path: '/find-partners',     icon: Users },
  { label: 'Sent Requests',     path: '/sent-requests',     icon: Send },
  { label: 'Received Requests', path: '/received-requests', icon: Inbox },
  { label: 'My Connections',    path: '/connections',       icon: Link2 },
  { label: 'Notifications',     path: '/notifications',     icon: Bell },
  { label: 'Settings',          path: '/settings',          icon: Settings },
];

const getInitials = (name) =>
  (name || '?').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const SidebarInner = ({ onClose, user, location, onLogout, pendingRequestCount, unreadNotificationCount }) => (
  <div className="flex flex-col h-full bg-white">
    {/* Logo */}
    <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100 flex-shrink-0">
      <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">SkillSwap</span>
      </Link>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={18} className={`flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="flex-1 truncate">{label}</span>
            {label === 'Received Requests' && pendingRequestCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                {pendingRequestCount}
              </span>
            )}
            {label === 'Notifications' && unreadNotificationCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
            {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />}
          </Link>
        );
      })}
    </nav>

    {/* User + Logout */}
    <div className="px-3 py-4 border-t border-gray-100 flex-shrink-0 space-y-1">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {getInitials(user?.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName || 'Student'}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} className="flex-shrink-0" />
        Logout
      </button>
    </div>
  </div>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const { toasts, removeToast, toast } = useToast();

  useEffect(() => {
    let active = true;
    const loadCounts = async () => {
      const [requestsResult, notificationsResult] = await Promise.allSettled([
        requestService.getReceivedRequests(),
        notificationService.getUnreadNotifications(),
      ]);
      if (!active) return;

      let failed = false;
      if (requestsResult.status === 'fulfilled') {
        setPendingRequestCount(
          (requestsResult.value.data || []).filter((request) => request.status === 'PENDING').length
        );
      } else {
        failed = true;
      }

      if (notificationsResult.status === 'fulfilled') {
        setUnreadNotificationCount((notificationsResult.value.data || []).length);
      } else {
        failed = true;
      }

      if (failed) {
        toast.error('Could not refresh all request and notification counts.');
      }
    };

    loadCounts();
    window.addEventListener('skillswap:sidebar-counts-refresh', loadCounts);
    return () => {
      active = false;
      window.removeEventListener('skillswap:sidebar-counts-refresh', loadCounts);
    };
  }, [location.pathname, toast]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 border-r border-gray-100">
        <SidebarInner
          onClose={() => {}}
          user={user}
          location={location}
          onLogout={handleLogout}
          pendingRequestCount={pendingRequestCount}
          unreadNotificationCount={unreadNotificationCount}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">SkillSwap</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full shadow-2xl flex-shrink-0">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>
            <SidebarInner
              onClose={() => setMobileOpen(false)}
              user={user}
              location={location}
              onLogout={handleLogout}
              pendingRequestCount={pendingRequestCount}
              unreadNotificationCount={unreadNotificationCount}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
