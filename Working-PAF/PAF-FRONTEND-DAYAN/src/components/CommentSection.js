import React, { useEffect, useState } from 'react';
import { commentService, userService } from '../api';
import { FaUserAstronaut, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './CommentSection.css';

function getProfilePicUrl(imageUrl) {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  return `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/${imageUrl}`;
}

const CommentSection = ({ postId, expanded = true, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Notify parent of comment count changes
  useEffect(() => {
    if (typeof onCommentCountChange === 'function') {
      onCommentCountChange(comments.length);
    }
  }, [comments, onCommentCountChange]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [userRes, commentsRes] = await Promise.all([
          userService.getCurrentUser(),
          commentService.getComments(postId)
        ]);
        setCurrentUser(userRes.data);
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      } catch (err) {
        setError('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    }
    if (expanded) fetchData();
  }, [postId, expanded]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setActionLoading(true);
    try {
      await commentService.addComment(postId, newComment);
      setNewComment('');
      // Refresh comments
      const commentsRes = await commentService.getComments(postId);
      setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (err) {
      setError('Failed to add comment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) return;
    setActionLoading(true);
    try {
      await commentService.editComment(commentId, editContent);
      setEditId(null);
      setEditContent('');
      // Refresh comments
      const commentsRes = await commentService.getComments(postId);
      setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (err) {
      setError('Failed to update comment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setActionLoading(true);
    try {
      await commentService.deleteComment(commentId);
      // Refresh comments
      const commentsRes = await commentService.getComments(postId);
      setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (err) {
      setError('Failed to delete comment.');
    } finally {
      setActionLoading(false);
    }
  };

  // Optimistic like/unlike handler
  const handleLikeToggle = async (commentId, isLiked) => {
    // Optimistically update UI
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !isLiked,
              likeCount: comment.likeCount + (isLiked ? -1 : 1),
            }
          : comment
      )
    );
    try {
      if (isLiked) {
        await commentService.unlikeComment(commentId);
      } else {
        await commentService.likeComment(commentId);
      }
      // Optionally, you can refresh comments from backend here if you want to ensure consistency
      // const commentsRes = await commentService.getComments(postId);
      // setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
    } catch (err) {
      // Revert UI if error
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: isLiked,
                likeCount: comment.likeCount + (isLiked ? 1 : -1),
              }
            : comment
        )
      );
    }
  };

  if (!expanded) return null;

  return (
    <div className="mt-6 bg-gray-900 bg-opacity-80 rounded-xl p-4 border border-space-purple relative">
      <h4 className="text-space-purple font-bold mb-2">Comments</h4>
      {loading ? (
        <div className="text-space-purple">Loading comments...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="space-y-4 pb-20">
          {comments.length === 0 && <div className="text-gray-400">No comments yet.</div>}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col group bg-gray-800/80 hover:bg-gray-700/90 hover:shadow-glow rounded-2xl p-4 transition-all duration-200"
              style={{ boxShadow: '0 2px 12px 0 rgba(123,44,191,0.08)' }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {comment.authorImageUrl ? (
                  <img
                    src={getProfilePicUrl(comment.authorImageUrl)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-space-purple object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border border-space-purple bg-space-navy">
                    <FaUserAstronaut className="text-lg text-space-purple" />
                  </div>
                )}
                {/* Username, handle, timestamp */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        comment.authorName?.startsWith('@')
                          ? 'font-poppins font-medium text-base text-white mb-1'
                          : 'font-bold font-poppins text-base bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-1'
                      }
                    >
                      {comment.authorName}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(comment.createdAt)}</span>
                </div>
              </div>
              {/* Main comment text */}
              <div className="w-full text-left mt-2 mb-2">
                {editId === comment.id ? (
                  <div className="flex items-center gap-2 justify-center">
                    <input
                      type="text"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="flex-1 bg-gray-700 rounded p-1 text-white border border-space-purple focus:ring-2 focus:ring-space-purple focus:border-space-purple outline-none"
                      disabled={actionLoading}
                    />
                    <button onClick={() => handleSaveEdit(comment.id)} disabled={actionLoading} className="text-green-400 hover:text-green-600"><FaSave /></button>
                    <button onClick={() => setEditId(null)} disabled={actionLoading} className="text-red-400 hover:text-red-600"><FaTimes /></button>
                  </div>
                ) : (
                  <div className="text-gray-200 text-base font-poppins" style={{wordBreak: 'break-word'}}>{comment.content}</div>
                )}
                {/* Heart icon and like count under comment text */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className={`focus:outline-none transition-all duration-200 heart-btn ${comment.isLiked ? 'liked' : ''}`}
                    title={comment.isLiked ? 'Unlike' : 'Like'}
                    style={{ outline: 'none' }}
                    onClick={() => {
                      if (!currentUser) return;
                      handleLikeToggle(comment.id, comment.isLiked);
                    }}
                  >
                    {comment.isLiked ? (
                      <AiFillHeart className="text-2xl heart-filled" style={{ color: '#FF4C4C', filter: 'drop-shadow(0 0 8px #FF4C4C)' }} />
                    ) : (
                      <AiOutlineHeart className="text-2xl" style={{ color: '#bbb' }} />
                    )}
                  </button>
                  <span className="text-xs font-bold" style={{ color: comment.isLiked ? '#FF4C4C' : '#bbb' }}>{comment.likeCount || 0}</span>
                </div>
              </div>
              {/* Footer row: Edit/Delete icons */}
              {currentUser && comment.authorId === currentUser.id && editId !== comment.id && (
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => handleEditComment(comment)} className="text-blue-400 hover:text-blue-600 text-base flex items-center gap-1" title="Edit"><span role="img" aria-label="edit">✏️</span></button>
                  <button onClick={() => handleDeleteComment(comment.id)} className="text-red-400 hover:text-red-600 text-base flex items-center gap-1" title="Delete"><span role="img" aria-label="delete">🗑️</span></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Add new comment - fixed input at bottom */}
      {currentUser && (
        <div className="fixed left-0 right-0 bottom-0 z-20 px-6 pb-6" style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <div className="flex items-center gap-2 bg-gray-900 bg-opacity-90 rounded-full border-2 border-space-purple shadow-lg px-4 py-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-transparent rounded-full px-4 py-2 text-white border-none focus:outline-none focus:ring-2 focus:ring-space-purple focus:shadow-glow transition-all text-base font-poppins"
              disabled={actionLoading}
              onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
              style={{ boxShadow: 'none' }}
            />
            <button
              onClick={handleAddComment}
              disabled={actionLoading || !newComment.trim()}
              className="px-5 py-2 bg-gradient-to-r from-space-purple to-pink-500 rounded-full text-white font-bold font-poppins shadow-lg hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-base disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for time ago
function formatTimeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default CommentSection; 