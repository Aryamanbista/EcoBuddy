import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaUsers, FaTruck, FaExclamationTriangle, FaBullhorn, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-slate-700 text-white'
          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="ml-3 font-medium">{children}</span>
  </NavLink>
);

export const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-800 text-white flex flex-col">
        <div className="h-20 flex items-center justify-center text-2xl font-bold border-b border-slate-700">
          Admin Panel
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <AdminSidebarLink to="/admin/dashboard" icon={<FaTachometerAlt />}>Dashboard</AdminSidebarLink>
          <AdminSidebarLink to="/admin/users" icon={<FaUsers />}>Users</AdminSidebarLink>
          <AdminSidebarLink to="/admin/pickups" icon={<FaTruck />}>Pickups</AdminSidebarLink>
          <AdminSidebarLink to="/admin/issues" icon={<FaExclamationTriangle />}>Issues</AdminSidebarLink>
          <AdminSidebarLink to="/admin/announce" icon={<FaBullhorn />}>Announce</AdminSidebarLink>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-colors">
            <FaSignOutAlt />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-20 flex justify-between items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800">Community: {user?.community}</h1>
          <div className="text-sm text-gray-500">Logged in as {user?.fullName}</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};