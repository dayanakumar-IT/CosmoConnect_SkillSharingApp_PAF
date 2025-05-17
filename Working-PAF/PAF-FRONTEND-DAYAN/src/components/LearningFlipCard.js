import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaLock, FaClock, FaCalendarAlt, FaRocket } from 'react-icons/fa';

const topicImages = {
  'Telescope Basics': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'Star Mapping': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  'Deep Space Objects': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
  'Celestial Navigation': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  'Cosmic Photography': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
};

const motivationalQuotes = [
  "Reach for the stars ✨",
  "Every star starts small 🌟",
  "You're orbiting greatness 🪐",
  "Steady like the moon 🌕",
  "Explore the cosmic unknown 🚀"
];

function getMotivationalQuote(stage) {
  if (stage >= 8) return motivationalQuotes[2];
  if (stage >= 5) return motivationalQuotes[3];
  if (stage >= 3) return motivationalQuotes[0];
  return motivationalQuotes[1];
}

const LearningFlipCard = ({ data, onEdit, onDelete, onToggleVisibility }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Ensure nextSteps is always an array
  const nextStepsArray = Array.isArray(data.nextSteps)
    ? data.nextSteps
    : (typeof data.nextSteps === 'string' && data.nextSteps.length > 0
        ? data.nextSteps.split(',').map(s => s.trim())
        : []);

  const skillsArray = Array.isArray(data.skills)
    ? data.skills
    : (typeof data.skills === 'string' && data.skills.length > 0
        ? data.skills.split(',').map(s => s.trim())
        : []);

  // Accessibility: allow keyboard flip
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') setIsFlipped(f => !f);
  };

  return (
    <div
      className="flip-card-container"
      tabIndex={0}
      aria-label={`Learning card for ${data.learningTopic}`}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <div
        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(f => !f)}
        aria-pressed={isFlipped}
        role="button"
      >
        {/* Front Side */}
        <div className="flip-card-front cosmic-bg">
          <img
            src={topicImages[data.learningTopic] || topicImages['Deep Space Objects']}
            alt={data.learningTopic}
            className="card-bg-img"
          />
          <div className="card-gradient-overlay" />
          <div className="card-content">
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-bold text-white">{data.learningTopic}</span>
              <span
                className="group relative"
                tabIndex={0}
              >
                {data.public ? (
                  <FaGlobe className="text-blue-200" />
                ) : (
                  <FaLock className="text-blue-200" />
                )}
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {data.public ? 'Public' : 'Private'}
                </span>
              </span>
            </div>
            <div className="text-blue-200 text-base mb-2">{data.learningSubject}</div>
            {/* Progress Bar */}
            <div className="w-full mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-blue-200">Progress</span>
                <span className="text-xs text-blue-200">{data.currentProgressStage}/10</span>
              </div>
              <div className="w-full h-3 bg-blue-900 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${(Math.max(1, Math.min(10, data.currentProgressStage)) / 10) * 100}%` }}
                />
              </div>
            </div>
            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skillsArray.length > 0 ? skillsArray.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-xs text-blue-200 font-semibold shadow">{skill}</span>
              )) : <span className="text-gray-500">No skills yet</span>}
            </div>
            {/* End Skill Tags */}
            <div className="mt-4 text-center text-space-purple text-xl font-semibold cosmic-quote">
              {getMotivationalQuote(data.currentProgressStage)}
            </div>
            <div className="absolute bottom-4 left-0 w-full flex justify-center">
              <span className="text-blue-200 text-xs font-semibold bg-black/40 px-3 py-1 rounded-full shadow">✨ Click or press Enter/Space to Flip</span>
            </div>
          </div>
        </div>
        {/* Back Side */}
        <div className="flip-card-back cosmic-bg">
          <div className="card-content">
            {/* Date Range with emoji and style */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="calendar">📅</span>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white font-semibold text-xs shadow">
                {new Date(data.startDate).toLocaleDateString()} — {new Date(data.endDate).toLocaleDateString()}
              </span>
            </div>
            {/* Time Spent and Progress Pie - Centered and Styled Equally */}
            <div className="mb-4 flex justify-center w-full gap-8 items-center">
              {/* Clock */}
              <div className="cosmic-circle flex flex-col items-center justify-center" style={{ width: '90px', height: '90px' }}>
                <span className="text-4xl" role="img" aria-label="clock" style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', opacity: 0.18, pointerEvents: 'none' }}>⏰</span>
                <span className="text-3xl font-bold text-white relative z-10">{data.timeSpentInHours}</span>
                <span className="text-sm text-blue-200 relative z-10">hrs</span>
              </div>
              {/* Progress Pie - clean, no outer border, larger size */}
              <div className="flex flex-col items-center justify-center" style={{ width: '90px', height: '90px' }}>
                <svg width="90" height="90" viewBox="0 0 50 50" className="progress-pie-svg">
                  <circle
                    cx="25" cy="25" r="22"
                    fill="none"
                    stroke="#23234d"
                    strokeWidth="5"
                  />
                  <circle
                    cx="25" cy="25" r="22"
                    fill="none"
                    stroke="url(#pie-gradient)"
                    strokeWidth="5"
                    strokeDasharray={Math.PI * 2 * 22}
                    strokeDashoffset={Math.PI * 2 * 22 * (1 - (Math.max(1, Math.min(10, data.currentProgressStage)) / 10))}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s' }}
                  />
                  <defs>
                    <linearGradient id="pie-gradient" x1="0" y1="0" x2="50" y2="50">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#a084f3" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                  <text x="50%" y="56%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" dy=".3em">
                    {data.currentProgressStage}/10
                  </text>
                </svg>
                <span className="text-sm text-blue-200 mt-1">Progress</span>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-bold text-blue-300">Progress State:</span>
              <span className="ml-2 text-blue-100">{data.currentProgressStage >= 10 ? "Completed" : data.currentProgressStage >= 1 ? "In Progress" : "Started"}</span>
            </div>
            {/* What Did You Learn description */}
            <div className="mb-2">
              <span className="font-bold text-blue-300">What Did You Learn?</span>
              <div className="mt-1 p-2 bg-blue-900 bg-opacity-30 rounded-lg text-white whitespace-pre-line text-sm">
                {data.whatDidYouLearn}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-bold text-blue-300">Next Steps:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {nextStepsArray.length > 0 ? nextStepsArray.map((step, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-900 bg-opacity-80 rounded-full text-xs text-blue-100 font-semibold shadow">{step}</span>
                )) : <span className="text-gray-500">None</span>}
              </div>
            </div>
            <div className="mb-2 text-blue-200 text-xs">
              Last Updated: {data.endDate ? new Date(data.endDate).toLocaleDateString() : 'N/A'}
            </div>
            {/* Edit/Delete Buttons - right bottom, higher up */}
            <div className="absolute right-4" style={{ bottom: '2rem' }}>
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onEdit(data); }}
                  className="rounded-full p-2 bg-purple-700 hover:bg-purple-500 text-white shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center"
                  title="Edit"
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(data.id); }}
                  className="rounded-full p-2 bg-red-700 hover:bg-red-500 text-white shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center"
                  title="Delete"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CSS styles */}
      <style>{`
        .flip-card-container {
          width: 340px;
          height: 520px;
          perspective: 1200px;
          margin: 1rem;
          outline: none;
        }
        .flip-card {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.7s cubic-bezier(.4,2,.3,1);
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 8px 40px 8px #23234d, 0 0 0 8px #23234d inset;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
        }
        .flip-card-front {
          z-index: 2;
        }
        .flip-card-back {
          transform: rotateY(180deg);
          z-index: 3;
        }
        .cosmic-bg {
          background: linear-gradient(135deg, #18182a 60%, #23234d 100%);
        }
        .card-bg-img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.35;
        }
        .card-gradient-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #18182a 60%, #23234d 100%);
          opacity: 0.85;
          z-index: 1;
        }
        .card-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .cosmic-quote {
          font-family: 'Orbitron', 'Arial', sans-serif;
          letter-spacing: 1px;
        }
        .progress-bar {
          width: 100%;
          height: 12px;
          background: #18182a;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .progress-bar-inner {
          height: 100%;
          background: linear-gradient(90deg, #60a5fa 0%, #a084f3 100%);
          border-radius: 8px;
          transition: width 0.5s;
        }
        .cosmic-circle {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #23234d 60%, #a084f3 100%);
          box-shadow: 0 0 16px 2px #a084f3, 0 0 0 4px #23234d inset;
          border: 4px solid #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .progress-pie-svg {
          display: block;
          width: 90px;
          height: 90px;
        }
        @media (max-width: 500px) {
          .flip-card-container {
            width: 98vw;
            height: 340px;
          }
        }
      `}</style>
    </div>
  );
};

export default LearningFlipCard; 