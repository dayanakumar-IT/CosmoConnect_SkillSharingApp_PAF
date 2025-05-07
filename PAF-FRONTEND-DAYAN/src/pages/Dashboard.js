import React, { useState } from 'react';
import { FaUserAstronaut, FaRocket, FaStar, FaCompass, FaChartLine, FaUsers, FaPlus, FaGlobe, FaMoon, FaList, FaSpaceShuttle, FaMeteor, FaAtom, FaImage, FaPoll, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState('');
  const [hoverCard, setHoverCard] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [collaborate, setCollaborate] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [playlists] = useState([
    { id: 'telescope-basics', name: 'Telescope Basics Series' },
    { id: 'star-mapping', name: 'Star Mapping Guide' },
    { id: 'deep-space', name: 'Deep Space Exploration' }
  ]);

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
    profilePic: "https://i.pravatar.cc/150?img=60",
    summary: "Passionate about exploring the cosmos and sharing astronomical knowledge. Currently learning about deep space objects and astrophotography.",
    skills: ["Telescope Operation", "Astrophotography", "Star Mapping"],
    progress: 75,
    followers: 128,
    following: 64,
    posts: [
      { id: 1, content: "Just captured the Orion Nebula! 🌌 #astrophotography", likes: 45 },
      { id: 2, content: "Learning about variable stars today. Fascinating stuff! ⭐", likes: 32 },
      {
        id: 3,
        content: `This photo captures my latest telescope setup under a beautifully clear sky just after sunset. I used a Newtonian reflector on an equatorial mount to begin my deep sky journey. The alignment was perfect, and I managed to track several constellations including Orion and Cassiopeia. This setup marks a major step in my astrophotography learning journey, and I'm excited to explore more targets like the Andromeda Galaxy and star clusters in the coming nights.`,
        image: "/telescope.jpg",
        likes: 0
      }
    ]
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia(reader.result);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index) => {
    const newOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(newOptions);
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
          
          [data-tooltip]:before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            padding: 5px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
          }
          [data-tooltip]:hover:before {
            opacity: 1;
          }
          @keyframes floatBubble {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .playlist-bubble {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, #bb86fc 60%, #6200ee 100%);
            color: white;
            font-weight: bold;
            font-size: 0.95rem;
            margin: 0 16px;
            box-shadow: 0 4px 24px rgba(98,0,238,0.15);
            cursor: pointer;
            transition: box-shadow 0.3s, transform 0.3s;
            animation: floatBubble 3s ease-in-out infinite;
            border: 2px solid transparent;
            position: relative;
          }
          .playlist-bubble.selected {
            box-shadow: 0 0 24px 8px #bb86fc;
            border: 2px solid #fff;
            transform: scale(1.12);
          }
          .playlist-bubble .rocket {
            position: absolute;
            top: -28px;
            left: 50%;
            transform: translateX(-50%);
            transition: top 0.4s;
          }
          .playlist-bubble.selected .rocket {
            top: -40px;
            animation: rocketLaunch 0.7s linear;
          }
          @keyframes rocketLaunch {
            0% { top: -28px; }
            50% { top: -60px; }
            100% { top: -40px; }
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
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110" data-tooltip="Globe">
                        <FaGlobe className="text-xl text-white" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110" data-tooltip="Moon">
                        <FaMoon className="text-xl text-white" />
                      </button>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110" 
                        data-tooltip="Add to Playlist"
                        onClick={() => setShowPlaylistOptions(!showPlaylistOptions)}
                      >
                        <FaList className="text-xl text-white" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110" data-tooltip="Upload Media">
                        <input type="file" accept="image/*,video/*" className="hidden" id="mediaUpload" onChange={(e) => handleMediaUpload(e)} />
                        <label htmlFor="mediaUpload" className="cursor-pointer">
                          <FaImage className="text-xl text-white" />
                        </label>
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-110" onClick={() => setShowPollBuilder(!showPollBuilder)} data-tooltip="Create Poll">
                        <FaPoll className="text-xl text-white" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={collaborate} onChange={(e) => setCollaborate(e.target.checked)} className="form-checkbox h-5 w-5 text-space-purple" />
                        <span className="text-gray-300">Collaborate</span>
                      </label>
                      <button className="px-4 py-2 bg-space-purple rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                        <FaRocket className="text-lg animate-bounce" />
                        <span>Launch Post</span>
                      </button>
                    </div>
                  </div>
                  {selectedMedia && (
                    <div className="mt-4">
                      {mediaType === 'image' ? (
                        <img src={selectedMedia} alt="Selected" className="w-full h-40 object-cover rounded-lg" />
                      ) : (
                        <video src={selectedMedia} controls className="w-full h-40 object-cover rounded-lg" />
                      )}
                    </div>
                  )}
                  {showPollBuilder && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg border border-space-purple">
                      <h3 className="text-lg font-orbitron mb-2 text-white">Create a Poll</h3>
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:border-space-purple focus:outline-none"
                          />
                          <button onClick={() => removePollOption(index)} className="p-2 text-red-500 hover:text-red-700" data-tooltip="Remove Option">
                            <FaTrash className="text-xl" />
                          </button>
                        </div>
                      ))}
                      <button onClick={addPollOption} className="mt-2 p-2 bg-space-purple rounded text-white hover:bg-opacity-90 transition-all duration-300">Add Option</button>
                    </div>
                  )}
                  {showPlaylistOptions && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg border border-space-purple">
                      <h3 className="text-lg font-orbitron mb-4 text-white">Add to Learning Playlist</h3>
                      <div className="flex justify-center items-center mb-2">
                        {playlists.map((playlist, idx) => (
                          <div
                            key={playlist.id}
                            className={`playlist-bubble${selectedPlaylist === playlist.id ? ' selected' : ''}`}
                            onClick={() => setSelectedPlaylist(playlist.id)}
                            style={{ animationDelay: `${idx * 0.3}s` }}
                            data-tooltip={playlist.name}
                          >
                            {selectedPlaylist === playlist.id && (
                              <span className="rocket">
                                <FaRocket className="text-2xl text-white animate-bounce" />
                              </span>
                            )}
                            <span style={{ zIndex: 2 }}>{playlist.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-400 text-center">
                        Group your posts into learning series for better organization
                      </div>
                    </div>
                  )}
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
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full max-w-md rounded-lg mt-4 mb-2 object-cover" />
                      )}
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
                <div className="bg-space-navy rounded-lg p-6 border border-space-purple hover-card">
                  <div className="flex items-center space-x-3 mb-4">
                    <FaSpaceShuttle className="text-2xl text-space-purple" />
                    <h3 className="text-xl font-orbitron" style={styles.gradientText}>Learning Journey</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Telescope Basics', status: 'Completed', icon: <FaAtom /> },
                      { name: 'Star Mapping', status: 'In Progress', icon: <FaCompass /> },
                      { name: 'Deep Space Objects', status: 'Not Started', icon: <FaCompass /> }
                    ].map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover-card">
                        <div className="flex items-center space-x-3">
                          <span className="text-space-purple">{course.icon}</span>
                          <span className="text-gray-400">{course.name}</span>
                        </div>
                        <span className={course.status === 'Completed' ? 'text-space-purple' : 'text-gray-400'}>
                          {course.status}
                        </span>
                      </div>
                    ))}
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
                            src={`https://i.pravatar.cc/50?img=${index + 10}`}
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
    </div>
  );
};

export default Dashboard; 