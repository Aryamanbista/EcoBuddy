// src/pages/DashboardPage.jsx
import Card from '../components/Card';
import { FaCalendarPlus, FaExclamationTriangle, FaHistory, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2'; // For the graph preview

// Chart.js must be registered to be used
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const DashboardPage = () => {
  const { user } = useAuth();

  const nextPickup = {
    date: 'October 30, 2023',
    type: 'Recyclable'
  };

  // Mock data for the dashboard chart
  const chartData = {
    labels: ['General', 'Recyclable', 'Organic'],
    datasets: [{
      label: 'Your Pickups (Last 30 Days)',
      data: [4, 6, 2],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Here's a quick overview of your waste management activity.</p>
      
      {/* Quick Stats & Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Schedule Pickup" linkTo="/schedule-pickup" linkText="Schedule Now" icon={<FaCalendarPlus />}>
          <p>Request a new waste collection for your household.</p>
        </Card>
        <Card title="Report an Issue" linkTo="/report-issue" linkText="Report Now" icon={<FaExclamationTriangle />}>
          <p>Notify us about missed pickups, overflowing bins, etc.</p>
        </Card>
        <Card title="View History" linkTo="/history" linkText="View All History" icon={<FaHistory />}>
          <p>Access the records of all your past pickups.</p>
        </Card>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card title="Your Waste Habits">
            <p className="mb-4">A summary of your pickups by type over the last 30 days.</p>
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Upcoming & Recent Activity" icon={<FaBell />}>
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-4">
                    <p className="font-bold">Next Scheduled Pickup</p>
                    <p>{nextPickup.type} - {nextPickup.date}</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg">
                    <p className="font-bold">Community Announcement</p>
                    <p>Holiday pickup schedule change for next week. Click notifications to learn more.</p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;