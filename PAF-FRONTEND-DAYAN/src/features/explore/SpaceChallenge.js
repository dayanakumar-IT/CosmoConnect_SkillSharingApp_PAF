import React, { useState } from 'react';
import { FaRocket, FaStar, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const SpaceChallenge = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Night Sky Photography",
      description: "Capture the Milky Way or any constellation tonight",
      points: 100,
      difficulty: "Medium",
      icon: <FaStar className="text-yellow-400" />
    },
    {
      id: 2,
      title: "Planet Observation",
      description: "Spot and identify at least 3 planets in the night sky",
      points: 150,
      difficulty: "Hard",
      icon: <FaRocket className="text-space-purple" />
    },
    {
      id: 3,
      title: "Space Quiz Master",
      description: "Complete the daily space quiz with 100% accuracy",
      points: 200,
      difficulty: "Easy",
      icon: <FaTrophy className="text-blue-400" />
    }
  ];

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setIsExpanded(true);
  };

  return (
    <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron text-space-purple flex items-center">
          <FaCalendarAlt className="mr-2" /> Daily Space Challenges
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-space-purple hover:text-white transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded ? (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedChallenge?.id === challenge.id 
                  ? 'bg-space-purple text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => handleChallengeSelect(challenge)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{challenge.icon}</span>
                  <div>
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <p className="text-sm opacity-80">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">{challenge.points} pts</span>
                  <div className="text-xs opacity-80">{challenge.difficulty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-400">Click to view today's challenges</p>
        </div>
      )}

      {selectedChallenge && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Selected Challenge</h4>
          <p className="text-sm mb-3">{selectedChallenge.description}</p>
          <button className="w-full bg-space-purple text-white py-2 rounded-lg hover:bg-opacity-90 transition-all">
            Start Challenge
          </button>
        </div>
      )}
    </div>
  );
};

export default SpaceChallenge; 