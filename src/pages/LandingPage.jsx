// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { FaRecycle, FaCalendarAlt, FaBullhorn, FaCheckCircle, FaUsers, FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/hero-image.jpg';

// Update the animation variants at the top of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
};

const imageVariants = {
  hidden: { 
    x: 100, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
};

// Add new fade-in variant for sections
const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};


// Header Component (No animation needed here, keep it simple)
const LandingHeader = () => (
  <header className="absolute top-0 left-0 w-full z-20 p-4 bg-transparent">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2">
        <FaRecycle className="text-3xl text-blue-500" />
        <span className="text-2xl font-bold text-gray-800">EcoBuddy</span>
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

// Feature Card Component - Now using motion!
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 }
    }}
    className="bg-white p-6 rounded-xl shadow-lg text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="text-blue-500 text-4xl mb-4 inline-block"
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);


// Main Landing Page Component
const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      <LandingHeader />

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              variants={containerVariants}
            >
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
              >
                Smarter Waste Management for a{" "}
                <motion.span
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%"],
                    opacity: [0.8, 1] 
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  Cleaner Community
                </motion.span>
                .
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Join your community on EcoBuddy to easily schedule pickups, report issues, and contribute to a more sustainable neighborhood.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link to="/register" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg">
                  Join Your Community <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={imageVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src={heroImage} 
                alt="Clean and sustainable community" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Everything You Need, All in One Place</h2>
            <p className="text-gray-600 mt-2">Manage your waste disposal effortlessly with our powerful features.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<FaCalendarAlt />} title="Easy Scheduling" description="Schedule waste pickups in seconds with our intuitive calendar." />
            <FeatureCard icon={<FaBullhorn />} title="Instant Issue Reporting" description="Report missed pickups or overflowing bins directly through the app." />
            <FeatureCard icon={<FaCheckCircle />} title="Track Your Impact" description="View your pickup history and see your contribution to recycling goals." />
          </div>
        </div>
      </motion.section>
      
      {/* How It Works Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-20 bg-blue-50"
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
          </motion.div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <motion.div variants={itemVariants} className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">Register and join your community's waste management program.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Schedule & Report</h3>
              <p className="text-gray-600">Request pickups or report issues anytime, anywhere.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center max-w-xs">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
              <p className="text-gray-600">Receive notifications and track your waste management progress.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-4 text-center">
            <FaUsers className="text-5xl text-white opacity-80 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Thousands of Homes Making a Difference</h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">Become a part of the movement towards a cleaner, more organized, and sustainable future for your community.</p>
            <Link to="/register" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg">
                Sign Up for Free
            </Link>
        </div>
      </motion.section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} EcoBuddy. All Rights Reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Making communities cleaner, one pickup at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;