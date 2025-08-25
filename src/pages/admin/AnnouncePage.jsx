import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from '../../api/api';
import { FaPaperPlane, FaCheckCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AnnouncePage = () => {
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [editMode, setEditMode] = useState(null); // Will store the ID of the announcement being edited
  
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to fetch all past announcements
  const fetchAnnouncements = async () => {
    try {
      setListLoading(true);
      const { data } = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch past announcements.');
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  // Fetch announcements when the component loads
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Puts the form into edit mode
  const handleEditClick = (announcement) => {
    setEditMode(announcement._id);
    setFormData({ title: announcement.title, message: announcement.message });
    setSuccess(''); // Clear any previous success messages
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see the form
  };

  // Resets the form to its initial state
  const cancelEdit = () => {
    setEditMode(null);
    setFormData({ title: '', message: '' });
    setError('');
    setSuccess('');
  };

  // Handles the deletion of an announcement
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement for all community members? This action cannot be undone.')) {
      try {
        const { data } = await deleteAnnouncement(id);
        setSuccess(data.message);
        fetchAnnouncements(); // Refresh list after deleting
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete announcement.');
      }
    }
  };

  // Handles both creating a new announcement and updating an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editMode) {
        const { data } = await updateAnnouncement(editMode, formData);
        setSuccess(data.message);
      } else {
        const { data } = await createAnnouncement(formData);
        setSuccess(data.message);
      }
      cancelEdit(); // Reset the form
      fetchAnnouncements(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving the announcement.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Announcements</h1>
        <p className="text-gray-600 mt-1">{editMode ? 'You are currently editing an existing announcement.' : 'Create a new announcement or manage existing ones below.'}</p>
      </div>

      {/* --- Form Section for Creating/Editing --- */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            {editMode && (
              <button type="button" onClick={cancelEdit} className="text-sm text-gray-500 hover:text-gray-800 flex items-center transition-colors">
                <FaTimes className="mr-1"/> Cancel Edit
              </button>
            )}
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm flex items-center"><FaCheckCircle className="inline mr-2"/>{success}</div>}

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
            {loading ? 'Processing...' : (
              editMode ? <><FaEdit className="mr-2"/>Update Announcement</> : <><FaPaperPlane className="mr-2"/>Send to Community</>
            )}
          </button>
        </form>
      </div>

      {/* --- Section for Listing Past Announcements --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Past Announcements</h2>
        {listLoading ? <p className="text-center text-gray-500 py-4">Loading announcements...</p> : (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann._id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-gray-800">{ann.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{ann.message}</p>
                    <p className="text-xs text-gray-400 mt-2">Sent on {new Date(ann.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => handleEditClick(ann)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="Edit"><FaEdit /></button>
                    <button onClick={() => handleDelete(ann._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Delete"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-gray-500 text-center py-4">No announcements have been sent yet.</p>}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnnouncePage;