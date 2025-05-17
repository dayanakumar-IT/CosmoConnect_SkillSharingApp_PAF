import React, { useState } from 'react';
import { FaUserAstronaut, FaPoll, FaCommentDots, FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { COLORFUL_CATEGORIES } from '../constants/categories';
import CommentSection from './CommentSection';
import { userService } from '../api';

function getProfilePicUrl(imageUrl) {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/${imageUrl}`;
}

const pollIcons = ['🧠', '🚀', '🌟', '🔭', '🌌', '🪐', '🌙', '☄️'];

const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
  return API_BASE + '/api/posts/files/' + path.replace(/^posts\//, '');
};

const Post = ({
  post,
  currentUser,
  commentCount,
  onCommentCountChange,
  expandedComments,
  onToggleComments,
  selectedPoll,
  onPollSelect,
  onLikeChange,
}) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiked, setIsLiked] = useState(
    currentUser && post.likedBy && Array.isArray(post.likedBy)
      ? post.likedBy.includes(currentUser.id || currentUser._id || currentUser.email)
      : false
  );
  const [likeAnimating, setLikeAnimating] = useState(false);

  // Helper for time ago
  function timeAgo(date) {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Glassmorphism style
  const glass = 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg';

  // Like button handler
  const handleLikeClick = async () => {
    if (!currentUser) return;
    setLikeAnimating(true);
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      try {
        await userService.likePost(post.id);
        if (onLikeChange) onLikeChange(post.id, true);
      } catch (err) {
        setIsLiked(false);
        setLikeCount(likeCount);
      }
    } else {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
      try {
        await userService.unlikePost(post.id);
        if (onLikeChange) onLikeChange(post.id, false);
      } catch (err) {
        setIsLiked(true);
        setLikeCount(likeCount);
      }
    }
    setTimeout(() => setLikeAnimating(false), 350);
  };

  // Helper to render media (image or video)
  const renderMedia = (mediaUrl, idx = 0) => {
    if (!mediaUrl) return null;
    const url = getBackendUrl(mediaUrl);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
    if (isVideo) {
      return (
        <video
          key={idx}
          controls
          width="100%"
          className="w-full h-[350px] md:h-[420px] object-cover rounded-2xl shadow-2xl border-4 border-space-navy bg-black"
          style={{ boxShadow: '0 0 40px 8px rgba(123,44,191,0.18)' }}
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      );
    }
    // Default to image
    return (
      <img
        key={idx}
        src={url}
        alt="Post media"
        className="w-full h-[350px] md:h-[420px] object-cover rounded-2xl shadow-2xl border-4 border-space-navy group-hover:scale-105 group-hover:shadow-glow transition-all duration-300"
        style={{ boxShadow: '0 0 40px 8px rgba(123,44,191,0.18)' }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl p-0 md:p-0 overflow-hidden ${glass} mb-8`}
      style={{ boxShadow: '0 8px 40px 8px rgba(98,0,238,0.15)' }}
    >
      {/* User Info Section */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-2">
        {post.authorImageUrl ? (
          <img
            src={getProfilePicUrl(post.authorImageUrl)}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-space-purple object-cover shadow-lg"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-space-purple bg-space-navy">
            <FaUserAstronaut className="text-3xl text-space-purple" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-poppins text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            {post.authorName || 'Astronomy Enthusiast'}
          </span>
          <span
            className={
              (post.authorUsername || (post.authorName || 'user').toLowerCase().replace(/\s+/g, '')).startsWith('@')
                ? 'text-white font-medium text-base mt-1 mb-1'
                : 'text-space-purple/80 font-semibold text-base mt-1 mb-1'
            }
            style={{letterSpacing: '0.01em'}}
          >
            @{post.authorUsername || (post.authorName || 'user').toLowerCase().replace(/\s+/g, '')}
          </span>
          <span className="text-xs text-gray-400 mt-1">Posted {timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-3 px-6 pt-2 pb-2">
        {COLORFUL_CATEGORIES.filter(cat => cat.id === post.category).map(cat => (
          <span
            key={cat.id}
            className="inline-flex items-center px-4 py-1 rounded-full text-sm font-bold shadow border border-space-purple glass-tag"
            style={{
              background: 'linear-gradient(90deg, rgba(98,0,238,0.18) 0%, rgba(187,134,252,0.18) 100%)',
              boxShadow: '0 0 12px 2px rgba(123,44,191,0.18)',
              color: '#a78bfa',
              border: '1.5px solid #7c3aed',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span className="mr-2 text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
          </span>
        ))}
        {post.skillTags && post.skillTags.length > 0 && post.skillTags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-purple-300 shadow-sm bg-purple-100/30 text-space-purple glass-tag"
            style={{
              background: 'linear-gradient(90deg, rgba(187,134,252,0.10) 0%, rgba(98,0,238,0.10) 100%)',
              border: '1.5px solid #a78bfa',
              color: '#a78bfa',
              backdropFilter: 'blur(4px)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Image/Video Display */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="w-full flex justify-center items-center px-0 md:px-6 py-4">
          {post.mediaUrls.length === 1 ? (
            <div className="relative w-full max-w-2xl cursor-pointer group" onClick={() => { setShowLightbox(true); setLightboxImg(post.mediaUrls[0]); }}>
              {renderMedia(post.mediaUrls[0])}
              <div className="absolute inset-0 rounded-2xl group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-2xl font-bold bg-black/60 px-6 py-2 rounded-full">Zoom</span>
              </div>
            </div>
          ) : (
            <div className={`grid gap-3 ${post.mediaUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} w-full max-w-2xl`}>
              {post.mediaUrls.map((url, idx) => (
                <div key={idx} className="relative cursor-pointer group" onClick={() => { setShowLightbox(true); setLightboxImg(url); }}>
                  {renderMedia(url, idx)}
                  <div className="absolute inset-0 rounded-2xl group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white text-lg font-bold bg-black/60 px-4 py-1 rounded-full">Zoom</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Lightbox */}
          {showLightbox && lightboxImg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setShowLightbox(false)}>
              <img src={getBackendUrl(lightboxImg)} alt="Zoomed" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-space-navy" />
            </div>
          )}
        </div>
      )}

      {/* Post Content */}
      <div className="px-6 pb-2">
        <p className="text-lg text-gray-200 font-poppins mb-2" style={{wordBreak: 'break-word'}}>{post.content}</p>
      </div>

      {/* Poll Section */}
      {post.poll && Array.isArray(post.poll.options) && post.poll.options.length > 0 && (
        <div className="px-6 pb-4">
          <div className="mt-2 p-5 rounded-2xl border border-purple-200 bg-white/10 backdrop-blur-md shadow" style={{boxShadow: '0 0 24px 2px rgba(123,44,191,0.10)'}}>
            <h4 className="font-semibold text-space-purple mb-3 flex items-center gap-2 text-lg"><FaPoll className="text-xl" /> {post.poll.question}</h4>
            <form className="flex flex-col gap-3">
              {post.poll.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center gap-3 cursor-pointer bg-purple-50/60 hover:bg-purple-100/80 rounded-lg px-4 py-3 transition-all border border-purple-200 shadow-sm group ${selectedPoll === idx ? 'ring-2 ring-space-purple' : ''}`}
                  style={{ fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500 }}
                >
                  <span className="text-xl mr-2">{pollIcons[idx % pollIcons.length]}</span>
                  <input
                    type="radio"
                    name={`poll-${post.id}`}
                    className="accent-space-purple scale-125"
                    checked={selectedPoll === idx}
                    onChange={() => onPollSelect && onPollSelect(post.id, idx)}
                  />
                  <span className="flex-1 text-gray-800 font-medium">{option}</span>
                </label>
              ))}
              <button type="button" className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-space-purple to-blue-500 text-white font-bold shadow hover:bg-purple-700 transition-all text-lg">Vote</button>
            </form>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-10 px-6 pb-6 pt-2">
        {/* Like Button (Emoji style) */}
        <button
          className="flex flex-col items-center group focus:outline-none"
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          style={{ outline: 'none' }}
        >
          <span
            className={`text-2xl transition-all duration-200 ${isLiked ? 'font-bold' : ''}`}
            style={{
              color: isLiked ? '#1DA1F2' : '#bbb',
              filter: isLiked ? 'drop-shadow(0 0 8px #1DA1F2)' : 'none',
              opacity: isLiked ? 1 : 0.7,
              transform: likeAnimating ? 'scale(1.25)' : 'scale(1)',
              transition: 'color 0.18s, transform 0.18s, opacity 0.18s',
            }}
          >
            👍
          </span>
          <span className="text-xs mt-1 font-bold" style={{ color: isLiked ? '#1DA1F2' : '#bbb' }}>{likeCount}</span>
        </button>
        <button
          className="flex flex-col items-center group transition-all hover:text-blue-600 focus:outline-none"
          onClick={() => onToggleComments && onToggleComments(post.id)}
        >
          <FaCommentDots className="text-2xl group-hover:scale-110 transition-transform" />
          <span className="text-xs mt-1">{commentCount ?? post.commentCount ?? 0}</span>
        </button>
        <button className="flex flex-col items-center group transition-all hover:text-yellow-600 focus:outline-none">
          <FaBookmark className="text-2xl group-hover:scale-110 transition-transform" />
          <span className="text-xs mt-1">Save</span>
        </button>
      </div>

      {/* Toggleable comment section */}
      {expandedComments && expandedComments[post.id] && (
        <CommentSection
          postId={post.id}
          expanded={true}
          onCommentCountChange={count => onCommentCountChange && onCommentCountChange(post.id, count)}
        />
      )}
    </motion.div>
  );
};

export default Post; 