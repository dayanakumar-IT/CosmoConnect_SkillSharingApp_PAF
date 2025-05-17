import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { userService } from '../api';
import { FaCommentDots, FaBookmark, FaUserAstronaut, FaPoll, FaCalendarAlt, FaTrophy, FaQuestionCircle, FaStar, FaUsers } from 'react-icons/fa';
import { COLORFUL_CATEGORIES } from '../constants/categories';
import CommentSection from '../components/CommentSection';
import Post from '../components/Post';
import QuoteCard from '../components/Explore/ConstellationGame';

function getProfilePicUrl(imageUrl) {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/${imageUrl}`;
}

// Dummy data for quiz, events, and featured users
const QUIZ_QUESTIONS = [
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1
  },
  {
    question: 'What is the name of our galaxy?',
    options: ['Andromeda', 'Milky Way', 'Whirlpool', 'Sombrero'],
    answer: 1
  },
  {
    question: 'Which star is the brightest in the night sky?',
    options: ['Sirius', 'Betelgeuse', 'Polaris', 'Vega'],
    answer: 0
  }
];
const EVENTS = [
  { date: '2024-06-15', name: 'Meteor Shower Peak', icon: '☄️' },
  { date: '2024-07-04', name: 'Partial Lunar Eclipse', icon: '🌑' },
  { date: '2024-08-12', name: 'Perseid Meteor Shower', icon: '🌠' },
  { date: '2024-09-23', name: 'Equinox Star Party', icon: '✨' },
  { date: '2024-10-14', name: 'Annular Solar Eclipse', icon: '🌞' },
  { date: '2024-11-18', name: 'Leonid Meteor Shower', icon: '🌟' },
  { date: '2024-12-13', name: 'Geminid Meteor Shower', icon: '💫' },
  { date: '2025-01-03', name: 'Quadrantid Meteor Shower', icon: '🌌' },
  { date: '2025-02-27', name: 'Full Snow Moon', icon: '🌕' },
  { date: '2025-03-20', name: 'Vernal Equinox', icon: '🌸' },
];
const CONSTELLATIONS = [
  { name: 'Orion', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Orion_IAU.svg' },
  { name: 'Ursa Major', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Ursa_Major_IAU.svg' },
  { name: 'Cassiopeia', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cassiopeia_IAU.svg' },
  { name: 'Scorpius', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Scorpius_IAU.svg' },
  { name: 'Cygnus', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Cygnus_IAU.svg' },
  { name: 'Leo', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Leo_IAU.svg' },
  { name: 'Taurus', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Taurus_IAU.svg' },
  { name: 'Gemini', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Gemini_IAU.svg' },
  { name: 'Aquila', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Aquila_IAU.svg' },
  { name: 'Lyra', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Lyra_IAU.svg' }
];
const FEATURED_USERS = [
  { name: 'Stella Nova', img: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Astrophotographer' },
  { name: 'Leo Star', img: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Meteor Hunter' },
  { name: 'Luna Sky', img: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'Cosmic Blogger' }
];

function getRandomInt(max) { return Math.floor(Math.random() * max); }

// Add planet SVGs or images for each quiz
const PLANET_SVGS = [
  // Earth
  <svg width="90" height="90" viewBox="0 0 90 90" key="earth">
    <defs>
      <radialGradient id="earthBlue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#5ec6fa" />
        <stop offset="80%" stopColor="#1a3a6b" />
        <stop offset="100%" stopColor="#0a1a2f" />
      </radialGradient>
    </defs>
    <circle cx="45" cy="45" r="40" fill="url(#earthBlue)" stroke="#2d2d4d" strokeWidth="4" />
    {/* Continents */}
    <ellipse cx="35" cy="50" rx="10" ry="5" fill="#7ed957" opacity="0.7" />
    <ellipse cx="60" cy="35" rx="7" ry="3" fill="#7ed957" opacity="0.5" />
    <ellipse cx="50" cy="60" rx="5" ry="2" fill="#7ed957" opacity="0.4" />
  </svg>,
  // Moon
  <svg width="90" height="90" viewBox="0 0 90 90" key="moon">
    <defs>
      <radialGradient id="moonGray" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e0e0e0" />
        <stop offset="80%" stopColor="#888" />
        <stop offset="100%" stopColor="#23234d" />
      </radialGradient>
    </defs>
    <circle cx="45" cy="45" r="40" fill="url(#moonGray)" stroke="#2d2d4d" strokeWidth="4" />
    {/* Craters */}
    <ellipse cx="60" cy="40" rx="7" ry="3" fill="#23234d" opacity="0.18" />
    <ellipse cx="35" cy="60" rx="5" ry="2" fill="#23234d" opacity="0.22" />
    <ellipse cx="50" cy="50" rx="3" ry="1.5" fill="#23234d" opacity="0.15" />
  </svg>,
  // Mars
  <svg width="90" height="90" viewBox="0 0 90 90" key="mars">
    <defs>
      <radialGradient id="marsRed" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffb37b" />
        <stop offset="80%" stopColor="#c1440e" />
        <stop offset="100%" stopColor="#6b1a0a" />
      </radialGradient>
    </defs>
    <circle cx="45" cy="45" r="40" fill="url(#marsRed)" stroke="#2d2d4d" strokeWidth="4" />
    {/* Mars surface */}
    <ellipse cx="60" cy="60" rx="8" ry="3" fill="#fff" opacity="0.08" />
    <ellipse cx="35" cy="35" rx="5" ry="2" fill="#fff" opacity="0.05" />
  </svg>
];

// For Guess the Constellation, use the local OIP.jpg image from public
const CONSTELLATION_IMAGE = '/OIP.jpg';

function Explore() {
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPolls, setSelectedPolls] = useState({}); // { postId: selectedOptionIdx }
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedComments, setExpandedComments] = useState({}); // { postId: true/false }
  const [commentCounts, setCommentCounts] = useState({}); // { postId: count }
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [constellationIdx, setConstellationIdx] = useState(0);
  const [constellationGuess, setConstellationGuess] = useState('');
  const [constellationResult, setConstellationResult] = useState(null);
  const [globeGlow, setGlobeGlow] = useState(null); // null | 'correct' | 'wrong'
  const wheelRef = useRef();
  const [wheelAngle, setWheelAngle] = useState(0);
  const [constellationImgError, setConstellationImgError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [userRes, postsRes] = await Promise.all([
          userService.getCurrentUser(),
          userService.getPublicPosts()
        ]);
        setCurrentUser(userRes.data);
        setPublicPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
        // Initialize commentCounts from posts if available
        const counts = {};
        (Array.isArray(postsRes.data) ? postsRes.data : []).forEach(post => {
          counts[post.id] = post.commentCount || 0;
        });
        setCommentCounts(counts);
      } catch (err) {
        setError('Failed to load public posts.');
        console.error('Error fetching public posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePollSelect = (postId, optionIdx) => {
    setSelectedPolls(prev => ({ ...prev, [postId]: optionIdx }));
    // TODO: Optionally send vote to backend here
  };

  const handleToggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentCountChange = (postId, count) => {
    setCommentCounts(prev => ({ ...prev, [postId]: count }));
  };

  // Filter out posts authored by the current user
  const filteredPosts = currentUser
    ? publicPosts.filter(post => post.authorId !== currentUser.id)
    : publicPosts;

  const handleSingleQuizSelect = (optIdx) => {
    const isCorrect = optIdx === QUIZ_QUESTIONS[quizIdx].answer;
    setQuizSelected(optIdx);
    setQuizResult(isCorrect);
    setTimeout(() => {
      setQuizSelected(null);
      setQuizResult(null);
      setQuizIdx((quizIdx + 1) % QUIZ_QUESTIONS.length);
    }, 1500);
  };

  // Constellation game logic
  const handleConstellationGuess = () => {
    if (constellationGuess.trim().toLowerCase() === CONSTELLATIONS[constellationIdx].name.toLowerCase()) {
      setConstellationResult(true);
      setTimeout(() => {
        setConstellationResult(null);
        setConstellationGuess('');
        setConstellationIdx((constellationIdx + 1) % CONSTELLATIONS.length);
      }, 1200);
    } else {
      setConstellationResult(false);
      setTimeout(() => setConstellationResult(null), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-star-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-8">
          {/* Astronomy Quiz - Single Card, Step-by-Step */}
          <div className="bg-space-navy rounded-xl p-6 border border-space-purple shadow-lg flex flex-col items-center w-full max-w-xs mx-auto">
            <div className="mb-2 flex flex-col items-center">
              {PLANET_SVGS[quizIdx % PLANET_SVGS.length]}
            </div>
            <div className="mb-4 text-white font-semibold text-center text-lg" style={{ minHeight: 48 }}>{QUIZ_QUESTIONS[quizIdx].question}</div>
            <div className="flex flex-col gap-3 w-full">
              {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSingleQuizSelect(i)}
                  disabled={quizSelected !== null}
                  className={`w-full px-4 py-2 rounded-full font-bold text-white shadow-lg transition-all duration-200 text-base ${quizSelected === i ? (quizResult ? 'bg-green-600' : 'bg-red-600') : 'bg-space-purple/80 hover:bg-space-purple'} ${quizSelected !== null ? 'opacity-70' : ''}`}
                  style={{ pointerEvents: quizSelected !== null ? 'none' : 'auto' }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizSelected !== null && (
              <div className={`mt-4 text-lg font-bold ${quizResult ? 'text-green-400' : 'text-red-400'}`}>{quizResult ? 'Correct!' : 'Try again!'}</div>
            )}
          </div>
          {/* Upcoming Events - Timeline Style */}
          <div className="bg-space-navy rounded-xl p-6 border border-space-purple shadow-lg">
            <h3 className="text-lg font-bold text-space-purple flex items-center gap-2 mb-3"><FaCalendarAlt /> Upcoming Events</h3>
            <ul className="space-y-4 relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-space-purple to-transparent rounded-full opacity-60" style={{ zIndex: 0 }} />
              {EVENTS.map((ev, idx) => (
                <li key={ev.date} className="flex items-center gap-4 relative z-10">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-space-purple text-white text-xl font-bold border-2 border-yellow-300 shadow-lg">{ev.icon}</span>
                  <div>
                    <div className="font-bold text-space-purple text-base">{ev.name}</div>
                    <div className="text-xs text-gray-400">{ev.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Main Feed */}
        <div className="md:col-span-2">
          <div className="space-y-8">
            {loading && <div className="text-center text-space-purple">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {filteredPosts.map((post, index) => (
              <Post
                key={post.id}
                post={post}
                currentUser={currentUser}
                commentCount={commentCounts[post.id] ?? post.commentCount ?? 0}
                onCommentCountChange={handleCommentCountChange}
                expandedComments={expandedComments}
                onToggleComments={handleToggleComments}
                selectedPoll={selectedPolls[post.id]}
                onPollSelect={handlePollSelect}
              />
            ))}
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-8">
          {/* Cosmic Inspiration Quote Card */}
          <div className="bg-space-navy rounded-xl p-6 border border-space-purple shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-bold text-space-purple flex items-center gap-2 mb-3"><span role="img" aria-label="star">🌟</span> Cosmic Inspiration</h3>
            <QuoteCard />
          </div>
          {/* Featured Users/Clans */}
          <div className="bg-space-navy rounded-xl p-6 border border-space-purple shadow-lg">
            <h3 className="text-lg font-bold text-space-purple flex items-center gap-2 mb-3"><FaUsers /> Featured Astronomers</h3>
            <ul className="space-y-3">
              {FEATURED_USERS.map(u => (
                <li key={u.name} className="flex items-center gap-3">
                  <img src={u.img} alt={u.name} className="w-10 h-10 rounded-full border border-space-purple object-cover" />
                  <div>
                    <div className="font-bold text-space-purple text-sm">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.bio}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore; 