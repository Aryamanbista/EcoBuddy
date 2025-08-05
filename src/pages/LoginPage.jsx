import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/login-bg.jpg';


const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  const result = await login(email, password);

  if (result.success) {
    // Check user role for redirection
    console.log(result.user.role)
    if (result.user.role === "admin") {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  } else {
    setError(result.message);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="p-8 bg-white/10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-[2px] border border-white/10 before:content-[''] before:absolute before:insert-0 before:rounnded-lg before:border before:border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome to EcoBuddy</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input className="shadow appearance-none border rounded w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="flex flex-col items-center justify-between">
            <button className="bg-blue-600 hover:bg-blue-700 text-white my-4 font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors" type="submit">
              Sign In
            </button>
          </div>
          <p className="text-center text-white text-sm mt-6">
            Don't have an account? <Link to="/register" className="font-bold text-blue-100 hover:text-blue-300 ">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;