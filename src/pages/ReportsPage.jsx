import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { getUserReport } from '../api/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    {change && <p className="text-sm text-green-600 mt-1">{change}</p>}
  </div>
);

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await getUserReport();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch report data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const lineData = {
    labels: reportData?.pickupsOverTime.map(item => new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' })) || [],
    datasets: [{ label: 'Pickups', data: reportData?.pickupsOverTime.map(item => item.count) || [], fill: true, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.3 }]
  };

  const doughnutData = {
    labels: reportData?.pickupStats.map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)) || [],
    datasets: [{ data: reportData?.pickupStats.map(item => item.count) || [], backgroundColor: ['#3B82F6', '#10B981', '#6B7280'], borderWidth: 0 }]
  };

  if (loading) {
    return <div className="text-center p-8">Generating your reports...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Reports</h1>
        <p className="text-gray-600 mt-1">Insights into your waste management habits and impact.</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Pickups" value="107" change="+12% from last month" />
        <StatCard title="Recycling Rate" value="65%" change="+3% from last month" />
        <StatCard title="Issues Reported" value="4" change="-1 from last month" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Pickups Over Time</h3>
          <div className="relative h-80"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Waste Type Breakdown</h3>
          <div className="relative h-80"><Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;