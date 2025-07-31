// src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { FaPlus, FaExclamation, FaHistory, FaBell, FaArrowRight } from 'react-icons/fa';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// A new component for Quick Action buttons
const ActionButton = ({ to, icon, title, subtitle }) => (
  <Link to={to} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-slate-200 flex items-center space-x-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </Link>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const nextPickup = { date: 'October 30, 2023', type: 'Recyclable' };
  const chartData = {
    labels: ['General', 'Recyclable', 'Organic'],
    datasets: [{ data: [4, 6, 2], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 4 }]
  };
  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { drawBorder: false } }, x: { grid: { display: false } } }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-600 mt-1">A summary of your waste management activity.</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionButton to="/schedule-pickup" icon={<FaPlus />} title="New Pickup" subtitle="Schedule a collection" />
        <ActionButton to="/report-issue" icon={<FaExclamation />} title="Report Issue" subtitle="Notify an administrator" />
        <ActionButton to="/history" icon={<FaHistory />} title="View History" subtitle="See all past pickups" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Pickup & Announcements */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Next Scheduled Pickup</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <p className="font-semibold text-blue-800">{nextPickup.type} Waste</p>
              <p className="text-sm text-blue-700">{nextPickup.date}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Community Updates</h3>
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full mt-1"><FaBell /></div>
              <div>
                <p className="text-gray-700">Holiday schedule changes announced for next week.</p>
                <Link to="/notifications" className="text-sm text-blue-600 font-semibold hover:underline flex items-center">
                  View details <FaArrowRight className="ml-1 text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Habits Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-gray-800 mb-2">Your Waste Habits</h3>
          <p className="text-sm text-gray-500 mb-4">Summary of pickups by type (last 30 days).</p>
          <div className="relative h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;