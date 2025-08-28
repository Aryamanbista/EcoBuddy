import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaTruck, FaExclamationCircle } from 'react-icons/fa';
import API from '../../api/api'; 
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

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
  const [chartData, setChartData] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats and chart data in parallel
        const [statsRes, chartsRes] = await Promise.all([
          getAdminStats(),
          getAdminChartData()
        ]);
        setStats(statsRes.data);
        setChartData(chartsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare data for the Line chart
  const lineChartData = {
    labels: chartData?.pickupVolume.map(d => d._id) || [],
    datasets: [{
      label: 'Pickups per Day',
      data: chartData?.pickupVolume.map(d => d.count) || [],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.3,
    }],
  };

  // Prepare data for the Doughnut chart
  const doughnutChartData = {
    labels: chartData?.pickupBreakdown.map(d => d._id.charAt(0).toUpperCase() + d._id.slice(1)) || [],
    datasets: [{
      data: chartData?.pickupBreakdown.map(d => d.count) || [],
      backgroundColor: ['#3B82F6', '#10B981', '#6B7280'],
      borderWidth: 0,
    }],
  };
  
  const chartOptions = { responsive: true, maintainAspectRatio: false };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <span className='selenium'></span>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Community Dashboard</h1>
      {loading ? <p>Loading dashboard...</p> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<FaUsers className="text-white text-2xl"/>} title="Community Users" value={stats?.totalUsers ?? 0} color="bg-blue-500"/>
            <StatCard icon={<FaTruck className="text-white text-2xl"/>} title="Total Pickups" value={stats?.totalPickups ?? 0} color="bg-green-500"/>
            <StatCard icon={<FaExclamationCircle className="text-white text-2xl"/>} title="Open Issues" value={stats?.openIssues ?? 0} color="bg-yellow-500"/>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Pickup Volume (Last 30 Days)</h3>
              <div className="relative h-80">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg mb-4">Pickup Breakdown</h3>
              <div className="relative h-80">
                <Doughnut data={doughnutChartData} options={{...chartOptions, plugins: { legend: { position: 'bottom' }}}} />
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;