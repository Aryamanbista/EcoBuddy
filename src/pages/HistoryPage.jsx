import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { getPickups } from '../api/api.js';

const mockHistory = [
  { id: 1, date: '2023-10-25', type: 'Recyclable', status: 'Completed', requestId: 'REQ-7348' },
  { id: 2, date: '2023-10-18', type: 'General', status: 'Completed', requestId: 'REQ-7102' },
  { id: 3, date: '2023-10-11', type: 'Organic', status: 'Completed', requestId: 'REQ-6855' },
  { id: 4, date: '2023-10-04', type: 'General', status: 'Cancelled', requestId: 'REQ-6590' },
  { id: 5, date: '2023-09-28', type: 'Recyclable', status: 'Completed', requestId: 'REQ-6412' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Scheduled: 'bg-blue-100 text-blue-800',
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || ''}`}>{status}</span>;
};

const HistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await getPickups();
        setPickups(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pickup history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading your history...</div>;
  }
  
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pickup History</h1>
        <p className="text-gray-600 mt-1">A log of all your past and scheduled waste collections.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Table Header with Search */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg">Your Pickups</h3>
          <div className="relative">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by type..." className="pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Request ID</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Waste Type</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pickups.length > 0 ? (
                pickups.map((item) => (
                  <tr key={item._id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{new Date(item.scheduledDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 capitalize">{item.wasteType}</td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">No pickup history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;