// src/pages/NotificationsPage.jsx
import { FaInfoCircle, FaCalendarCheck, FaExclamationCircle } from 'react-icons/fa';

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
    success: <FaCalendarCheck className="text-blue-500" />,
    update: <FaExclamationCircle className="text-yellow-500" />,
  };
  return <div className="text-2xl">{icons[type] || <FaInfoCircle />}</div>;
};

const NotificationsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="p-4 border-b flex justify-end">
            <button className="text-sm text-blue-600 font-semibold hover:underline">Mark all as read</button>
        </div>
        <ul className="divide-y divide-gray-200">
          {mockNotifications.map(notif => (
            <li key={notif.id} className={`p-4 flex items-start space-x-4 ${!notif.read ? 'bg-blue-50' : 'bg-white'}`}>
              <NotificationIcon type={notif.type} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800">{notif.title}</h4>
                    {!notif.read && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>}
                </div>
                <p className="text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
              </div>
            </li>
          ))}
          {mockNotifications.length === 0 && (
            <p className="p-6 text-center text-gray-500">You have no new notifications.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsPage;