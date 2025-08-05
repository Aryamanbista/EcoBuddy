import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminPickups } from '../../api/api';
import { FaSearch } from 'react-icons/fa';

const StatusBadge = ({ status }) => { /* ... (same as before) ... */ };

const ManagePickupsPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        setLoading(true);
        const { data } = await getAdminPickups();
        setPickups(data);
      } catch (err) {
        console.error("Failed to fetch pickups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPickups();
  }, []);
  
  const filteredPickups = pickups.filter(pickup => 
    pickup.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pickup.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Community Pickups</h1>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by user or type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" 
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">User</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">Waste Type</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">Scheduled Date</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center p-8">Loading pickups...</td></tr>
            ) : filteredPickups.map(pickup => (
              <tr key={pickup._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{pickup.user.fullName}</td>
                <td className="px-6 py-4 capitalize">{pickup.wasteType}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(pickup.scheduledDate).toLocaleString()}</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={pickup.status} /></td>
              </tr>
            ))}
             { !loading && filteredPickups.length === 0 && (
              <tr><td colSpan="4" className="text-center p-8 text-slate-500">No pickups found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManagePickupsPage;