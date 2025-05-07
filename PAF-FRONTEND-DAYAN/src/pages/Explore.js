import React, { useState } from 'react';
import { FaRegCommentDots, FaShare, FaEllipsisH, FaBookmark, FaRegBookmark, FaUserPlus, FaCalendarAlt, FaBell, FaRocket, FaStar, FaGlobe, FaMoon } from 'react-icons/fa';

const posts = [
  {
    id: 1,
    user: {
      name: 'Stellar Sam',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    time: '1h',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    desc: 'Captured the Milky Way core from a dark sky site. The clarity tonight was out of this world! 🌌',
    likes: 23,
    comments: 5,
    shares: 2,
  },
  {
    id: 2,
    user: {
      name: 'Nebula Nate',
      avatar: 'https://i.pravatar.cc/150?img=36',
    },
    time: '2h',
    image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
    desc: 'First light with my new telescope! Managed to spot Saturn and its rings. Absolutely mesmerizing. 🪐',
    likes: 41,
    comments: 8,
    shares: 3,
  },
  {
    id: 3,
    user: {
      name: 'Galaxy Grace',
      avatar: 'https://i.pravatar.cc/150?img=24',
    },
    time: '3h',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    desc: 'Orion Nebula through my lens. The colors and details are just stunning. Can\'t wait to process more shots! ✨',
    likes: 35,
    comments: 6,
    shares: 1,
  },
];

const emojiReactions = [
  { label: 'Like', emoji: '👍', color: 'text-blue-400' },
  { label: 'Love', emoji: '❤️', color: 'text-red-400' },
  { label: 'Celebrate', emoji: '🎉', color: 'text-yellow-400' },
  { label: 'Starstruck', emoji: '🤩', color: 'text-purple-400' },
  { label: 'Rocket', emoji: '🚀', color: 'text-green-400' },
];

const suggestedUsers = [
  { name: 'Astro Alex', avatar: 'https://i.pravatar.cc/150?img=60', desc: 'Astrophotographer' },
  { name: 'Luna Lee', avatar: 'https://i.pravatar.cc/150?img=32', desc: 'Lunar Observer' },
  { name: 'Comet Chris', avatar: 'https://i.pravatar.cc/150?img=44', desc: 'Comet Hunter' },
  { name: 'Star Mapper Mia', avatar: 'https://i.pravatar.cc/150?img=15', desc: 'Star Mapper' },
  { name: 'Rocket Ron', avatar: 'https://i.pravatar.cc/150?img=18', desc: 'Rocketry Enthusiast' },
  { name: 'Planet Paige', avatar: 'https://i.pravatar.cc/150?img=28', desc: 'Planetary Scientist' },
  { name: 'Galaxy Greg', avatar: 'https://i.pravatar.cc/150?img=38', desc: 'Galaxy Explorer' },
  { name: 'Aurora Amy', avatar: 'https://i.pravatar.cc/150?img=53', desc: 'Aurora Chaser' },
  { name: 'Meteor Max', avatar: 'https://i.pravatar.cc/150?img=21', desc: 'Meteor Watcher' },
  { name: 'Solar Sam', avatar: 'https://i.pravatar.cc/150?img=11', desc: 'Solar Observer' },
];

const spaceEvents = [
  { date: 'Jul 21', title: 'Delta Aquariids Meteor Shower', desc: 'Peak viewing for this annual meteor shower.' },
  { date: 'Aug 12', title: 'Perseid Meteor Shower', desc: 'One of the best meteor showers of the year.' },
  { date: 'Sep 18', title: 'Neptune at Opposition', desc: 'Neptune is closest to Earth and fully illuminated.' },
];

// Astronomy facts and quiz questions
const astronomyFacts = [
  'A day on Venus is longer than a year on Venus.',
  'Neutron stars can spin at a rate of 600 rotations per second.',
  'There are more trees on Earth than stars in the Milky Way.',
  'The footprints on the Moon will be there for millions of years.',
  'Jupiter has 80 known moons.',
  'A spoonful of a neutron star weighs about a billion tons.',
  'The Sun makes up 99.8% of the mass in our solar system.'
];

const quizQuestions = [
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 'Mars',
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'],
    answer: 'Jupiter',
  },
  {
    question: 'How many planets are in our solar system?',
    options: ['7', '8', '9', '10'],
    answer: '8',
  },
  {
    question: 'What is the closest star to Earth?',
    options: ['Alpha Centauri', 'Betelgeuse', 'The Sun', 'Sirius'],
    answer: 'The Sun',
  },
];

