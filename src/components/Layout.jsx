import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTachometerAlt, FaCalendarPlus, FaExclamationTriangle, FaHistory, FaBell, FaChartBar, FaSignOutAlt, FaChevronDown, FaCog } from 'react-icons/fa';
import { getPickups } from '../api/api';

// --- Sidebar Link for a WHITE background ---
const SidebarLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-blue-100 text-blue-700 font-semibold' // Active state: light blue background, dark blue text
          : 'text-slate-600 hover:bg-slate-100' // Inactive state: dark gray text, light gray hover
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

// --- User Profile Dropdown Component ---
const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-blue-600">
          {user?.fullName.charAt(0)}
        </div>
        <span className="font-semibold text-gray-700 hidden md:block">{user?.fullName}</span>
        <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-10 overflow-hidden"
          >
            <div className="p-4">
              <p className="font-bold text-gray-800">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {/* --- BORDER ADDED HERE --- */}
            <div className="p-4 border-t border-b border-slate-200">
              <p className="text-xs text-gray-400 uppercase mb-1">Community</p>
              <p className="font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {user?.community}
              </p>
            </div>
            <div className="border-t border-slate-200">
        <NavLink to="/settings" className="w-full text-left flex items-center p-4 text-sm text-slate-700 hover:bg-slate-50">
          <FaCog className="mr-3" />
          Settings
        </NavLink>
      </div>
            <button onClick={handleLogout} className="w-full text-left flex items-center p-4 text-sm text-red-500 hover:bg-red-50">
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export const Layout = ({ children }) => {
  const { user } = useAuth();

  // --- NEW NOTIFICATION LOGIC ---
  useEffect(() => {
    // This function will check for upcoming pickups and show an alert if needed.
    const checkUpcomingPickups = async () => {
      if (user?.notificationPreferences?.pickupReminders === false) {
      return;
    }
      try {
        const { data: pickups } = await getPickups();
        
        const now = new Date();
        const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

        for (const pickup of pickups) {
          // Only check pickups that are still scheduled
          if (pickup.status === 'Scheduled') {
            const scheduledDate = new Date(pickup.scheduledDate);
            const timeDifference = scheduledDate.getTime() - now.getTime();

            // Check if the pickup is within the next 24 hours but hasn't passed yet
            if (timeDifference > 0 && timeDifference <= twentyFourHoursInMillis) {
              const notificationKey = `notified_${pickup._id}`;

              // Check sessionStorage to see if we've already alerted for this pickup in this session
              if (!sessionStorage.getItem(notificationKey)) {
                // 1. Create and play the sound
                const audio = new Audio('/notification.mp3'); // Path to your sound file in /public
                audio.play();

                // 2. Format the message for the alert
                const friendlyDate = scheduledDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
                const friendlyTime = scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                const message = `Reminder: Your ${pickup.wasteType} waste pickup is scheduled for tomorrow around ${friendlyTime}!`;
                
                // 3. Show the alert
                alert(message);

                // 4. Mark this pickup as "notified" for this session to prevent spam
                sessionStorage.setItem(notificationKey, 'true');
              }
            }
          }
        }
      } catch (err) {
        // Silently fail is fine here, we don't want to bother the user if API fails
        console.error("Could not check for upcoming pickups:", err);
      }
    };

    // Only run the check if a user is logged in.
    if (user) {
      checkUpcomingPickups();
    }

  }, [user]); // The effect runs whenever the user state changes (i.e., on login)

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* --- FLOATING WHITE SIDEBAR --- */}
      <aside className="w-64 flex-shrink-0 bg-white flex flex-col shadow-lg border-r border-slate-200">
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-center text-2xl font-bold tracking-wider text-blue-600 border-b border-slate-200">
          WasteWise
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav>
            <SidebarLink to="/dashboard" icon={<FaTachometerAlt />}>Dashboard</SidebarLink>
            <SidebarLink to="/schedule-pickup" icon={<FaCalendarPlus />}>Schedule Pickup</SidebarLink>
            <SidebarLink to="/report-issue" icon={<FaExclamationTriangle />}>Report Issue</SidebarLink>
            <SidebarLink to="/history" icon={<FaHistory />}>History</SidebarLink>
            <SidebarLink to="/notifications" icon={<FaBell />}>Notifications</SidebarLink>
            <SidebarLink to="/reports" icon={<FaChartBar />}>Reports</SidebarLink>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modernized Header */}
        <header className="bg-white h-20 flex justify-end items-center px-8 border-b border-slate-200">
          <UserProfileDropdown />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-8">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};