import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { getUserReport, exportUserReport } from '../api/api';
import { FaDownload } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <h4 className="text-sm font-medium text-gray-500 uppercase">{title}</h4>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    {change && <p className="text-sm text-green-600 mt-1">{change}</p>}
  </div>
);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly'); 
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportUserReport();
      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pickup-report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to export report", err);
      alert("Could not download the report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

 // Prepare data for charts dynamically
  const lineData = {
    labels: timeframe === 'monthly'
      ? reportData?.monthlyPickups.map(d => `${monthNames[d._id.month - 1]} '${String(d._id.year).slice(2)}`) || []
      : reportData?.weeklyPickups.map(d => `W${d._id.week} '${String(d._id.year).slice(2)}`) || [],
    datasets: [{
      label: 'Pickups',
      data: timeframe === 'monthly'
        ? reportData?.monthlyPickups.map(d => d.count) || []
        : reportData?.weeklyPickups.map(d => d.count) || [],
      fill: true, borderColor: 'rgb(59, 130, 246)', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.3
    }]
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
      <div className="flex justify-between items-center mb-8">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Reports</h1>
        <p className="text-gray-600 mt-1">Insights into your waste management habits and impact.</p>
      </div>
      <button 
          onClick={handleExport}
          disabled={exporting}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center transition-colors disabled:bg-blue-400"
        >
          <FaDownload className="mr-2"/>
          {exporting ? 'Exporting...' : 'Export as CSV'}
        </button>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Pickups Over Time</h3>
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1 text-sm font-semibold rounded-md ${timeframe === 'weekly' ? 'bg-white shadow' : 'text-slate-600'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1 text-sm font-semibold rounded-md ${timeframe === 'monthly' ? 'bg-white shadow' : 'text-slate-600'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="relative h-80">
            {loading ? <p>Loading chart data...</p> : <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Waste Type Breakdown</h3>
          <div className="relative h-80">
            {loading ? <p>Loading chart data...</p> : <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;