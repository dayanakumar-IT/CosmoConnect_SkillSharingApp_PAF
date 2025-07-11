import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaLock, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LearningProgressModal = ({ isOpen, onClose, onSubmit, editingEntry }) => {
  const [formData, setFormData] = useState({
    topic: '',
    subject: '',
    whatDidYouLearn: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    timeSpent: '',
    isPublic: true,
    skills: [],
    nextSteps: [],
    currentProgressStage: 5
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showToast, setShowToast] = useState(false);

  const learningTopics = [
    'Telescope Basics',
    'Star Mapping',
    'Deep Space Objects',
    'Celestial Navigation',
    'Cosmic Photography'
  ];

  const predefinedSkills = [
    '🔭 Telescope Operation',
    '🌌 Deep Sky Observation',
    '🗺️ Star Mapping',
    '📷 Astrophotography',
    '🛰️ Satellite Tracking',
    '🪐 Planetary Science',
    '🌠 Meteor Watching',
    '🧭 Celestial Navigation',
    '🔬 Spectroscopy',
    '📝 Observation Logging',
    '🧑‍🚀 Space Science',
    '🪞 Mirror Alignment',
    '🌙 Lunar Observation',
    '☀️ Solar Observation',
    '🌟 Variable Star Analysis'
  ];

  const autoGeneratedText = {
    'Telescope Basics': 'Learned about telescope types, magnification, and proper setup techniques. Explored different eyepieces and their uses for various celestial observations.',
    'Star Mapping': 'Studied star patterns, constellations, and celestial coordinates. Practiced using star charts and digital tools for night sky navigation.',
    'Deep Space Objects': 'Explored galaxies, nebulae, and star clusters. Learned about their formation, characteristics, and observation techniques.',
    'Celestial Navigation': 'Mastered techniques for using stars and celestial bodies for navigation. Studied coordinate systems and time calculations.',
    'Cosmic Photography': 'Learned astrophotography techniques, camera settings, and image processing. Explored different methods for capturing celestial objects.'
  };

  // Astronomy-specific skills and next steps by topic
  const topicSkills = {
    'Telescope Basics': [
      '🔭 Telescope Setup',
      '🪞 Mirror Alignment',
      '🔬 Focusing',
      '🧭 Polar Alignment'
    ],
    'Star Mapping': [
      '🗺️ Star Chart Reading',
      '🌌 Constellation Identification',
      '🧭 Celestial Navigation',
      '📏 Angular Measurement'
    ],
    'Deep Space Objects': [
      '🌌 Galaxy Observation',
      '🌟 Nebula Identification',
      '🔭 Long Exposure',
      '📝 Observation Logging'
    ],
    'Celestial Navigation': [
      '🧭 Using Sextant',
      '🗺️ Coordinate Calculation',
      '🌠 Night Sky Orientation',
      '🕰️ Sidereal Time'
    ],
    'Cosmic Photography': [
      '📷 Camera Settings',
      '🌠 Image Stacking',
      '🖥️ Post-Processing',
      '🔭 Tracking Mount Use'
    ]
  };

  const topicNextSteps = {
    'Telescope Basics': [
      "Align your telescope for tonight's sky",
      "Try observing the Moon's craters",
      "Experiment with different eyepieces"
    ],
    'Star Mapping': [
      "Map out Orion constellation",
      "Practice using a planisphere",
      "Identify 5 new stars tonight"
    ],
    'Deep Space Objects': [
      "Observe the Andromeda Galaxy",
      "Sketch a nebula you find",
      "Log a Messier object"
    ],
    'Celestial Navigation': [
      "Navigate using Polaris",
      "Calculate your latitude from the stars",
      "Try a star-finding app outdoors"
    ],
    'Cosmic Photography': [
      "Capture a long-exposure of the Milky Way",
      "Edit your latest astrophoto",
      "Share your best shot with the community"
    ]
  };

  useEffect(() => {
    if (isOpen) {
      if (editingEntry) {
        // Ensure nextSteps is always an array
        let nextStepsArr = [];
        if (Array.isArray(editingEntry.nextSteps)) {
          nextStepsArr = editingEntry.nextSteps;
        } else if (typeof editingEntry.nextSteps === 'string' && editingEntry.nextSteps.length > 0) {
          nextStepsArr = editingEntry.nextSteps.split(',').map(s => s.trim());
        }
        setFormData({
          topic: editingEntry.learningTopic || '',
          subject: editingEntry.learningSubject || '',
          whatDidYouLearn: editingEntry.whatDidYouLearn || '',
          startDate: editingEntry.startDate || new Date().toISOString().split('T')[0],
          endDate: editingEntry.endDate || new Date().toISOString().split('T')[0],
          timeSpent: editingEntry.timeSpentInHours != null ? editingEntry.timeSpentInHours.toString() : '',
          isPublic: typeof editingEntry.isPublic === 'boolean'
            ? editingEntry.isPublic
            : (typeof editingEntry.public === 'boolean'
                ? editingEntry.public
                : true),
          skills: Array.isArray(editingEntry.skills) ? editingEntry.skills : [],
          nextSteps: nextStepsArr,
          currentProgressStage: editingEntry.currentProgressStage || 1
        });
      } else {
        setFormData({
          topic: '',
          subject: '',
          whatDidYouLearn: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          timeSpent: '',
          isPublic: true,
          skills: [],
          nextSteps: [],
          currentProgressStage: 5
        });
      }
    }
  }, [isOpen, editingEntry]);

  useEffect(() => {
    if (formData.topic && !editingEntry) {
      setFormData(prev => ({
        ...prev,
        whatDidYouLearn: autoGeneratedText[formData.topic] || '',
        nextSteps: topicNextSteps[formData.topic] || []
      }));
    }
  }, [formData.topic, editingEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting isPublic:', formData.isPublic);
    
    // Transform form data to match backend model
    const learningData = {
      learningTopic: formData.topic || '',
      learningSubject: formData.subject || '',
      whatDidYouLearn: formData.whatDidYouLearn || '',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || new Date().toISOString().split('T')[0],
      timeSpentInHours: parseFloat(formData.timeSpent) || 0,
      public: typeof formData.isPublic === 'boolean' ? formData.isPublic : true,
      skills: Array.isArray(formData.skills) ? formData.skills : [],
      nextSteps: Array.isArray(formData.nextSteps) ? formData.nextSteps.join(', ') : (formData.nextSteps || ''),
      currentProgressStage: parseInt(formData.currentProgressStage) || 1
    };

    // Validate required fields
    if (!learningData.learningTopic || !learningData.learningSubject || !learningData.whatDidYouLearn) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(learningData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSkillAdd = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const getMotivationalMessage = (hours) => {
    const h = parseInt(hours);
    if (h > 8) return { emoji: '🪐', text: "You're orbiting greatness" };
    if (h >= 4) return { emoji: '🌕', text: 'Steady like the moon' };
    return { emoji: '☀️', text: 'Every star starts small' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#0c0c1b] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-space-purple">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-orbitron text-space-purple">
              {editingEntry ? 'Edit Learning Progress' : 'Log New Learning Progress'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-space-purple transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Learning Topic */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                Learning Topic
              </label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple"
                required
              >
                <option value="">Select a topic</option>
                {learningTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Learning Subject */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                Learning Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple"
                placeholder="Enter specific subject or focus area"
                required
              />
            </div>

            {/* What Did You Learn */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                What Did You Learn?
              </label>
              <textarea
                value={formData.whatDidYouLearn}
                onChange={(e) => setFormData(prev => ({ ...prev, whatDidYouLearn: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple h-32 resize-none"
                placeholder="Describe your learning experience..."
                required
              />
            </div>

            {/* Date of Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-base font-semibold text-blue-400 mb-2">
                  Date of Progress
                </label>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-space-purple hover:text-space-purple-light transition-colors"
                >
                  <FaCalendarAlt />
                </button>
              </div>
              {showDatePicker && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Time Spent */}
            <div className="mb-4">
              <label className="block text-star-white mb-2">Time Spent (hours)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="timeSpent"
                  value={formData.timeSpent}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: e.target.value }))}
                  className="w-full px-3 py-2 bg-space-dark border border-star-white rounded text-star-white"
                  required
                />
                {(() => {
                  const h = parseFloat(formData.timeSpent);
                  let emoji = '☀️';
                  if (!isNaN(h)) {
                    if (h > 8) emoji = '🪐';
                    else if (h >= 4) emoji = '🌕';
                  }
                  return <span className="text-2xl ml-1" title="Motivation Emoji">{emoji}</span>;
                })()}
              </div>
            </div>

            {/* Current Progress Stage */}
            <div className="mb-4">
              <label className="block text-star-white mb-2">Current Progress Stage</label>
              <input
                type="number"
                name="currentProgressStage"
                value={formData.currentProgressStage}
                onChange={(e) => setFormData(prev => ({ ...prev, currentProgressStage: e.target.value }))}
                className="w-full px-3 py-2 bg-space-dark border border-star-white rounded text-star-white mb-2"
                required
              />
              {(() => {
                const stage = Number(formData.currentProgressStage);
                // Astronomy-themed sentences for each stage
                const stageSentences = [
                  'Stage 1: The journey begins — you are gazing into the cosmic unknown.',
                  'Stage 2: A crescent of curiosity appears on your horizon.',
                  'Stage 3: You chart your first constellations in the night sky.',
                  'Stage 4: Your telescope reveals new celestial wonders.',
                  'Stage 5: You reach the full moon of understanding — keep going!',
                  'Stage 6: You explore the far side of your learning universe.',
                  'Stage 7: You navigate through the last quarter, wisdom growing.',
                  'Stage 8: The dawn of mastery glows on your horizon.',
                  'Stage 9: You orbit the stars with confidence and skill.',
                  'Stage 10: You shine like a supernova — cosmic mastery achieved!',
                ];
                const sentence = stageSentences[stage-1] || stageSentences[0];
                // Moon phase emoji for each stage
                const phases = [
                  '🌑', // 1 - New Moon
                  '🌒', // 2 - Waxing Crescent
                  '🌓', // 3 - First Quarter
                  '🌔', // 4 - Waxing Gibbous
                  '🌕', // 5 - Full Moon
                  '🌖', // 6 - Waning Gibbous
                  '🌗', // 7 - Last Quarter
                  '🌘', // 8 - Waning Crescent
                  '🌙', // 9 - Crescent
                  '⭐', // 10 - Star (completion)
                ];
                const phase = phases[stage-1] || '🌑';
                // Color stops for slider
                const colors = [
                  '#23234d', // 1
                  '#2d2d6a', // 2
                  '#3b3b8f', // 3
                  '#4f46e5', // 4
                  '#7c3aed', // 5
                  '#a084f3', // 6
                  '#c084fc', // 7
                  '#eab308', // 8
                  '#fbbf24', // 9
                  '#f59e42', // 10
                ];
                const sliderColor = colors[stage-1] || '#23234d';
                return (
                  <>
                    <div className="relative flex items-center gap-2">
                      <span className="text-xl" role="img" aria-label="star">🌑</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.currentProgressStage}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentProgressStage: e.target.value }))}
                        className="w-full astronomy-slider"
                        style={{
                          background: `linear-gradient(90deg, ${sliderColor} 0%, #23234d 100%)`,
                          accentColor: sliderColor,
                          height: '8px',
                          borderRadius: '8px',
                        }}
                      />
                      <span className="text-xl" role="img" aria-label="star">🌟</span>
                    </div>
                    <div className="flex flex-col items-center mt-2 min-h-[2em]">
                      <span className="text-2xl mb-1" role="img" aria-label="phase">{phase}</span>
                      <span className="text-center text-blue-300 text-sm font-semibold">{sentence}</span>
                    </div>
                    <style>{`
                      input.astronomy-slider::-webkit-slider-thumb {
                        background: #fff;
                        border: 2px solid ${sliderColor};
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        box-shadow: 0 0 12px 4px ${sliderColor}, 0 0 0 4px #23234d inset;
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="6" y="24" font-size="22">🪐</text></svg>');
                        background-size: 80% 80%;
                        background-repeat: no-repeat;
                        background-position: center;
                        transition: box-shadow 0.2s;
                      }
                      input.astronomy-slider:focus::-webkit-slider-thumb,
                      input.astronomy-slider:hover::-webkit-slider-thumb {
                        box-shadow: 0 0 24px 8px ${sliderColor}, 0 0 0 4px #23234d inset;
                      }
                      input.astronomy-slider::-moz-range-thumb {
                        background: #fff;
                        border: 2px solid ${sliderColor};
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        box-shadow: 0 0 12px 4px ${sliderColor}, 0 0 0 4px #23234d inset;
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="6" y="24" font-size="22">🪐</text></svg>');
                        background-size: 80% 80%;
                        background-repeat: no-repeat;
                        background-position: center;
                        transition: box-shadow 0.2s;
                      }
                      input.astronomy-slider:focus::-moz-range-thumb,
                      input.astronomy-slider:hover::-moz-range-thumb {
                        box-shadow: 0 0 24px 8px ${sliderColor}, 0 0 0 4px #23234d inset;
                      }
                      input.astronomy-slider::-ms-thumb {
                        background: #fff;
                        border: 2px solid ${sliderColor};
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        box-shadow: 0 0 12px 4px ${sliderColor}, 0 0 0 4px #23234d inset;
                        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="6" y="24" font-size="22">🪐</text></svg>');
                        background-size: 80% 80%;
                        background-repeat: no-repeat;
                        background-position: center;
                        transition: box-shadow 0.2s;
                      }
                      input.astronomy-slider:focus::-ms-thumb,
                      input.astronomy-slider:hover::-ms-thumb {
                        box-shadow: 0 0 24px 8px ${sliderColor}, 0 0 0 4px #23234d inset;
                      }
                      input.astronomy-slider::-webkit-slider-runnable-track {
                        height: 8px;
                        border-radius: 8px;
                        background: linear-gradient(90deg, ${sliderColor} 0%, #23234d 100%);
                      }
                      input.astronomy-slider::-ms-fill-lower {
                        background: ${sliderColor};
                      }
                      input.astronomy-slider::-ms-fill-upper {
                        background: #23234d;
                      }
                    `}</style>
                  </>
                );
              })()}
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                Visibility
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => {
                      const newVal = !prev.isPublic;
                      console.log('Toggled isPublic:', newVal);
                      return { ...prev, isPublic: newVal };
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    formData.isPublic ? 'bg-space-purple' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-gray-300">
                  {formData.isPublic ? (
                    <span className="flex items-center">
                      <FaGlobe className="mr-2" /> Public
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaLock className="mr-2" /> Private
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                Skills Gained
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-space-purple bg-opacity-30 rounded-full text-base text-white font-semibold shadow-md skill-glow flex items-center"
                    style={{ boxShadow: '0 0 12px 2px #a084f3' }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-white hover:text-space-purple-light"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:border-space-purple"
                  placeholder="Add a skill..."
                />
                <button
                  type="button"
                  onClick={handleSkillAdd}
                  className="px-4 py-2 bg-space-purple bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all duration-300 font-semibold"
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-space-purple font-semibold mb-1">Suggested skills for this topic:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(topicSkills[formData.topic] || []).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (!formData.skills.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                        }
                      }}
                      className="px-4 py-2 bg-[#1a1a2e] border border-space-purple rounded-full text-base text-space-purple font-semibold shadow-md hover:bg-space-purple hover:text-white transition-all duration-200"
                      style={{ boxShadow: '0 0 8px 1px #6200ee55' }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-base font-semibold text-blue-400 mb-2">
                Next Steps
              </label>
              <div className="flex flex-wrap gap-3">
                {(formData.nextSteps || []).map((step, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-900 bg-opacity-60 rounded-full text-base text-blue-200 font-semibold shadow-md nextstep-glow"
                    style={{ boxShadow: '0 0 10px 2px #3b82f6' }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-space-purple text-white rounded-lg hover:bg-space-purple-light transition-colors"
              >
                {editingEntry ? 'Update Progress' : 'Log Progress'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center space-x-2">
          <span>🚀 Stellar work! Your learning log has been launched into the cosmos!</span>
        </div>
      )}
    </div>
  );
};

export default LearningProgressModal; 