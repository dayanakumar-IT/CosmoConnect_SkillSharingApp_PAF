import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const topicImages = {
  'Telescope Basics': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // telescope under the stars
  'Star Mapping': 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', // constellation overlay on night sky
  'Deep Space Objects': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80', // nebula or galaxy
  'Celestial Navigation': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80', // star compass or sextant chart
  'Cosmic Photography': 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' // camera + Milky Way night shot
};

const LearningFlipCard = ({ data, onEdit, onDelete, onToggleVisibility }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(data);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this learning entry?')) {
      onDelete(data.id);
    }
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(data.id, !data.isPublic);
    }
  };

  const getMotivationalMessage = (hours) => {
    const h = parseInt(hours);
    if (h > 8) return { emoji: '🪐', text: "You're orbiting greatness" };
    if (h >= 4) return { emoji: '🌕', text: 'Steady like the moon' };
    return { emoji: '☀️', text: 'Every star starts small' };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return '✓';
      case 'In Progress': return '⏳';
      case 'Not Started': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div>
      <div
        className={`relative w-[340px] h-[520px] perspective-1000 cursor-pointer ${
          isHovered ? 'scale-105' : ''
        } transition-transform duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl bg-gradient-to-br from-[#18182a] to-[#23234d] flex flex-col justify-center items-center p-8">
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              <img
                src={topicImages[data.topic] || topicImages['Deep Space Objects']}
                alt={data.topic}
                className="w-full h-full object-cover absolute inset-0 rounded-2xl"
                style={{ zIndex: 0 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30 rounded-2xl z-10" />
              {/* Visibility Icon */}
              <div className="absolute top-4 right-4 z-30">
                {data.isPublic === false ? (
                  <span title="Private" className="text-lg text-blue-200 bg-black/60 rounded-full px-2 py-1">🔒</span>
                ) : data.isPublic === true ? (
                  <span title="Public" className="text-lg text-blue-200 bg-black/60 rounded-full px-2 py-1">🌐</span>
                ) : null}
              </div>
              <div className="relative z-20 flex flex-col justify-center items-center h-full w-full">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg mb-2 text-center" style={{ textShadow: '0 0 16px #60a5fa, 0 0 8px #fff' }}>{data.topic}</h2>
                <p className="text-base text-blue-200 mb-2 text-center">{data.subject}</p>
                <div className="flex items-center gap-3 mb-2 text-blue-200 text-sm">
                  <span role="img" aria-label="date">📅</span> {new Date(data.startDate).toLocaleDateString()}
                  <span role="img" aria-label="time">⏳</span> {data.timeSpent} hrs
                </div>
                <div className="text-base font-semibold text-blue-300 mb-4 flex items-center gap-2">
                  <span>{getMotivationalMessage(data.timeSpent).emoji}</span>
                  <span>{getMotivationalMessage(data.timeSpent).text}</span>
                </div>
                <div className="absolute bottom-4 left-0 w-full flex justify-center z-30">
                  <span className="text-blue-200 text-xs font-semibold bg-black/40 px-3 py-1 rounded-full shadow">✨ Click to Flip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl bg-gradient-to-br from-[#18182a] to-[#23234d] p-8 flex flex-col">
            <div className="flex flex-col gap-3 text-base overflow-y-auto">
              <div className="mb-2">
                <span className="font-bold text-blue-300">What Did You Learn?</span>
                <div className="mt-1 p-2 bg-blue-900 bg-opacity-30 rounded-lg text-white whitespace-pre-line text-sm">
                  {data.whatDidYouLearn}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-bold text-blue-300">Skills Gained:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.skills && data.skills.length > 0 ? data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-xs text-blue-200 font-semibold shadow"
                    >
                      {skill}
                    </span>
                  )) : <span className="text-gray-500">None</span>}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-bold text-blue-300">Next Steps:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.nextSteps && data.nextSteps.length > 0 ? data.nextSteps.map((step, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-900 bg-opacity-80 rounded-full text-xs text-blue-100 font-semibold shadow hover:scale-105 transition-transform duration-200"
                    >
                      {step}
                    </span>
                  )) : <span className="text-gray-500">None</span>}
                </div>
              </div>
              {/* Visibility Toggle (optional) */}
              <div className="flex items-center gap-2 mt-2 self-end">
                <span className="text-xs text-blue-200">{data.isPublic ? 'Public' : 'Private'}</span>
                <button
                  onClick={handleToggleVisibility}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${data.isPublic ? 'bg-blue-600' : 'bg-gray-600'}`}
                  title="Toggle Visibility"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${data.isPublic ? 'translate-x-4' : ''}`}
                  />
                </button>
              </div>
            </div>
            {/* Update/Delete Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-40">
              <button
                onClick={handleEdit}
                className="rounded-full p-2 bg-purple-700 hover:bg-purple-500 text-white shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center"
                title="Update"
              >
                <FaEdit className="text-base" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full p-2 bg-red-700 hover:bg-red-500 text-white shadow-lg transition-transform duration-200 hover:scale-110 flex items-center justify-center"
                title="Delete"
              >
                <FaTrash className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningFlipCard; 