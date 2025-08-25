import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/api';
import backgroundImage from '../assets/login-bg.jpg';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await forgotPassword(email);
      setMessage('An email has been sent with instructions to reset your password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="p-8 bg-white/10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-[2px] border border-white/10">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Forgot Password</h2>
        <p className="text-center text-white/80 mb-6">Enter your email to receive a reset link.</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight" id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white my-4 font-bold py-3 px-4 rounded-lg w-full" type="submit">
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-white text-sm mt-6">
          Remembered your password? <Link to="/login" className="font-bold text-blue-100 hover:text-blue-300">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;