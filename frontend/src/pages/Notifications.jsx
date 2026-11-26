import React, { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import notificationService from '../services/notificationService';

const Notifications = () => {
  const { toasts, removeToast, toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load notifications';
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (notification) => {
    setMarkingId(notification.id);
    try {
      const response = await notificationService.markAsRead(notification.id);
      if (String(response.data?.id) !== String(notification.id) || !response.data.read) {
        throw new Error('The server did not confirm that notification was read.');
      }
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? response.data : item
      )));
      window.dispatchEvent(new Event('skillswap:sidebar-counts-refresh'));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to mark notification as read');
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const response = await notificationService.markAllAsRead();
      if (typeof response.data !== 'number') {
        throw new Error('The server did not confirm the notifications were updated.');
      }
      await fetchNotifications();
      window.dispatchEvent(new Event('skillswap:sidebar-counts-refresh'));
      toast.success(`${response.data} notification${response.data === 1 ? '' : 's'} marked as read`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to mark notifications as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const formatDate = (date) => date
    ? new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Toast toasts={toasts} removeToast={removeToast} />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              title="Refresh notifications"
            >
              <RefreshCw size={16} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
              >
                <CheckCheck size={16} />
                {markingAll ? 'Updating…' : 'Mark all read'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <Loading text="Loading notifications…" />
        ) : loadError ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Couldn’t load notifications</h2>
            <p className="text-sm text-red-500">{loadError}</p>
            <button onClick={fetchNotifications} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Bell size={36} className="text-gray-200 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">You’re all caught up</h2>
            <p className="text-sm text-gray-400">New requests and connection updates will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm ${
                  notification.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Bell size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h2 className="font-semibold text-gray-900">{notification.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message?.replace(/\s*\(Student A -> B: \[\] \| Student B -> A: \[\]\)$/, '')}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkRead(notification)}
                          disabled={markingId === notification.id}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 self-start"
                        >
                          {markingId === notification.id ? 'Updating…' : 'Mark as read'}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span>{notification.type}</span>
                      {notification.createdAt && <span>· {formatDate(notification.createdAt)}</span>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
