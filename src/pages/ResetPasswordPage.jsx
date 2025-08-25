import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/api';
import backgroundImage from '../assets/login-bg.jpg';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setError('');
    setMessage('');
    try {
      await resetPassword(token, password);
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="p-8 bg-white/10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-[2px] border border-white/10">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight" id="password" type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-6">
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight" id="confirmPassword" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white my-4 font-bold py-3 px-4 rounded-lg w-full" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;