import { useState } from 'react';
import { motion } from 'framer-motion';
import { createAnnouncement } from '../../api/api';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

const AnnouncePage = () => {
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await createAnnouncement(formData);
      setSuccess(data.message);
      setFormData({ title: '', message: '' }); // Clear form on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send announcement.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Announcement</h1>
        <p className="text-gray-600 mt-1">Send a notification to all members of your community.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center space-x-2">
              <FaCheckCircle />
              <span>{success}</span>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Holiday Schedule Change"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide the full details of the announcement here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Sending...'
            ) : (
              <>
                <FaPaperPlane className="mr-2" /> Send to Community
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AnnouncePage;