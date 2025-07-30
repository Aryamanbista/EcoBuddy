// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { FaRecycle, FaCalendarAlt, FaBullhorn, FaCheckCircle, FaUsers, FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/hero-image.jpg'; // Make sure you have an image at this path

// Header Component for Landing Page
const LandingHeader = () => (
  <header className="absolute top-0 left-0 w-full z-10 p-4 bg-transparent">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <FaRecycle className="text-3xl text-blue-500" />
        <span className="text-2xl font-bold text-gray-800">WasteWise</span>
      </Link>
      <nav className="space-x-4">
        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Login</Link>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all">
          Get Started
        </Link>
      </nav>
    </div>
  </header>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="text-blue-500 text-4xl mb-4 inline-block">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                Smarter Waste Management for a <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Cleaner Community</span>.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Join your community on WasteWise to easily schedule pickups, report issues, and contribute to a more sustainable neighborhood.
              </p>
              <Link to="/register" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg">
                Join Your Community <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div>
              <img src={heroImage} alt="Clean and sustainable community" className="rounded-xl shadow-2xl w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Everything You Need, All in One Place</h2>
            <p className="text-gray-600 mt-2">Manage your waste disposal effortlessly with our powerful features.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaCalendarAlt />}
              title="Easy Scheduling"
              description="Schedule waste pickups in seconds with our intuitive calendar."
            />
            <FeatureCard 
              icon={<FaBullhorn />}
              title="Instant Issue Reporting"
              description="Report missed pickups or overflowing bins directly through the app."
            />
            <FeatureCard 
              icon={<FaCheckCircle />}
              title="Track Your Impact"
              description="View your pickup history and see your contribution to recycling goals."
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">Register and join your community's waste management program.</p>
            </div>
            <div className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Schedule & Report</h3>
              <p className="text-gray-600">Request pickups or report issues anytime, anywhere.</p>
            </div>
            <div className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
              <p className="text-gray-600">Receive notifications and track your waste management progress.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
            <FaUsers className="text-5xl text-white opacity-80 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Thousands of Homes Making a Difference</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">Become a part of the movement towards a cleaner, more organized, and sustainable future for your community.</p>
            <Link to="/register" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg">
                Sign Up for Free
            </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} WasteWise. All Rights Reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Making communities cleaner, one pickup at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;