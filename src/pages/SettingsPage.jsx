import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/api';

// A simple, stylish toggle switch component
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`${enabled ? 'bg-blue-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
  >
    <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
  </button>
);

const SettingsPage = () => {
  const { user, updateUserState } = useAuth();
  const [formData, setFormData] = useState({ fullName: '' });
  const [prefs, setPrefs] = useState({ pickupReminders: true });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName });
      setPrefs({ pickupReminders: user.notificationPreferences?.pickupReminders ?? true });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await updateUserProfile(formData);
      updateUserState(data); // Update global context
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  const handlePrefChange = async (prefName, value) => {
    const newPrefs = { ...prefs, [prefName]: value };
    setPrefs(newPrefs);
    setError('');
    setSuccess('');
    try {
      const { data } = await updateUserProfile({ notificationPreferences: { [prefName]: value } });
      updateUserState(data);
      setSuccess('Preferences updated!');
    } catch (err) {
      setError('Failed to update preferences.');
      // Revert optimistic UI update on error
      setPrefs(prefs);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Update your personal information.</p>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" id="email" value={user?.email || ''} disabled className="w-full p-2 border border-gray-300 rounded-lg bg-slate-100 cursor-not-allowed" />
            </div>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
              Save Profile
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="lg:col-span-3 border-t border-slate-200 my-4"></div>

        {/* Notification Preferences */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-500 text-sm mt-1">Manage how you receive alerts.</p>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">Pickup Reminders</h3>
              <p className="text-sm text-gray-500">Get an alert 24 hours before a scheduled pickup.</p>
            </div>
            <ToggleSwitch 
              enabled={prefs.pickupReminders} 
              onChange={() => handlePrefChange('pickupReminders', !prefs.pickupReminders)} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;