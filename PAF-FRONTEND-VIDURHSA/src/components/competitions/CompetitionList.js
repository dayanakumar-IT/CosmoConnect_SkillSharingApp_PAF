import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';
import heroImage from '../../assets/images/pspace.jpg';

const CompetitionList = ({ competitions, isAdmin = false }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

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

  const filteredCompetitions = competitions.filter(competition => {
    return (
      (filters.category === '' || competition.competitionCategory === filters.category) &&
      (filters.status === '' || competition.competitionStatus === filters.status) &&
      (filters.search === '' || 
        competition.competitionTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        competition.competitionDescription.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
          <img
            src={heroImage}
            alt="Space-themed background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Competitions</h1>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-purple-400">Competitions</h2>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/competitions/add')}
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Add Competition
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            name="search"
            placeholder="Search competitions..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="Astrophotography">Astrophotography</option>
            <option value="Stargazing">Stargazing</option>
            <option value="Space DIY">Space DIY</option>
            <option value="Research">Research</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Scrollable Competition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-96">
          {filteredCompetitions.map((competition) => (
            <div
              key={competition.id}
              className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
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
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-purple-400 mb-2">{competition.competitionTitle}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{competition.competitionDescription}</p>
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

                     <button
                  onClick={() => navigate(isAdmin ? `/admin/competitions/${competition.id}` : `/competitions/${competition.id}`)}
                  className="mt-auto px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors w-full"
                >
                  View Details
                </button>
                


                  </div>
                </div>
                
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitionList; 