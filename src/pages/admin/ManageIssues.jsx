import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminIssues, updateIssueStatus } from '../../api/api';
import { FaSearch } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Scheduled: 'bg-blue-100 text-blue-800',
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || ''}`}>{status}</span>;
};

const ManageIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW State for Filtering and Searching ---
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Submitted', 'In Progress', 'Resolved'
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await getAdminIssues();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      setIssues(prevIssues => prevIssues.map(issue =>
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ));
      await updateIssueStatus(issueId, newStatus);
    } catch (err) {
      alert("Failed to update status. Reverting changes.");
      fetchIssues();
    }
  };
  
  // --- NEW Derived State for Rendering ---
  const filteredIssues = issues.filter(issue => {
    const statusMatch = statusFilter === 'all' || issue.status === statusFilter;
    
    const searchMatch = searchTerm === '' || 
      (issue.user?.fullName && issue.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issueType.toLowerCase().includes(searchTerm.toLowerCase());
      
    return statusMatch && searchMatch;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Issues</h1>
      
      {/* --- NEW Filter and Search Controls --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-2 border border-gray-300 rounded-lg text-sm w-72 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">User</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">Issue</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-600">Reported On</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-600">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr><td colSpan="5" className="text-center p-8">Loading issues...</td></tr>
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map(issue => (
                <tr key={issue._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{issue.user?.fullName || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{issue.user?.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{issue.issueType}</div>
                    <div className="text-xs text-slate-500 max-w-sm truncate">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={issue.status}/></td>
                  <td className="px-6 py-4 text-center">
                    <select 
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="p-1 border border-gray-300 rounded-md text-xs bg-white"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center p-8 text-slate-500">No issues found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManageIssues;