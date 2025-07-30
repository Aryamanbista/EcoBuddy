import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  // Mock data for charts
  const pickupData = {
    labels: ['General', 'Recyclable', 'Organic'],
    datasets: [{
      label: '# of Pickups This Month',
      data: [12, 19, 5],
      backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
    }]
  };

  const issuesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Issues Reported Per Week',
      data: [3, 5, 2, 4],
      fill: false,
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1,
    }]
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Waste Management Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pickup Statistics Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pickup Statistics by Type</h2>
          <Bar data={pickupData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Issues Over Time Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Issues Reported Over Time</h2>
          <Line data={issuesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;