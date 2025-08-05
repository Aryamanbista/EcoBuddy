// src/pages/SchedulePickupPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import { FaRecycle, FaLeaf, FaTrash, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { schedulePickup } from '../api/api';

const wasteTypes = [
  { id: 'recyclable', name: 'Recyclable', icon: <FaRecycle />, color: 'text-blue-500' },
  { id: 'organic', name: 'Organic', icon: <FaLeaf />, color: 'text-green-500' },
  { id: 'general', name: 'General', icon: <FaTrash />, color: 'text-gray-500' },
];

const availableTimes = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "01:00 PM", "02:00 PM", "03:00 PM"
];

const SchedulePickupPage = () => {
  const [selectedType, setSelectedType] = useState('recyclable');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedTime) {
      setError("Please select a time slot.");
      return;
    }

    try {
      // Combine date and time into a single Date object for the backend
      const [hours, minutesPart] = selectedTime.split(':');
      const [minutes, period] = minutesPart.split(' ');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hour, parseInt(minutes), 0, 0);

      const pickupData = {
        wasteType: selectedType,
        scheduledDate: combinedDate.toISOString(), // Send as ISO string
      };

      await schedulePickup(pickupData);
      setIsConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule pickup.");
    }
  };
  
  if (isConfirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-10 rounded-xl shadow-lg border border-slate-200 max-w-lg mx-auto">
        <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pickup Scheduled!</h2>
        <p className="text-gray-600 mb-6">
          Your {wasteTypes.find(w => w.id === selectedType).name} waste pickup is confirmed for {' '}
          <span className="font-semibold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span> at {' '}
          <span className="font-semibold">{selectedTime}</span>.
        </p>
        <button 
          onClick={() => {
            setIsConfirmed(false);
            setSelectedTime(null);
          }} 
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Schedule Another Pickup
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Schedule a Pickup</h1>
        <p className="text-gray-600 mt-1">Select a date and time for your collection.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            className="react-calendar" // This class is targeted by our CSS overrides
          />
        </div>

        {/* Right Column: Details & Confirmation */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Schedule for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </h3>

            {/* Waste Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">1. Waste Type</label>
              <div className="flex space-x-2">
                {wasteTypes.map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex flex-col ${
                      selectedType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <div className={`text-2xl mx-auto ${type.color}`}>{type.icon}</div>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">2. Available Times</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg text-center font-semibold transition-colors ${
                      selectedTime === time ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 hover:bg-blue-100 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          
          <button 
            type="submit" 
            disabled={!selectedTime}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm Schedule <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default SchedulePickupPage;