import React from 'react';
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaPaperPlane, 
  FaExclamationCircle 
} from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Completed': { icon: <FaCheckCircle />, classes: 'bg-green-100 text-green-800' },
    'Scheduled': { icon: <FaClock />, classes: 'bg-blue-100 text-blue-800' },
    'Cancelled': { icon: <FaTimesCircle />, classes: 'bg-red-100 text-red-800' },
    'Submitted': { icon: <FaPaperPlane />, classes: 'bg-blue-100 text-blue-800' },
    'In Progress': { icon: <FaClock />, classes: 'bg-yellow-100 text-yellow-800' },
    'Resolved': { icon: <FaCheckCircle />, classes: 'bg-green-100 text-green-800' },
    'default': { icon: <FaExclamationCircle />, classes: 'bg-gray-100 text-gray-800' }
  };

  const currentStyle = statusConfig[status] || statusConfig.default;

  return (
    <span 
      // --- THIS IS THE FIX ---
      data-testid="status-badge" 
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${currentStyle.classes}`}
    >
      {currentStyle.icon}
      <span className="ml-1.5">{status}</span>
    </span>
  );
};

export default StatusBadge;