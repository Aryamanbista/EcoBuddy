const mockHistory = [
  { id: 1, date: '2023-10-25', type: 'Recyclable', status: 'Completed' },
  { id: 2, date: '2023-10-18', type: 'General', status: 'Completed' },
  { id: 3, date: '2023-10-11', type: 'Organic', status: 'Completed' },
  { id: 4, date: '2023-10-04', type: 'General', status: 'Completed' },
];

const HistoryPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pickup History</h1>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {mockHistory.map((item) => (
            <li key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.type} Waste</p>
                <p className="text-sm text-gray-500">Scheduled on: {item.date}</p>
              </div>
              <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPage;