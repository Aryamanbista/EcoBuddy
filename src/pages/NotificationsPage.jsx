import { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { getNotifications, markAllNotificationsAsRead } from '../api/api';
import { FaInfoCircle, FaCalendarCheck, FaExclamationCircle, FaRegBell, FaCheckCircle } from 'react-icons/fa';

const mockNotifications = [
  { id: 1, type: 'reminder', title: 'Pickup Reminder', message: 'Your general waste pickup is scheduled for tomorrow.', date: '2023-10-29', read: false },
  { id: 2, type: 'announcement', title: 'Community Announcement', message: 'The annual community cleanup day is this Saturday. Volunteers needed!', date: '2023-10-27', read: false },
  { id: 3, type: 'success', title: 'Pickup Confirmed', message: 'Your recyclable pickup for Oct 30 has been successfully scheduled.', date: '2023-10-25', read: true },
  { id: 4, type: 'update', title: 'Issue Update', message: 'The overflowing bin you reported has been resolved.', date: '2023-10-23', read: true },
];

const NotificationIcon = ({ type }) => {
  const icons = {
    reminder: <FaCalendarCheck className="text-blue-500" />,
    announcement: <FaInfoCircle className="text-indigo-500" />,
    success: <FaCheckCircle className="text-green-500" />,
    update: <FaExclamationCircle className="text-yellow-500" />,
  };
  return <div className="text-2xl mt-1">{icons[type] || <FaInfoCircle />}</div>;
};


const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(n => filter === 'unread' ? !n.read : true);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Optimistically update the UI for a faster user experience
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      alert("Failed to mark notifications as read.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Updates, reminders, and announcements from the community.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
        {/* Header with Filters */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-slate-100'
              }`}
            >
              Unread
            </button>
          </div>
          <button onClick={handleMarkAllAsRead} className="text-sm text-blue-600 font-semibold hover:underline">
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {loading ? <div className="text-center p-8">Loading notifications...</div> : (
          filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div key={notif.id} className="p-4 flex items-start space-x-4 hover:bg-slate-50 transition-colors">
                {!notif.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>}
                <div className={`flex-shrink-0 ${notif.read ? 'ml-5' : ''}`}>
                  <NotificationIcon type={notif.type} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{notif.title}</h4>
                  <p className="text-gray-600 text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <FaRegBell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;