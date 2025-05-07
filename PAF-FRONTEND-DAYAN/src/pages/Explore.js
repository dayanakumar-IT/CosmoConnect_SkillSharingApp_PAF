import React, { useState } from 'react';
import { FaRegThumbsUp, FaRegCommentDots, FaShare, FaEllipsisH } from 'react-icons/fa';

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

const Explore = () => {
  const [likeCounts, setLikeCounts] = useState(posts.map(p => p.likes));

  const handleLike = idx => {
    const newLikes = [...likeCounts];
    newLikes[idx] = newLikes[idx] + 1;
    setLikeCounts(newLikes);
  };

  return (
    <div className="min-h-screen bg-space-dark pt-20 pb-10">
      <div className="max-w-xl mx-auto space-y-8">
        {posts.map((post, idx) => (
          <div key={post.id} className="bg-space-navy rounded-xl shadow-lg border border-space-purple overflow-hidden relative">
            <div className="flex items-center px-4 pt-4 pb-2">
              <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3 border-2 border-space-purple" />
              <div className="flex-1">
                <span className="font-orbitron text-space-purple block">{post.user.name}</span>
                <span className="text-xs text-gray-400">{post.time} ago</span>
              </div>
              <button className="text-gray-400 hover:text-space-purple p-2 rounded-full">
                <FaEllipsisH />
              </button>
            </div>
            <img src={post.image} alt="space" className="w-full object-cover max-h-96" />
            <div className="p-4">
              <p className="mb-2 text-white">{post.desc}</p>
              <div className="flex items-center space-x-8 mt-4">
                <button onClick={() => handleLike(idx)} className="flex items-center text-gray-300 hover:text-blue-400">
                  <FaRegThumbsUp className="mr-2" />
                  <span>{likeCounts[idx]}</span>
                </button>
                <div className="flex items-center text-gray-300">
                  <FaRegCommentDots className="mr-2" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <FaShare className="mr-2" />
                  <span>{post.shares}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore; 