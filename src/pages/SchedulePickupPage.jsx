import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaRecycle, FaLeaf, FaTrash } from 'react-icons/fa';

const SchedulePickupPage = () => {
  const [wasteType, setWasteType] = useState('general');
  const [pickupDate, setPickupDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pickup Scheduled!\nType: ${wasteType}\nDate: ${pickupDate.toLocaleString()}`);
    // In a real app, send this data to the backend API
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Schedule a Waste Pickup</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-3">Select Waste Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* General Waste */}
              <label className={`p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center ${wasteType === 'general' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <input type="radio" name="wasteType" value="general" className="hidden" onChange={(e) => setWasteType(e.target.value)} checked={wasteType === 'general'}/>
                <FaTrash className="text-4xl text-gray-600 mb-2" />
                <span className="font-semibold">General Waste</span>
              </label>
              {/* Recyclable Waste */}
              <label className={`p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center ${wasteType === 'recyclable' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <input type="radio" name="wasteType" value="recyclable" className="hidden" onChange={(e) => setWasteType(e.target.value)} checked={wasteType === 'recyclable'}/>
                <FaRecycle className="text-4xl text-blue-500 mb-2" />
                <span className="font-semibold">Recyclable</span>
              </label>
              {/* Organic Waste */}
              <label className={`p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center ${wasteType === 'organic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <input type="radio" name="wasteType" value="organic" className="hidden" onChange={(e) => setWasteType(e.target.value)} checked={wasteType === 'organic'}/>
                <FaLeaf className="text-4xl text-blue-500 mb-2" />
                <span className="font-semibold">Organic</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-3">Select Pickup Date & Time</label>
            <DatePicker
              selected={pickupDate}
              onChange={(date) => setPickupDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Confirm Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchedulePickupPage;