// src/pages/ReportIssuePage.jsx
import { useState } from 'react';
import { FaPaperPlane, FaClock, FaCheckCircle } from 'react-icons/fa';

const mockIssues = [
  { id: 1, type: 'Missed Pickup', date: '2023-10-22', status: 'Resolved' },
  { id: 2, type: 'Overflowing Bin', date: '2023-10-28', status: 'In Progress' },
  { id: 3, type: 'Illegal Dumping', date: '2023-10-29', status: 'Submitted' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Submitted': { icon: <FaPaperPlane />, color: 'bg-blue-100 text-blue-800' },
    'In Progress': { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-800' },
    'Resolved': { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-800' },
  };
  const current = styles[status] || styles['Submitted'];
  return (
    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${current.color}`}>
      {current.icon}
      <span className="ml-2">{status}</span>
    </span>
  );
};

const ReportIssuePage = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Issue reported successfully!');
    // TODO: Send data to API
    setDescription('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Report a Waste Management Issue</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="issueType" className="block text-gray-700 text-lg font-bold mb-3">Type of Issue</label>
              <select id="issueType" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Missed Pickup</option>
                <option>Overflowing Bin</option>
                <option>Illegal Dumping</option>
                <option>Damaged Bin</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 text-lg font-bold mb-3">Description</label>
              <textarea id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Please provide details about the issue, including location if possible." required></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="attachment" className="block text-gray-700 text-lg font-bold mb-3">Attach a Photo (Optional)</label>
              <input type="file" id="attachment" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Submit Report
            </button>
          </form>
        </div>
        {/* History Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-bold mb-4">Your Reported Issues</h2>
            <ul className="space-y-4">
              {mockIssues.map(issue => (
                <li key={issue.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{issue.type}</p>
                      <p className="text-sm text-gray-500">Reported on: {issue.date}</p>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;