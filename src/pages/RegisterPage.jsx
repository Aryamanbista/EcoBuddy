// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Mock data for existing communities
const mockCommunities = [
  { id: 1, name: 'bluewood Community' },
  { id: 2, name: 'Sunnyvale Estates' },
  { id: 3, name: 'Maple Creek' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isNewCommunity, setIsNewCommunity] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    // Send form data to the backend API
    // On success, navigate to login
    alert('Registration successful! Please log in.');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create Your Account</h2>
        <form onSubmit={handleRegister}>
          {/* Community Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Community
            </label>
            {isNewCommunity ? (
              <input className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700" type="text" placeholder="Enter new community name" required />
            ) : (
              <select className="shadow border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                {mockCommunities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <button type="button" onClick={() => setIsNewCommunity(!isNewCommunity)} className="text-sm text-blue-600 hover:underline mt-2">
              {isNewCommunity ? 'Join an existing community' : 'Register a new community'}
            </button>
          </div>

          {/* User Details */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="fullName" type="text" placeholder="John Doe" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" required />
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition-colors" type="submit">
            Register
          </button>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;