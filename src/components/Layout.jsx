// src/components/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaCalendarPlus, FaExclamationTriangle, FaHistory, FaBell, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg transition-colors ${
        isActive ? 'bg-blue-700 text-white' : 'text-gray-200 hover:bg-blue-600 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // <-- THE FIX: Redirect to the landing page
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar (with blue theme) */}
      <aside className="w-64 flex-shrink-0 bg-blue-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8">WasteWise</div>
        <nav>
          <SidebarLink to="/dashboard" icon={<FaTachometerAlt />}>Dashboard</SidebarLink>
          <SidebarLink to="/schedule-pickup" icon={<FaCalendarPlus />}>Schedule Pickup</SidebarLink>
          <SidebarLink to="/report-issue" icon={<FaExclamationTriangle />}>Report Issue</SidebarLink>
          <SidebarLink to="/history" icon={<FaHistory />}>Pickup History</SidebarLink>
          <SidebarLink to="/notifications" icon={<FaBell />}>Notifications</SidebarLink>
          <SidebarLink to="/reports" icon={<FaChartBar />}>Reports</SidebarLink>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg text-gray-200 hover:bg-red-600 hover:text-white transition-colors">
            <FaSignOutAlt />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Welcome, {user?.fullName}!</h1>
            <div className="text-sm text-gray-500">{user?.community}</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};