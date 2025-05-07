import React, { useState } from 'react';
import { FaRegCommentDots, FaShare, FaEllipsisH, FaBookmark, FaRegBookmark, FaUserPlus, FaCalendarAlt } from 'react-icons/fa';

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
];

const spaceEvents = [
  { date: 'Jul 21', title: 'Delta Aquariids Meteor Shower', desc: 'Peak viewing for this annual meteor shower.' },
  { date: 'Aug 12', title: 'Perseid Meteor Shower', desc: 'One of the best meteor showers of the year.' },
  { date: 'Sep 18', title: 'Neptune at Opposition', desc: 'Neptune is closest to Earth and fully illuminated.' },
];

const Explore = () => {
  const [reactions, setReactions] = useState(posts.map(() => null));
  const [showPicker, setShowPicker] = useState(posts.map(() => false));
  const [saved, setSaved] = useState(posts.map(() => false));
  const [followed, setFollowed] = useState(suggestedUsers.map(() => false));

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

  return (
    <div className="min-h-screen bg-space-dark pt-20 pb-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
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
            {spaceEvents.map(event => (
              <div key={event.title} className="flex items-start mb-4 last:mb-0">
                <div className="flex flex-col items-center mr-3">
                  <span className="bg-space-purple text-white rounded-full px-3 py-1 text-xs font-bold mb-1">{event.date}</span>
                  <FaCalendarAlt className="text-space-purple text-lg" />
                </div>
                <div>
                  <div className="text-white font-semibold">{event.title}</div>
                  <div className="text-xs text-gray-400">{event.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.2s ease; }
      `}</style>
    </div>
  );
};

export default Explore; 