import React, { useState } from 'react';
import { FaMedal, FaRocket, FaStar, FaTrophy, FaLock, FaUnlock } from 'react-icons/fa';

const SpaceAchievements = () => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const achievements = [
    {
      id: 1,
      title: "Stellar Photographer",
      description: "Share 10 space photos",
      progress: 7,
      total: 10,
      reward: "Golden Camera Badge",
      icon: <FaStar className="text-yellow-400" />,
      unlocked: false
    },
    {
      id: 2,
      title: "Planet Hunter",
      description: "Identify all planets in the solar system",
      progress: 8,
      total: 8,
      reward: "Solar System Expert Badge",
      icon: <FaRocket className="text-space-purple" />,
      unlocked: true
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Score 100% in 5 space quizzes",
      progress: 3,
      total: 5,
      reward: "Quiz Champion Badge",
      icon: <FaTrophy className="text-blue-400" />,
      unlocked: false
    },
    {
      id: 4,
      title: "Constellation Expert",
      description: "Identify 20 constellations",
      progress: 12,
      total: 20,
      reward: "Star Navigator Badge",
      icon: <FaMedal className="text-purple-400" />,
      unlocked: false
    }
  ];

  const calculateProgress = (progress, total) => {
    return (progress / total) * 100;
  };

  return (
    <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-orbitron text-space-purple flex items-center">
          <FaTrophy className="mr-2" /> Space Achievements
        </h3>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedAchievement?.id === achievement.id 
                ? 'bg-space-purple text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {achievement.unlocked ? achievement.icon : <FaLock className="text-gray-500" />}
                </span>
                <div>
                  <h4 className="font-semibold flex items-center">
                    {achievement.title}
                    {achievement.unlocked && <FaUnlock className="ml-2 text-green-400" size={14} />}
                  </h4>
                  <p className="text-sm opacity-80">{achievement.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{achievement.progress}/{achievement.total}</div>
                <div className="text-xs opacity-80">{achievement.reward}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  achievement.unlocked ? 'bg-green-500' : 'bg-space-purple'
                }`}
                style={{ width: `${calculateProgress(achievement.progress, achievement.total)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedAchievement && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">{selectedAchievement.title}</h4>
            <span className="text-sm font-bold">
              {selectedAchievement.progress}/{selectedAchievement.total}
            </span>
          </div>
          <p className="text-sm mb-3">{selectedAchievement.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-space-purple">Reward: {selectedAchievement.reward}</span>
            {selectedAchievement.unlocked ? (
              <span className="text-green-400 flex items-center">
                <FaUnlock className="mr-1" /> Unlocked
              </span>
            ) : (
              <span className="text-gray-400 flex items-center">
                <FaLock className="mr-1" /> Locked
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceAchievements; 