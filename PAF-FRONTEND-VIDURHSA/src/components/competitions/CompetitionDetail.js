import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaTrophy, FaUsers } from 'react-icons/fa';
import img1 from '../../assets/images/img1.jpg';
import img2 from '../../assets/images/img2.jpg';
import CountdownTimer from '../CountdownTimer';

const CompetitionDetail = ({ competition, isAdmin = false }) => {
  const navigate = useNavigate();

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

  if (!competition) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Competition Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Image */}
        <div className="h-64 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg relative overflow-hidden">
          <img
            src={getCompetitionImage(competition.competitionCategory)}
            alt={competition.competitionTitle}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{competition.competitionTitle}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                competition.competitionStatus === 'Ongoing' ? 'bg-green-500' :
                competition.competitionStatus === 'Upcoming' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}>
                {competition.competitionStatus}
              </span>
              <span className="text-gray-300">{competition.competitionCategory}</span>
              <span className="text-gray-300">{competition.competitionType}</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        {competition.countdownTimerEnabled && (
          <CountdownTimer startDate={competition.startDate} endDate={competition.submissionDeadline} />
        )}

        <div className="bg-gray-800 rounded-b-lg shadow-xl overflow-hidden">
          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Description</h2>
              <p className="text-gray-300">{competition.competitionDescription}</p>
            </div>

            {/* Problem Statement */}
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Problem Statement</h2>
              <p className="text-gray-300">{competition.problemStatement}</p>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCalendarAlt className="text-purple-400" />
                    <h3 className="text-sm font-medium text-gray-400">Start Date</h3>
                  </div>
                  <p className="text-white">{new Date(competition.startDate).toLocaleString()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaClock className="text-purple-400" />
                    <h3 className="text-sm font-medium text-gray-400">Submission Deadline</h3>
                  </div>
                  <p className="text-white">{new Date(competition.submissionDeadline).toLocaleString()}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaTrophy className="text-purple-400" />
                    <h3 className="text-sm font-medium text-gray-400">Result Announcement</h3>
                  </div>
                  <p className="text-white">{new Date(competition.resultAnnouncementDate).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Rules and Guidelines */}
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Rules and Guidelines</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Rules</h3>
                  <p className="text-gray-300">{competition.rules}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Evaluation Criteria</h3>
                  <p className="text-gray-300">{competition.evaluationCriteria}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">Submission Guidelines</h3>
                  <p className="text-gray-300">{competition.submissionGuidelines}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
              >
                Go Back
              </button>
              {isAdmin && (
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/admin/competitions/edit/${competition.id}`)}
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Edit Competition
                  </button>
                  <button
                    onClick={() => {/* Handle delete */}}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Delete Competition
                  </button>
                </div>
              )}
              {competition.competitionStatus === 'Ongoing' && (
                <button
                  onClick={() => {/* Handle submission */}}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  Submit Entry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetail; 