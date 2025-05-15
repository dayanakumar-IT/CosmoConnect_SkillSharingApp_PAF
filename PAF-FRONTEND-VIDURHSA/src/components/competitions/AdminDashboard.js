import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaTrophy, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';

const AdminDashboard = ({ competitions }) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate statistics
  const stats = {
    total: competitions.length,
    ongoing: competitions.filter(c => c.competitionStatus === 'Ongoing').length,
    upcoming: competitions.filter(c => c.competitionStatus === 'Upcoming').length,
    completed: competitions.filter(c => c.competitionStatus === 'Completed').length
  };

  // Get upcoming deadlines
  const upcomingDeadlines = competitions
    .filter(c => c.competitionStatus === 'Ongoing' || c.competitionStatus === 'Upcoming')
    .sort((a, b) => new Date(a.submissionDeadline) - new Date(b.submissionDeadline))
    .slice(0, 5);

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Function to get image based on competition category
  const getCompetitionImage = (category) => {
    if (!category) return img2; // Default image if category is undefined
    switch(category.toLowerCase()) {
      case 'astrophotography':
        return img2;
      case 'space diy':
        return img1;
      default:
        return img2; // Default image
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      {/* New Header with Timer */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-purple-400 mb-2">Admin Control Center</h1>
              <p className="text-gray-400">Manage competitions and monitor activities</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-purple-400">
                <FaClock className="text-2xl" />
                <span className="text-2xl font-mono">{formatTime(currentTime)}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-purple-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-400">Total Competitions</h3>
                <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-green-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <FaClock className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-400">Ongoing</h3>
                <p className="text-3xl font-bold text-green-400">{stats.ongoing}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FaCalendarAlt className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-400">Upcoming</h3>
                <p className="text-3xl font-bold text-blue-400">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-500">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-500 rounded-lg">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-400">Completed</h3>
                <p className="text-3xl font-bold text-gray-400">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {competitions.map(competition => (
            <div
              key={competition.id}
              className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
                <img
                  src={getCompetitionImage(competition.competitionCategory)}
                  alt={competition.competitionTitle}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    competition.competitionStatus === 'Ongoing' ? 'bg-green-500' :
                    competition.competitionStatus === 'Upcoming' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}>
                    {competition.competitionStatus}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-purple-400 mb-2">{competition.competitionTitle}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{competition.competitionDescription}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">Category:</span>
                    <span className="text-purple-400">{competition.competitionCategory}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">Type:</span>
                    <span className="text-purple-400">{competition.competitionType}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <FaClock className="mr-2" />
                    <span>Deadline: {new Date(competition.submissionDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/admin/competitions/${competition.id}`)}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    View Details
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/admin/competitions/edit/${competition.id}`)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {/* Handle delete */}}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/admin/competitions/add')}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Add New Competition
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 