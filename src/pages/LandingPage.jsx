// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaRecycle,
  FaArrowRight,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaChartLine,
  FaMobileAlt,
  FaTwitter,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import appMockup from '../assets/app-mockup.jpg'; // Make sure you have this image

// --- Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
};


// --- Reusable Modern Components ---

// Aurora Background Effect (Updated for Tailwind CSS v4)
const AuroraBackground = () => (
  <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
    <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-500/20 filter blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-cyan-500/20 filter blur-3xl [animation-delay:4s]" />
  </div>
);

// Glassmorphism Header
const LandingHeader = () => (
  <motion.header
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    className="fixed top-0 left-0 z-50 w-full border-b border-slate-300/10 bg-slate-900/60 backdrop-blur-lg"
  >
    <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2">
        <FaRecycle className="text-3xl text-emerald-400" />
        <span className="text-2xl font-bold tracking-tight text-slate-100">EcoBuddy</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/login" className="hidden font-medium text-slate-300 transition-colors hover:text-white sm:block">
          Login
        </Link>
        <Link
          to="/register"
          className="transform rounded-full bg-emerald-500 py-2 px-5 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-600"
        >
          Get Started
        </Link>
      </nav>
    </div>
  </motion.header>
);

// Bento Grid Card Component
const BentoCard = ({ className, icon, title, description }) => (
  <motion.div
    variants={itemVariants}
    className={`group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 p-6 ${className}`}
  >
    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative z-10">
      <div className="mb-4 inline-block w-fit rounded-lg bg-slate-900 p-3 text-3xl text-emerald-400">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-bold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </motion.div>
);

// Main Component
const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-900 font-sans text-slate-200">
      <AuroraBackground />
      <LandingHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="relative px-4 py-24 text-center sm:py-32 lg:py-40"
        >
          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Revolutionize Waste Management
            <br />
            for a{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Greener Tomorrow
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-400"
          >
            EcoBuddy connects communities with efficient, transparent, and sustainable waste solutions. Schedule pickups, report issues, and track your impact instantly.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/register"
              className="inline-flex transform items-center gap-3 rounded-full bg-emerald-500 py-3 px-8 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:bg-emerald-600"
            >
              Join the Movement <FaArrowRight />
            </Link>
          </motion.div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
            className="mx-auto mt-20 max-w-4xl lg:mt-24"
          >
             <div className="relative rounded-xl border border-slate-700 bg-slate-800/50 p-2 shadow-2xl shadow-slate-900/50">
               <img
                  src={appMockup}
                  alt="EcoBuddy App Mockup"
                  className="h-auto w-full rounded-lg"
               />
             </div>
          </motion.div>
        </motion.section>

        {/* Features Section (Bento Grid) */}
        <motion.section
          id="features"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="container mx-auto px-4 py-20 lg:py-28"
        >
          <div className="mb-16 text-center">
            <motion.h2 variants={itemVariants} className="mb-3 text-3xl font-bold lg:text-4xl">The Future of Waste Management is Here</motion.h2>
            <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg text-slate-400">
              A comprehensive suite of tools designed for residents, communities, and waste collectors.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BentoCard
              className="md:col-span-2"
              icon={<FaCalendarCheck />}
              title="Seamless Scheduling"
              description="Pick a date, select your waste type, and get instant confirmation. It’s that simple."
            />
            <BentoCard
              icon={<FaExclamationTriangle />}
              title="Instant Reporting"
              description="Snap a photo of an overflowing bin or a missed pickup to alert collectors in real-time."
            />
            <BentoCard
              icon={<FaChartLine />}
              title="Track Your Impact"
              description="Visualize your recycling efforts with personal dashboards and community leaderboards."
            />
             <BentoCard
              className="md:col-span-2"
              icon={<FaMobileAlt />}
              title="Smart Notifications"
              description="Get timely reminders for pickup days and real-time updates on your service requests."
            />
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          id="how-it-works"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="container mx-auto px-4 py-20 lg:py-28"
        >
          <div className="mb-16 text-center">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold lg:text-4xl">Get Started in Seconds</motion.h2>
          </div>
          <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            {/* Dashed line connector for desktop */}
            <div className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 md:block">
              <svg width="100%" height="100%">
                <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="8 8" stroke="#475569" strokeWidth="2" />
              </svg>
            </div>
            {['Create Account', 'Schedule & Report', 'Make a Difference'].map((title, i) => (
              <motion.div variants={itemVariants} key={title} className="relative z-10 flex flex-col items-center text-center">
                 <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 shadow-lg">
                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-2xl font-bold text-emerald-400">
                    {i + 1}
                   </div>
                 </div>
                 <h3 className="mb-2 text-xl font-semibold text-slate-100">{title}</h3>
                 <p className="text-slate-400">
                    {i === 0 && 'Quickly sign up and join your local community hub.'}
                    {i === 1 && 'Use our intuitive app to manage pickups and report issues.'}
                    {i === 2 && 'Contribute to a cleaner planet, one pickup at a time.'}
                 </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-20 lg:py-28"
        >
            <div className="container mx-auto px-4 text-center">
                <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/80 py-12 px-6 lg:py-16 lg:px-8">
                   <div className="absolute top-0 left-1/2 h-[200%] w-[200%] -translate-x-1/2 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.15)_0%,_rgba(34,197,94,0)_50%)]"/>
                   <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold lg:text-4xl">Ready to Make a Change?</motion.h2>
                   <motion.p variants={itemVariants} className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
                     Join thousands of eco-conscious users who are transforming their communities with EcoBuddy.
                   </motion.p>
                   <motion.div variants={itemVariants}>
                     <Link to="/register" className="transform rounded-full bg-white py-3 px-8 text-lg font-bold text-emerald-600 shadow-lg transition-colors hover:scale-105 hover:bg-slate-200">
                       Sign Up for Free
                     </Link>
                   </motion.div>
                </div>
            </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300/10 bg-slate-900/50 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center gap-6">
              <a href="#" className="text-slate-400 transition-colors hover:text-white"><FaTwitter size={20}/></a>
              <a href="#" className="text-slate-400 transition-colors hover:text-white"><FaGithub size={20}/></a>
              <a href="#" className="text-slate-400 transition-colors hover:text-white"><FaLinkedin size={20}/></a>
          </div>
          <p className="text-slate-400">© {new Date().getFullYear()} EcoBuddy. All Rights Reserved.</p>
          <p className="mt-2 text-sm text-slate-500">Making communities cleaner, one pickup at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;