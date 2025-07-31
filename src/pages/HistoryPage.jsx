// src/pages/HistoryPage.jsx
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

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
              {mockHistory.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.requestId}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;