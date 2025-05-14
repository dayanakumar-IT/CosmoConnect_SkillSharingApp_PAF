import React, { useState } from 'react';
import { FaUserAstronaut, FaRocket, FaStar, FaCompass, FaChartLine, FaUsers, FaPlus, FaGlobe, FaMoon, FaSatellite, FaSpaceShuttle, FaMeteor, FaAtom } from 'react-icons/fa';
import Modal from '../components/Modal';
import LearningProgressModal from '../components/LearningProgressModal';
import LearningFlipCard from '../components/LearningFlipCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState('');
  const [hoverCard, setHoverCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [learningTopic, setLearningTopic] = useState('');
  const [learningSubject, setLearningSubject] = useState('');
  const [whatDidYouLearn, setWhatDidYouLearn] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [skills, setSkills] = useState([]);
  const [nextSteps, setNextSteps] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [learningEntries, setLearningEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  // Internal styles for space effects
  const styles = {
    gradientText: {
      background: 'linear-gradient(45deg, #6200ee, #bb86fc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }
  };

  const user = {
    name: "Astro Explorer",
    profilePic: "https://via.placeholder.com/150",
    summary: "Passionate about exploring the cosmos and sharing astronomical knowledge. Currently learning about deep space objects and astrophotography.",
    skills: ["Telescope Operation", "Astrophotography", "Star Mapping"],
    progress: 75,
    followers: 128,
    following: 64,
    posts: [
      { id: 1, content: "Just captured the Orion Nebula! 🌌 #astrophotography", likes: 45 },
      { id: 2, content: "Learning about variable stars today. Fascinating stuff! ⭐", likes: 32 }
    ]
  };

  // Predefined astronomy learning topics
  const learningTopics = [
    'Telescope Basics',
    'Star Mapping',
    'Deep Space Objects',
    'Astrophotography',
    'Cosmology',
    'Planetary Science'
  ];

  // Predefined skills
  const predefinedSkills = [
    'Telescope Operation',
    'Astrophotography',
    'Star Mapping',
    'Data Analysis',
    'Observational Astronomy'
  ];

  // Predefined skills based on topic
  const getSkillsForTopic = (topic) => {
    switch (topic) {
      case 'Telescope Basics':
        return ['Manual Focus', 'Polar Alignment', 'Eyepiece Use', 'Tripod Setup', 'Sky Calibration'];
      default:
        return [];
    }
  };

  // Auto-generate "What Did You Learn?" based on subject and topic
  const generateWhatDidYouLearn = (subject, topic) => {
    if (subject && topic) {
      return `Explored ${subject} in the context of ${topic}.`;
    }
    return '';
  };

  // Auto-generate next steps based on topic and time spent
  const generateNextSteps = (topic, hours) => {
    const steps = [];
    if (topic === 'Telescope Basics') {
      steps.push('🔭 Try a 10s long exposure');
      steps.push('🧭 Sketch a nebula');
      steps.push('📷 Capture Saturn\'s rings');
    }
    return steps.join(', ');
  };

  // Handler for adding a new skill
  const handleAddSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  // Handler for removing a skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      learningTopic,
      learningSubject,
      whatDidYouLearn,
      startDate,
      endDate,
      timeSpent,
      isPublic,
      skills,
      nextSteps
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setIsModalOpen(false);
  };

  // Reset form fields when modal opens
  const resetForm = () => {
    setLearningTopic('');
    setLearningSubject('');
    setWhatDidYouLearn('');
    setShowDatePicker(false);
    setStartDate('');
    setEndDate('');
    setTimeSpent('');
    setIsPublic(true);
    setSkills([]);
    setNextSteps('');
  };

  // Astronomy-themed short toast messages
  const TOASTS = {
    create: '🚀 Log Starred Up!',
    read: '🔭 Viewing Star Log',
    update: '🛠️ Log Polished Up!',
    delete: '☄️ Log Comet Gone!'
  };

  const [deletePrompt, setDeletePrompt] = useState({ show: false, id: null });

  const handleLearningSubmit = (data) => {
    if (editingEntry) {
      setLearningEntries(entries =>
        entries.map(entry =>
          entry.id === editingEntry.id ? { ...data, id: entry.id } : entry
        )
      );
      setEditingEntry(null);
      toast.info(TOASTS.update, { position: 'bottom-right', autoClose: 1800 });
    } else {
      setLearningEntries(entries => [...entries, { ...data, id: Date.now() }]);
      toast.success(TOASTS.create, { position: 'bottom-right', autoClose: 1800 });
    }
    setIsModalOpen(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id) => {
    setDeletePrompt({ show: true, id });
  };

  const confirmDeleteEntry = () => {
    setLearningEntries(entries => entries.filter(entry => entry.id !== deletePrompt.id));
    toast.error(TOASTS.delete, { position: 'bottom-right', autoClose: 1800 });
    setDeletePrompt({ show: false, id: null });
  };

  const cancelDeleteEntry = () => {
    setDeletePrompt({ show: false, id: null });
  };

  return (
    <div className="min-h-screen bg-space-dark text-star-white pt-20">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(98, 0, 238, 0.3); }
            50% { box-shadow: 0 0 25px rgba(98, 0, 238, 0.5); }
          }
          
          .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(98, 0, 238, 0.2);
          }
          
          .skill-tag {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .skill-tag:hover {
            transform: scale(1.05);
            background-opacity: 0.8;
          }
          
          .progress-bar {
            position: relative;
            overflow: hidden;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-space-navy rounded-lg p-6 border border-space-purple hover-card">
              <div className="text-center relative">
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mx-auto border-2 border-space-purple relative z-10"
                />
                <h2 className="text-xl font-orbitron mt-4" style={styles.gradientText}>{user.name}</h2>
                <p className="text-gray-400 mt-2 text-sm">{user.summary}</p>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Learning Progress</span>
                    <span className="text-sm text-space-purple">{user.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 progress-bar">
                    <div 
                      className="bg-space-purple h-2 rounded-full" 
                      style={{ width: `${user.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-800 hover-card">
                    <div className="text-2xl font-orbitron" style={styles.gradientText}>{user.followers}</div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800 hover-card">
                    <div className="text-2xl font-orbitron" style={styles.gradientText}>{user.following}</div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-orbitron mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-space-purple bg-opacity-20 rounded-full text-sm skill-tag"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Post Creation */}
            <div className="bg-space-navy rounded-lg p-6 mb-6 border border-space-purple hover-card">
              <div className="flex items-start space-x-4">
                <img 
                  src={user.profilePic} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your cosmic discoveries..."
                    className="w-full bg-gray-800 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-space-purple"
                    rows="3"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4">
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110">
                        <FaGlobe className="text-xl text-space-purple" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110">
                        <FaMoon className="text-xl text-space-purple" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110">
                        <FaSatellite className="text-xl text-space-purple" />
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-space-purple rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                      <FaRocket className="text-lg animate-bounce" />
                      <span>Launch Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6">
              {[
                { id: 'posts', icon: <FaStar />, label: 'Posts' },
                { id: 'progress', icon: <FaChartLine />, label: 'Progress' },
                { id: 'community', icon: <FaUsers />, label: 'Community' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 ${
                    activeTab === tab.id 
                      ? 'bg-space-purple text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'animate-pulse' : ''}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              {activeTab === 'posts' && user.posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="bg-space-navy rounded-lg p-6 border border-space-purple hover-card relative"
                  onMouseEnter={() => setHoverCard(index)}
                  onMouseLeave={() => setHoverCard(null)}
                >
                  {hoverCard === index && (
                    <div className="absolute -top-2 -right-2">
                      <FaMeteor className="text-space-purple text-xl animate-spin" />
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-orbitron" style={styles.gradientText}>{user.name}</h3>
                        <span className="text-sm text-gray-400">2h ago</span>
                      </div>
                      <p className="mt-2">{post.content}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-space-purple transition-colors flex items-center space-x-2">
                          <FaStar className="inline" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="text-gray-400 hover:text-space-purple transition-colors flex items-center space-x-2">
                          <FaCompass className="inline" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'progress' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-orbitron text-space-purple">Progress</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-2 text-space-purple hover:text-space-purple-light transition-colors"
                    >
                      <FaPlus className="text-xl" />
                    </button>
                  </div>
                  {/* Progress Card Container */}
                  <div className="bg-[#18182a] border border-space-purple rounded-2xl p-8">
                    <div className="flex flex-wrap gap-x-8 gap-y-8 justify-center">
                      {learningEntries.map(entry => (
                        <LearningFlipCard
                          key={entry.id}
                          data={entry}
                          onEdit={handleEditEntry}
                          onDelete={handleDeleteEntry}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'community' && (
                <div className="bg-space-navy rounded-lg p-6 border border-space-purple hover-card">
                  <div className="flex items-center space-x-3 mb-4">
                    <FaUsers className="text-2xl text-space-purple" />
                    <h3 className="text-xl font-orbitron" style={styles.gradientText}>Astronomy Community</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover-card"
                        onMouseEnter={() => setHoverCard(`community-${index}`)}
                        onMouseLeave={() => setHoverCard(null)}
                      >
                        <div className="relative">
                          <img 
                            src={`https://via.placeholder.com/50?text=User${index + 1}`}
                            alt="User"
                            className="w-12 h-12 rounded-full"
                          />
                          {hoverCard === `community-${index}` && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-space-purple rounded-full animate-pulse" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-orbitron">Astro Explorer {index + 1}</h4>
                          <p className="text-sm text-gray-400">Sharing cosmic discoveries</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress Modal */}
      <LearningProgressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleLearningSubmit}
        editingEntry={editingEntry}
      />

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-space-purple text-white py-2 px-4 rounded-md shadow-lg">
          🚀 Learning logged! You're one step closer to the stars.
        </div>
      )}

      <ToastContainer />

      {deletePrompt.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#18182a] border-4 border-space-purple rounded-2xl p-10 shadow-2xl flex flex-col items-center animate-pulse" style={{ boxShadow: '0 0 40px 8px #a084f3, 0 0 0 8px #23234d inset' }}>
            <span className="text-5xl mb-4 animate-bounce">☄️</span>
            <h3 className="text-2xl font-orbitron text-space-purple mb-2">Cosmic Deletion</h3>
            <p className="text-lg text-blue-200 mb-6 text-center">Are you sure you want to erase this log from your universe?</p>
            <div className="flex gap-6 mt-2">
              <button onClick={confirmDeleteEntry} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg text-lg font-semibold">
                <span role="img" aria-label="comet">☄️</span> Delete Log
              </button>
              <button onClick={cancelDeleteEntry} className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-space-purple shadow text-lg font-semibold">
                <span role="img" aria-label="planet">🪐</span> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 