// Daily Space Challenges
const spaceChallenges = [
  'Spot a planet in the night sky and share a photo!',
  'Draw or photograph your favorite constellation.',
  'Share a fun fact about a galaxy you love.',
  'Try to identify the phase of the Moon tonight.',
  'Find and share a news article about a recent space mission.',
  'Observe the International Space Station if it passes over your area.',
  'Share your favorite astronomy app or tool.',
  'Write a short poem about the stars.',
  'Share a picture of your telescope or binoculars setup.',
  'Challenge a friend to a stargazing night!'
];

const Explore = () => {
  const [reactions, setReactions] = useState(posts.map(() => null));
  const [showPicker, setShowPicker] = useState(posts.map(() => false));
  const [saved, setSaved] = useState(posts.map(() => false));
  const [followed, setFollowed] = useState(suggestedUsers.map(() => false));
  // Mini Space Quiz/Fact state
  const [showQuiz, setShowQuiz] = useState(Math.random() > 0.5);
  const [factIdx] = useState(Math.floor(Math.random() * astronomyFacts.length));
  const [quizIdx] = useState(Math.floor(Math.random() * quizQuestions.length));
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const handleReaction = (idx, reaction) => {
    const newReactions = [...reactions];
    newReactions[idx] = reaction;
    setReactions(newReactions);
    setShowPicker(posts.map(() => false));
  };

  const handleRemoveReaction = (idx) => {
    const newReactions = [...reactions];
    newReactions[idx] = null;
    setReactions(newReactions);
    setShowPicker(posts.map(() => false));
  };

  const handleShowPicker = idx => {
    const newShow = posts.map((_, i) => i === idx ? !showPicker[idx] : false);
    setShowPicker(newShow);
  };

  const handleSave = idx => {
    const newSaved = [...saved];
    newSaved[idx] = !newSaved[idx];
    setSaved(newSaved);
  };

  const handleFollow = idx => {
    const newFollowed = [...followed];
    newFollowed[idx] = !newFollowed[idx];
    setFollowed(newFollowed);
  };

  const handleQuizOption = (option) => {
    setSelectedOption(option);
    setQuizResult(option === quizQuestions[quizIdx].answer ? 'correct' : 'incorrect');
    setTimeout(() => {
      setQuizResult(null);
      setSelectedOption(null);
      // Optionally, show a new quiz/fact
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-space-dark pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Mini Space Quiz or Daily Fact */}
        <div className="w-full lg:w-80 flex flex-col gap-8 mt-8 lg:mt-0">
          <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5 relative overflow-hidden">
            {/* Decorative floating icons in corners with opacity */}
            <FaRocket className="absolute left-2 top-2 text-space-purple animate-float-slow opacity-30" size={32} />
            <FaStar className="absolute right-2 top-2 text-yellow-400 animate-float-fast opacity-30" size={24} />
            <FaGlobe className="absolute left-2 bottom-2 text-blue-400 animate-float-medium opacity-30" size={24} />
            <FaMoon className="absolute right-2 bottom-2 text-gray-300 animate-float-medium opacity-30" size={24} />
            {/* Title row */}
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <span className="flex items-center text-lg font-orbitron text-space-purple">
                {showQuiz ? <FaStar className="mr-2 animate-spin text-yellow-400" /> : <FaRocket className="mr-2 animate-float-slow text-space-purple" />} 
                {showQuiz ? 'Mini Space Quiz' : 'Astronomy Fact'}
              </span>
            </div>
            {/* Main content */}
            <div className="flex flex-col items-center justify-center z-10 relative">
              {showQuiz ? (
                <>
                  <div className="text-white font-semibold mb-3 text-center">{quizQuestions[quizIdx].question}</div>
                  <div className="flex flex-col gap-2 w-full">
                    {quizQuestions[quizIdx].options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleQuizOption(option)}
                        disabled={!!quizResult}
                        className={`px-3 py-2 rounded-lg text-left font-bold transition-all border border-space-purple bg-gray-800 text-white hover:bg-space-purple hover:text-white w-full ${selectedOption === option ? (quizResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {quizResult && (
                    <div className="mt-4 flex items-center justify-center">
                      {quizResult === 'correct' ? (
                        <span className="flex items-center text-green-400 font-bold animate-bounce">
                          <FaStar className="mr-2 animate-spin" /> Correct!
                        </span>
                      ) : (
                        <span className="flex items-center text-red-400 font-bold animate-pulse">
                          <FaRocket className="mr-2 animate-float-fast" /> Try Again!
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white font-semibold text-center min-h-[60px] flex flex-col items-center justify-center">
                  <span className="mb-2"><FaStar className="animate-spin text-yellow-400" size={22} /></span>
                  <span>{astronomyFacts[factIdx]}</span>
                </div>
              )}
            </div>
          </div>
          {/* Daily Space Challenge */}
          <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5 relative overflow-hidden mt-4">
            <div className="flex items-center mb-3">
              <FaRocket className="text-space-purple animate-float-slow mr-2" size={22} />
              <h3 className="text-lg font-orbitron text-space-purple">Daily Space Challenge</h3>
            </div>
            <div className="flex items-center text-white font-semibold text-center min-h-[48px]">
              <FaStar className="mr-2 animate-spin text-yellow-400" size={18} />
              <span>{spaceChallenges[Math.floor((Date.now()/8.64e7)%spaceChallenges.length)]}</span>
            </div>
            <div className="absolute right-3 bottom-2 opacity-20">
              <FaMoon className="animate-float-medium text-gray-300" size={28} />
            </div>
          </div>
        </div>
        {/* Feed */}
        <div className="flex-1 max-w-xl mx-auto space-y-8">
          {posts.map((post, idx) => (
            <div key={post.id} className="bg-space-navy rounded-xl shadow-lg border border-space-purple relative">
              <div className="flex items-center px-4 pt-4 pb-2">
                <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3 border-2 border-space-purple" />
                <div className="flex-1">
                  <span className="font-orbitron text-space-purple block">{post.user.name}</span>
                  <span className="text-xs text-gray-400">{post.time} ago</span>
                </div>
                <button className="text-gray-400 hover:text-space-purple p-2 rounded-full">
                  <FaEllipsisH size={22} />
                </button>
              </div>
              <img src={post.image} alt="space" className="w-full object-cover max-h-96" />
              <div className="p-4">
                <p className="mb-2 text-white">{post.desc}</p>
                <div className="flex items-center space-x-8 mt-4">
                  {/* Emoji Like/Reaction */}
                  <div className="relative">
                    <button
                      onClick={() => handleShowPicker(idx)}
                      className={`flex items-center text-2xl px-2 py-1 rounded-lg ${reactions[idx] ? 'bg-gray-800' : ''} hover:bg-gray-800 transition-all`}
                    >
                      <span className={reactions[idx]?.color || 'text-blue-400'}>
                        {reactions[idx]?.emoji || '👍'}
                      </span>
                    </button>
                    {showPicker[idx] && (
                      <div className="fixed z-50 flex bg-gray-900 rounded shadow-lg p-2 animate-fade-in"
                           style={{ top: `${window.scrollY + 120 + idx * 180}px`, left: '50%', transform: 'translateX(-50%)' }}>
                        {emojiReactions.map((reaction) => (
                          <button
                            key={reaction.label}
                            className={`mx-1 text-2xl hover:scale-125 transition-transform ${reaction.color}`}
                            onClick={() => handleReaction(idx, reaction)}
                            title={reaction.label}
                          >
                            {reaction.emoji}
                          </button>
                        ))}
                        {/* Remove reaction option */}
                        <button
                          className="mx-1 text-2xl hover:scale-125 transition-transform text-gray-400"
                          onClick={() => handleRemoveReaction(idx)}
                          title="Remove Reaction"
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Save Icon */}
                  <button
                    onClick={() => handleSave(idx)}
                    className={`text-2xl px-2 py-1 rounded-lg ${saved[idx] ? 'text-space-purple' : 'text-gray-400'} hover:text-space-purple transition-all`}
                    title={saved[idx] ? 'Saved' : 'Save Post'}
                  >
                    {saved[idx] ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  {/* Comment Icon */}
                  <div className="flex items-center text-2xl text-blue-300">
                    <FaRegCommentDots className="mr-2" />
                    <span className="text-base">{post.comments}</span>
                  </div>
                  {/* Share Icon */}
                  <div className="flex items-center text-2xl text-yellow-400">
                    <FaShare className="mr-2" />
                    <span className="text-base">{post.shares}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-8 mt-8 lg:mt-0">
          {/* Suggested Users to Follow */}
          <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5">
            <h3 className="text-lg font-orbitron text-space-purple mb-4">Suggested Users to Follow</h3>
            {suggestedUsers.map((user, idx) => (
              <div key={user.name} className="flex items-center mb-4 last:mb-0">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-space-purple mr-3" />
                <div className="flex-1">
                  <div className="text-white font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.desc}</div>
                </div>
                <button
                  onClick={() => handleFollow(idx)}
                  className={`ml-2 px-3 py-1 rounded-lg text-sm font-bold flex items-center ${followed[idx] ? 'bg-gray-700 text-space-purple' : 'bg-space-purple text-white'} hover:scale-105 transition-all`}
                >
                  <FaUserPlus className="mr-1" />
                  {followed[idx] ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          {/* Upcoming Space Events */}
          <div className="bg-space-navy border border-space-purple rounded-xl shadow-lg p-5">
            <h3 className="text-lg font-orbitron text-space-purple mb-4">Upcoming Space Events</h3>
            <div className="relative pl-4 border-l-2 border-space-purple">
              {spaceEvents.map((event, idx) => (
                <div
                  key={event.title}
                  className="group flex items-start mb-8 last:mb-0 relative hover:shadow-lg hover:bg-gray-900 transition-all rounded-lg p-3"
                  style={{ marginLeft: '-16px' }}
                >
                  {/* Timeline dot and animated icon */}
                  <div className="flex flex-col items-center mr-4">
                    <span className="relative flex h-8 w-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-space-purple opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-8 w-8 bg-space-purple items-center justify-center">
                        <FaCalendarAlt className="text-white text-lg" />
                      </span>
                    </span>
                    <span className="bg-space-purple text-white rounded-full px-3 py-1 text-xs font-bold mt-2 shadow-md border-2 border-white">{event.date}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-base mb-1 group-hover:text-space-purple transition-colors">{event.title}</div>
                    <div className="text-xs text-gray-400 mb-2">{event.desc}</div>
                    <button className="flex items-center px-3 py-1 bg-space-purple text-white rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all shadow-md">
                      <FaBell className="mr-1 animate-bounce" /> Remind Me
                    </button>
                  </div>
                </div>
              ))}
              {/* Vertical timeline line */}
              <span className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-space-purple to-transparent opacity-40 rounded-full" style={{ zIndex: 0 }}></span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.2s ease; }
        .bg-space-navy .animate-ping {
          animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite alternate;
        }
        .animate-float-medium {
          animation: float-medium 2.8s ease-in-out infinite alternate;
        }
        .animate-float-fast {
          animation: float-fast 1.5s ease-in-out infinite alternate;
        }
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-18px); }
        }
        @keyframes float-medium {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default Explore; 