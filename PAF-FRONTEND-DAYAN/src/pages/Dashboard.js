import React, { useState } from 'react';
import { FaUserAstronaut, FaRocket, FaStar, FaCompass, FaChartLine, FaUsers, FaPlus, FaGlobe, FaMoon, FaList, FaSpaceShuttle, FaMeteor, FaAtom, FaImage, FaPoll, FaTrash, FaEllipsisV, FaEdit } from 'react-icons/fa';

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

  // Interactive state for post actions
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const reactionEmojis = [
    { label: 'Like', emoji: '👍' },
    { label: 'Celebrate', emoji: '🎉' },
    { label: 'Love', emoji: '❤️' },
    { label: 'Insightful', emoji: '💡' },
    { label: 'Starstruck', emoji: '🤩' }
  ];

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
      {
        id: 1,
        content: `This photo captures my latest telescope setup under a beautifully clear sky just after sunset. I used a Newtonian reflector on an equatorial mount to begin my deep sky journey. The alignment was perfect, and I managed to track several constellations including Orion and Cassiopeia. This setup marks a major step in my astrophotography learning journey, and I'm excited to explore more targets like the Andromeda Galaxy and star clusters in the coming nights.`,
        image: "/telescope.jpg",
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

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postDeleted, setPostDeleted] = useState(false);

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
          @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
          .animate-fade-in { animation: fade-in 0.2s ease; }
          @keyframes rocket-blast {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            60% { transform: translateY(-40px) scale(1.2); opacity: 1; }
            80% { transform: translateY(-80px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(-120px) scale(0.9); opacity: 0; }
          }
          .animate-rocket-blast { animation: rocket-blast 1.2s cubic-bezier(.68,-0.55,.27,1.55); }
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
              {activeTab === 'posts' && !postDeleted && user.posts.map((post, index) => (
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
                  {/* Timer at bottom-right corner */}
                  <span className="absolute bottom-4 right-5 text-sm text-gray-400 z-40">2h ago</span>
                  <div className="flex items-start space-x-4">
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-orbitron" style={styles.gradientText}>{user.name}</h3>
                      </div>
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full max-w-md rounded-lg mt-4 mb-2 object-cover" />
                      )}
                      <p className="mt-2">{post.content}</p>
                      <div className="mt-4 flex items-center space-x-6">
                        {/* Like/Reaction Button */}
                        <div className="relative">
                          <button
                            className={`text-gray-400 hover:text-space-purple transition-colors flex items-center space-x-2 px-2 py-1 rounded ${selectedReaction ? 'bg-gray-700' : ''}`}
                            onClick={() => setShowReactions(!showReactions)}
                            data-tooltip="React"
                          >
                            <span className="text-xl">
                              {selectedReaction ? selectedReaction.emoji : '👍'}
                            </span>
                            <span>{likeCount > 0 ? likeCount : ''}</span>
                          </button>
                          {showReactions && (
                            <div className="absolute z-10 flex bg-gray-800 rounded shadow-lg p-2 top-10 left-0 animate-fade-in">
                              {reactionEmojis.map((reaction) => (
                                <button
                                  key={reaction.label}
                                  className="mx-1 text-2xl hover:scale-125 transition-transform"
                                  onClick={() => {
                                    setSelectedReaction(reaction);
                                    setLikeCount(likeCount + 1);
                                    setShowReactions(false);
                                  }}
                                  data-tooltip={reaction.label}
                                >
                                  {reaction.emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Save Button */}
                        <button
                          className={`text-gray-400 hover:text-space-purple transition-colors flex items-center space-x-2 px-2 py-1 rounded ${saved ? 'bg-gray-700 text-space-purple' : ''}`}
                          onClick={() => setSaved(!saved)}
                          data-tooltip={saved ? 'Saved' : 'Save Post'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
                          </svg>
                        </button>
                        {/* Comment Button */}
                        <button
                          className="text-gray-400 hover:text-space-purple transition-colors flex items-center space-x-2 px-2 py-1 rounded"
                          onClick={() => setCommentCount(commentCount + 1)}
                          data-tooltip="Comment"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4.28 1.07A1 1 0 013 19.13l1.07-4.28A9.77 9.77 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{commentCount > 0 ? commentCount : ''}</span>
                        </button>
                      </div>
                      {/* 3-dot menu (moved back to post card container) */}
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-space-purple p-2 rounded-full z-30"
                        onClick={() => setShowMenu(!showMenu)}
                        data-tooltip="More"
                      >
                        <FaEllipsisV className="text-xl" />
                      </button>
                      {showMenu && (
                        <div className="absolute top-12 right-4 bg-gray-900 border border-space-purple rounded-lg shadow-lg z-40 flex flex-col animate-fade-in">
                          <button
                            className="flex items-center px-4 py-2 text-gray-300 hover:text-space-purple transition-colors group"
                            onClick={() => { setShowMenu(false); /* update logic here */ }}
                            data-tooltip="Update"
                          >
                            <FaEdit className="mr-2 group-hover:animate-bounce" /> Update
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-red-400 hover:text-red-600 transition-colors group"
                            onClick={() => { setShowMenu(false); setShowDeleteDialog(true); }}
                            data-tooltip="Delete"
                          >
                            <FaTrash className="mr-2 group-hover:animate-rocket-blast" /> Delete
                          </button>
                        </div>
                      )}
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
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-space-navy border border-space-purple rounded-xl shadow-2xl p-8 relative animate-fade-in" style={{ minWidth: 340 }}>
            <div className="flex flex-col items-center">
              <FaRocket className="text-5xl text-space-purple mb-2 animate-rocket-blast" />
              <h2 className="text-xl font-orbitron mb-2 text-white">Delete Post?</h2>
              <p className="text-gray-300 mb-4 text-center">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-gray-200 hover:bg-gray-600"
                  onClick={() => setShowDeleteDialog(false)}
                >Cancel</button>
                <button
                  className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 flex items-center"
                  onClick={() => { setShowDeleteDialog(false); setPostDeleted(true); }}
                >
                  <FaRocket className="mr-2 animate-rocket-blast" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 