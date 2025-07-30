// src/pages/DashboardPage.jsx
import Card from '../components/Card';
import { FaCalendarPlus, FaExclamationTriangle, FaHistory, FaBell } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';

// Chart.js must be registered to be used
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const nextPickup = {
    date: 'October 30, 2023',
    type: 'Recyclable'
  };

  const chartData = {
    labels: ['General', 'Recyclable', 'Organic'],
    datasets: [{
      label: 'Your Pickups (Last 30 Days)',
      data: [4, 6, 2],
      backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue color
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };
  
  // Options for the chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // This is key to allowing the chart to fill the container's height
    plugins: {
      legend: {
        display: false, // Hiding legend for a cleaner look on the dashboard
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Here's a quick overview of your waste management activity.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Schedule Pickup" linkTo="/schedule-pickup" linkText="Schedule Now" icon={<FaCalendarPlus className="text-blue-500" />}>
          <p>Request a new waste collection for your household.</p>
        </Card>
        <Card title="Report an Issue" linkTo="/report-issue" linkText="Report Now" icon={<FaExclamationTriangle className="text-blue-500" />}>
          <p>Notify us about missed pickups or overflowing bins.</p>
        </Card>
        <Card title="View History" linkTo="/history" linkText="View All History" icon={<FaHistory className="text-blue-500" />}>
          <p>Access the records of all your past pickups.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card title="Your Waste Habits">
            <p className="mb-4 text-sm text-gray-500">A summary of your pickups by type over the last 30 days.</p>
            {/***************************************************************/}
            {/*                        THE FIX IS HERE                        */}
            {/***************************************************************/}
            <div className="relative h-72 w-full"> {/* <-- Wrapper with relative position and fixed height */}
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Upcoming & Recent Activity" icon={<FaBell className="text-blue-500"/>}>
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-4">
                    <p className="font-bold">Next Scheduled Pickup</p>
                    <p>{nextPickup.type} - {nextPickup.date}</p>
                </div>
                <div className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-r-lg">
                    <p className="font-bold">Community Announcement</p>
                    <p>Holiday pickup schedule change for next week. Check notifications for details.</p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;