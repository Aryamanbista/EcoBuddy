import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/register.jpg';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    community: 'bluewood Community',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = register(formData);

    if (result.success) {
      setSuccess(result.message);
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="p-8 bg-white/10 rounded-lg shadow-xl w-full max-w-lg backdrop-blur-[2px] border border-white/10 before:content-[''] before:absolute before:insert-0 before:rounnded-lg before:border before:border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Your Account</h2>
        <form onSubmit={handleRegister}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          {success && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
          
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="community">Community Name</label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white" type="text" placeholder="Enter community name" name="community" value={formData.community} onChange={handleChange} required />
          </div>
          
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="fullName" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">Email Address</label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition-colors" type="submit">
            Register
          </button>
          <p className="text-center text-white text-sm mt-6">
            Already have an account? <Link to="/login" className="font-bold text-blue-100 hover:text-blue-300">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;