import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportIssue, getIssues } from '../api/api';
import { FaPaperPlane, FaClock, FaCheckCircle, FaExclamationCircle, FaFileUpload, FaArrowRight, FaFileAlt, FaTimesCircle } from 'react-icons/fa';

const mockIssues = [
  { id: 1, type: 'Missed Pickup', date: '2023-10-22', status: 'Resolved' },
  { id: 2, type: 'Overflowing Bin', date: '2023-10-28', status: 'In Progress' },
  { id: 3, type: 'Illegal Dumping', date: '2023-10-29', status: 'Submitted' },
];

// Reusable StatusBadge from HistoryPage for consistency
const StatusBadge = ({ status }) => {
  const styles = {
    Submitted: { icon: <FaPaperPlane />, color: 'bg-blue-100 text-blue-800' },
    'In Progress': { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-800' },
    Resolved: { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-800' },
  };
  const current = styles[status] || { icon: <FaExclamationCircle />, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${current.color}`}>
      {current.icon}
      <span className="ml-1.5">{status}</span>
    </span>
  );
};

const ReportIssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ issueType: 'Missed Pickup', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data } = await getIssues();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // <-- Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportIssue(formData);
      setIsSubmitted(true);
      fetchIssues(); // Refresh the list of issues after submitting a new one
      setSelectedFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit issue.");
    }
  };

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-xl shadow-lg border border-slate-200 max-w-lg mx-auto">
        <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h2>
        <p className="text-gray-600 mb-6">Thank you for your feedback. Our team will review the issue and take appropriate action.</p>
        <button onClick={() => {
          setIsSubmitted(false);
          setFormData({ issueType: 'Missed Pickup', description: '' });
        }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Report Another Issue
        </button>
      </motion.div>
    );
  }


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-600 mt-1">Let us know about any problems so we can resolve them quickly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="issueType" className="block text-sm font-bold text-gray-700 mb-2">Type of Issue</label>
              <select id="issueType" name="issueType" value={formData.issueType} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Missed Pickup</option>
                <option>Overflowing Bin</option>
                <option>Illegal Dumping</option>
                <option>Damaged Bin</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description of Issue</label>
              <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please provide details about the issue, including location if possible." required></textarea>
            </div>
            <div className="mb-8">
              <label htmlFor="attachment" className="block text-sm font-bold text-gray-700 mb-2">Attach a Photo (Optional)</label>
              {selectedFile ? (
                // View when a file IS selected
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <FaFileAlt className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                  </div>
                  <button type="button" onClick={() => setSelectedFile(null)} className="text-red-500 hover:text-red-700">
                    <FaTimesCircle />
                  </button>
                </div>
              ) : (
                // View when NO file is selected
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg">
              Submit Report <FaArrowRight className="ml-2" />
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Reported Issues</h3>
            <div className="space-y-4">
              {loading ? <p>Loading issues...</p> : issues.map(issue => (
                <div key={issue._id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-800">{issue.issueType}</p>
                    <StatusBadge status={issue.status} />
                  </div>
                  <p className="text-sm text-gray-500">Reported on: {new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {!loading && issues.length === 0 && (
                <p className="text-center text-gray-500 py-8">No issues reported yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportIssuePage;