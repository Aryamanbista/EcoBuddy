// src/components/Card.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, children, linkTo, linkText, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {icon && <div className="text-blue-500 text-2xl mr-4">{icon}</div>}
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 flex-grow">{children}</div>
      {linkTo && (
        <Link 
          to={linkTo} 
          className="mt-4 text-blue-600 font-semibold hover:text-blue-800 self-start transition-colors duration-300"
        >
          {linkText} →
        </Link>
      )}
    </div>
  );
};

export default Card;