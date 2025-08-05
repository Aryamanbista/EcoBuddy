import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaTruck, FaExclamationCircle } from 'react-icons/fa';
import API from '../../api/api'; // Use the default export

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of the community waste management system.</p>
      </div>
      {loading ? (
        <p>Loading stats...</p>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<FaUsers className="text-white text-2xl"/>} title="Total Users" value={stats.totalUsers} color="bg-blue-500"/>
          <StatCard icon={<FaTruck className="text-white text-2xl"/>} title="Total Pickups" value={stats.totalPickups} color="bg-green-500"/>
          <StatCard icon={<FaExclamationCircle className="text-white text-2xl"/>} title="Open Issues" value={stats.openIssues} color="bg-yellow-500"/>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;