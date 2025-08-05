// src/components/Layout.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaCalendarPlus, FaExclamationTriangle, FaHistory, FaBell, FaChartBar, FaSignOutAlt, FaUserCircle,FaUserShield, FaBullhorn } from 'react-icons/fa';

const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-4 my-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span className="ml-4 font-medium">{children}</span>
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
      <aside className="w-64 flex-shrink-0 bg-white text-blue-800 flex flex-col p-6 border-r shadow-lg">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            EcoBuddy
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="space-y-1">
          <SidebarLink to="/dashboard" icon={<FaTachometerAlt />}>Dashboard</SidebarLink>
          <SidebarLink to="/schedule-pickup" icon={<FaCalendarPlus />}>Schedule Pickup</SidebarLink>
          <SidebarLink to="/report-issue" icon={<FaExclamationTriangle />}>Report Issue</SidebarLink>
          <SidebarLink to="/history" icon={<FaHistory />}>Pickup History</SidebarLink>
          <SidebarLink to="/notifications" icon={<FaBell />}>Notifications</SidebarLink>
          <SidebarLink to="/reports" icon={<FaChartBar />}>Reports</SidebarLink>
        </nav>
        {user?.role === 'admin' && (
          <div className="px-4 py-4 border-t border-blue-700/50">
            <h3 className="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">Admin Panel</h3>
            <nav>
              <SidebarLink to="/admin/dashboard" icon={<FaUserShield />}>Admin Dashboard</SidebarLink>
              <SidebarLink to="/admin/issues" icon={<FaExclamationTriangle />}>Manage Issues</SidebarLink>
              <SidebarLink to="/admin/announce" icon={<FaBullhorn />}>Announce</SidebarLink>
            </nav>
          </div>
        )}
        </div>

        <div className="mt-auto p-4 border-t">
          <button onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg text-black hover:bg-red-600 hover:text-white transition-colors duration-200 hover:scale-105">
            <FaSignOutAlt />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Welcome, {user?.fullName}!</h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {user?.community}
              </span>
              <FaUserCircle className="text-2xl text-gray-400" />
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};