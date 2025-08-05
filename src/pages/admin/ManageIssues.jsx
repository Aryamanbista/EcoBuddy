import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/api';

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

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/issues');
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
      // Optimistic UI update for a better UX
      setIssues(prevIssues => prevIssues.map(issue =>
        issue._id === issueId ? { ...issue, status: newStatus } : issue
      ));
      
      await API.put(`/admin/issues/${issueId}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status. Reverting changes.");
      fetchIssues(); // Re-fetch to revert optimistic update on error
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Issues</h1>
        <p className="text-gray-600 mt-1">Review and update the status of all reported issues.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-700 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Issue Type</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-8">Loading issues...</td></tr>
            ) : issues.map(issue => (
              <tr key={issue._id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{issue.user.fullName}</td>
                <td className="px-6 py-4">{issue.issueType}</td>
                <td className="px-6 py-4 max-w-sm truncate">{issue.description}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManageIssues;