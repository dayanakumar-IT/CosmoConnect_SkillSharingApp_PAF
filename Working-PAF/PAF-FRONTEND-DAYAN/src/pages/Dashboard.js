import React, { useState, useEffect } from 'react';
import { FaUserAstronaut, FaRocket, FaStar, FaCompass, FaChartLine, FaUsers, FaPlus, FaGlobe, FaMoon, FaSatellite, FaSpaceShuttle, FaMeteor, FaAtom, FaCamera, FaEdit, FaSave, FaTimes, FaQuestionCircle, FaMapMarkerAlt, FaVideo, FaTags, FaPoll, FaBookmark, FaEllipsisV, FaTrashAlt, FaLock, FaLockOpen, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../api';
import { authService } from '../api';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { GiBinoculars } from 'react-icons/gi';
import { COLORFUL_CATEGORIES } from '../constants/categories';
import CommentSection from '../components/CommentSection';
import Post from '../components/Post';
import LearningProgressModal from '../components/LearningProgressModal';
import LearningFlipCard from '../components/LearningFlipCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { learningApi } from '../learningApi';
import { userApi } from '../api';

// Helper for time ago
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const POST_CATEGORIES = [
  { id: 'AstroCapture', label: 'AstroCapture', icon: <FaCamera /> },
  { id: 'SkyLog', label: 'SkyLog', icon: <FaStar /> },
  { id: 'SkillTutorial', label: 'SkillTutorial', icon: <FaVideo /> },
  { id: 'LocationSpotting', label: 'Location-based Spotting', icon: <FaMapMarkerAlt /> },
  { id: 'AskCosmos', label: 'Ask Cosmos', icon: <FaQuestionCircle /> },
];
const SKILL_TAGS = [
  'Astrophotography', 'Telescope', 'Deep Sky', 'Planetary', 'Processing', 'Observation', 'DIY', 'Spectroscopy', 'Meteor', 'Comet', 'Variable Star', 'Solar', 'Lunar', 'Equipment', 'Software', 'Outreach', 'Education', 'Other'
];

// Add at the top
const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (path.startsWith('http')) return path;
  // If path already starts with /api, just prepend the host (not /api again)
  if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
  return API_BASE + '/api/posts/files/' + path.replace(/^posts\//, '');
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState('');
  const [hoverCard, setHoverCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [postCategory, setPostCategory] = useState('AstroCapture');
  const [postSkillTags, setPostSkillTags] = useState([]);
  const [postMedia, setPostMedia] = useState([]);
  const [postMediaPreviews, setPostMediaPreviews] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postPoll, setPostPoll] = useState({ question: '', options: [''] });
  const [showPoll, setShowPoll] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [showSkyLogAnim, setShowSkyLogAnim] = useState(false);
  const [showSkillTagModal, setShowSkillTagModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('AstroCapture');
  const [editSkillTags, setEditSkillTags] = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editPostMedia, setEditPostMedia] = useState([]);
  const [editPostMediaPreviews, setEditPostMediaPreviews] = useState([]);
  const [editShowPoll, setEditShowPoll] = useState(false);
  const [editPostPoll, setEditPostPoll] = useState({ question: '', options: [''] });
  const [removedEditMedia, setRemovedEditMedia] = useState([]);
  const [showEditMediaTooltip, setShowEditMediaTooltip] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [editIsPublic, setEditIsPublic] = useState(true);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  // --- Learning Plan State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [learningTopic, setLearningTopic] = useState('');
  const [learningSubject, setLearningSubject] = useState('');
  const [whatDidYouLearn, setWhatDidYouLearn] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [learningIsPublic, setLearningIsPublic] = useState(true);
  const [skills, setSkills] = useState([]);
  const [nextSteps, setNextSteps] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [learningEntries, setLearningEntries] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState({ show: false, id: null });
  const [zoomImg, setZoomImg] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  // Add at the top, after useState imports
  const [expandedPoll, setExpandedPoll] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    // Fetch user info on mount
    const fetchUser = async () => {
      try {
        const res = await userService.getCurrentUser();
        setUser(res.data);
        setUserId(res.data.id);
        setProfilePic(getProfilePicUrl(res.data.imageUrl));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          console.error('Failed to fetch user:', err);
        }
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (activeTab === 'posts' && userId) {
        try {
          const res = await userService.getUserPosts(userId);
          console.log('User posts fetched:', res.data);
          setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error('Error fetching user posts:', err);
          setPosts([]);
        }
      } else if (activeTab === 'progress' || activeTab === 'community') {
        // Optionally fetch other data for these tabs
      }
    };
    fetchPosts();
  }, [activeTab, userId, postSuccess]);

  useEffect(() => {
    setOpenCommentPostId(null);
  }, [location, activeTab]);

  useEffect(() => {
    if (activeTab === 'learning' && userId) {
      setLearningLoading(true);
      setLearningError('');
      learningApi.getByUserId(userId)
        .then(data => {
          if (Array.isArray(data)) {
            setLearningEntries(data);
          } else {
            console.error('Invalid data format received:', data);
            setLearningError('Received invalid data format from server');
          }
        })
        .catch(err => {
          console.error('Error loading learning entries:', err);
          setLearningError(err.message || 'Failed to load learning progress.');
          setLearningEntries([]);
        })
        .finally(() => setLearningLoading(false));
    }
  }, [activeTab, userId]);

  useEffect(() => {
    if (user) {
      userApi.getAll()
        .then(res => setAllUsers(res.data))
        .catch(err => {
          console.error('Error fetching all users:', err);
          setAllUsers([]);
        });
      userApi.getFollowers(user.id)
        .then(res => setFollowers(res.data))
        .catch(err => {
          console.error('Error fetching followers:', err);
          setFollowers([]);
        });
      userApi.getFollowing(user.id)
        .then(res => setFollowing(res.data))
        .catch(err => {
          console.error('Error fetching following:', err);
          setFollowing([]);
        });
    }
  }, [user]);

  // Helper to close menu on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.post-menu')) setMenuOpenIndex(null);
    };
    if (menuOpenIndex !== null) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpenIndex]);

  // Helper to close zoom on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setZoomImg(null);
    };
    if (zoomImg) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [zoomImg]);

  // Internal styles for space effects
  const styles = {
    gradientText: {
      background: 'linear-gradient(45deg, #6200ee, #bb86fc)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing && user) {
      setEditedName(user.fullName || '');
      setEditedSummary(user.biography || '');
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      // Prepare update payload with all required fields
      const updatePayload = {
        fullName: editedName || (user && user.fullName) || '',
        biography: editedSummary || (user && user.biography) || '',
        // Include other fields from the current user to prevent null values
        location: user?.location || '',
        timezone: user?.timezone || '',
        astronomyLevel: user?.astronomyLevel || '',
        astronomyInterests: user?.astronomyInterests || [],
        observationEquipment: user?.observationEquipment || [],
        websiteUrl: user?.websiteUrl || '',
        instagramProfile: user?.instagramProfile || '',
        twitterProfile: user?.twitterProfile || '',
        knownLanguages: user?.knownLanguages || [],
        sharePersonalInfo: user?.sharePersonalInfo || false
      };

      // Only update imageUrl if it's a string (external URL), not a file
      if (profilePicFile && typeof profilePicFile === 'string' && (profilePicFile.startsWith('http://') || profilePicFile.startsWith('https://'))) {
        updatePayload.imageUrl = profilePicFile;
      }

      // First update the profile information
      await userService.updateProfile(userId, updatePayload);

      // Then handle the profile photo if it's a file
      if (profilePicFile && typeof profilePicFile !== 'string') {
        await userService.updateProfilePhoto(userId, profilePicFile);
      }

      // Refetch user info
      const res = await userService.getCurrentUser();
      setUser(res.data);
      setProfilePic(getProfilePicUrl(res.data.imageUrl));
      setProfilePicFile(null);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else if (err.response && err.response.status === 400) {
        const backendMsg = err.response?.data?.message || 'Bad request. Please check your input.';
        setSaveError(backendMsg);
        console.error('400 Bad Request:', err.response);
      } else {
        const backendMsg = err.response?.data?.message || 'Failed to update profile. Please try again.';
        setSaveError(backendMsg);
        console.error('Failed to update profile:', err);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Utility to get correct profile image URL
  function getProfilePicUrl(imageUrl) {
    if (!imageUrl) return undefined;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/${imageUrl}`;
  }

  // Fallback user object for rendering
  const renderUser = user || {
    fullName: 'Astro Explorer',
    imageUrl: '',
    biography: '',
    skills: ['Telescope Operation', 'Astrophotography', 'Star Mapping'],
    progress: 75,
    followers: 128,
    following: 64,
    posts: [
      { id: 1, content: 'Just captured the Orion Nebula! 🌌 #astrophotography', likes: 45 },
      { id: 2, content: 'Learning about variable stars today. Fascinating stuff! ⭐', likes: 32 }
    ]
  };

  // Handle media selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return;
    setPostMedia(files);
    setPostMediaPreviews([]);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      setPostMediaPreviews(prev => [...prev, { url, type: isVideo ? 'video' : 'image' }]);
    });
  };

  // Handle skill tag selection
  const handleSkillTagToggle = (tag) => {
    setPostSkillTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Handle poll option change
  const handlePollOptionChange = (idx, value) => {
    setPostPoll(prev => {
      const options = [...prev.options];
      options[idx] = value;
      return { ...prev, options };
    });
  };
  const addPollOption = () => setPostPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
  const removePollOption = (idx) => setPostPoll(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));

  // Handle post creation
  const handleCreatePost = async () => {
    if (postSkillTags.length === 0) {
      setShowSkillTagModal(true);
      return;
    }
    setPostLoading(true);
    setPostError('');
    setPostSuccess(false);
    try {
      const formData = new FormData();
      const postPayload = {
        title: postContent.substring(0, 100), // Use first 100 chars as title
        content: postContent,
        category: postCategory,
        skillTags: postSkillTags,
        poll: showPoll && postPoll.question.trim() ? postPoll : undefined,
        animationType: postCategory === 'SkyLog' ? 'constellation' : undefined,
        public: isPublic,
        // createdAt and updatedAt will be set by backend
      };
      
      console.log('Creating post with payload:', postPayload);
      formData.append('post', JSON.stringify(postPayload));
      if (postMedia && postMedia.length > 0) {
        postMedia.forEach(file => formData.append('media', file));
      }
      
      const response = await userService.createPostMultipart(formData);
      console.log('Post created successfully:', response.data);
      
      setPostSuccess(true);
      setPostContent('');
      setPostMedia([]);
      setPostMediaPreviews([]);
      setPostSkillTags([]);
      setPostPoll({ question: '', options: [''] });
      setShowPoll(false);
      
      if (postCategory === 'SkyLog') {
        setShowSkyLogAnim(true);
        setTimeout(() => setShowSkyLogAnim(false), 2000);
      }
      
      // Refresh the feed
      const feedResponse = await userService.getFeedPosts();
      console.log('Feed refreshed:', feedResponse.data);
      if (Array.isArray(feedResponse.data)) {
        setPosts(feedResponse.data);
      } else {
        console.error('Feed data is not an array:', feedResponse.data);
      }
      
    } catch (err) {
      console.error('Error creating post:', err);
      const backendMsg = err.response?.data?.message || 'Failed to create post. Please try again.';
      setPostError(backendMsg);
    } finally {
      setPostLoading(false);
    }
  };

  // Delete post handler
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await userService.deletePost(postToDelete.id);
      setPosts(posts => posts.filter(p => p.id !== postToDelete.id));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      setDeleteError('Failed to delete post. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // When opening edit modal, prefill all fields
  const handleEditClick = (post) => {
    setPostToEdit(post);
    setEditContent(post.content || '');
    setEditCategory(post.category || 'AstroCapture');
    setEditSkillTags(post.skillTags || []);
    setEditShowPoll(!!(post.poll && post.poll.question));
    setEditPostPoll(post.poll ? { ...post.poll, options: post.poll.options || [''] } : { question: '', options: [''] });
    setEditPostMedia([]); // For new uploads
    // Use getBackendUrl for correct preview URLs
    setEditPostMediaPreviews(post.mediaUrls ? post.mediaUrls.map(url => getBackendUrl(url)) : []);
    setEditIsPublic(typeof post.isPublic === 'boolean' ? post.isPublic : true);
    setShowEditModal(true);
    setMenuOpenIndex(null);
  };

  // Handle media change in edit modal
  const handleEditMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return;
    setEditPostMedia(files);
    setEditPostMediaPreviews([]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditPostMediaPreviews(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing media preview (for removing old images)
  const handleRemoveEditMediaPreview = (idx) => {
    const url = editPostMediaPreviews[idx];
    // Extract filename from URL (works for both local and remote)
    let fileName = url;
    try {
      fileName = url.split('/').pop().split('?')[0];
    } catch (e) {}
    setRemovedEditMedia(prev => [...prev, fileName]);
    setEditPostMediaPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // Edit poll option change
  const handleEditPollOptionChange = (idx, value) => {
    setEditPostPoll(prev => {
      const options = [...prev.options];
      options[idx] = value;
      return { ...prev, options };
    });
  };
  const addEditPollOption = () => setEditPostPoll(prev => ({ ...prev, options: [...prev.options, ''] }));
  const removeEditPollOption = (idx) => setEditPostPoll(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== idx) }));

  // Update post handler (multipart)
  const handleUpdatePost = async () => {
    if (!postToEdit) return;
    setEditLoading(true);
    setEditError('');
    try {
      const formData = new FormData();
      const updatePayload = {
        content: editContent,
        category: editCategory,
        skillTags: editSkillTags,
        poll: editShowPoll && editPostPoll.question.trim() ? editPostPoll : null,
        animationType: editCategory === 'SkyLog' ? 'constellation' : undefined,
        public: editIsPublic,
        removedMedia: removedEditMedia
      };
      formData.append('post', JSON.stringify(updatePayload));
      if (editPostMedia && editPostMedia.length > 0) {
        editPostMedia.forEach(file => formData.append('media', file));
      }
      await userService.updatePostMultipart(postToEdit.id, formData);
      // Re-fetch posts from backend to ensure latest data
      if (userId) {
        const res = await userService.getUserPosts(userId);
        setPosts(Array.isArray(res.data) ? res.data : []);
      }
      setShowEditModal(false);
      setPostToEdit(null);
      setRemovedEditMedia([]);
    } catch (err) {
      setEditError('Failed to update post. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // --- Learning Plan Handlers & Helpers ---
  const learningTopics = [
    'Telescope Basics',
    'Star Mapping',
    'Deep Space Objects',
    'Astrophotography',
    'Cosmology',
    'Planetary Science'
  ];
  const getSkillsForTopic = (topic) => {
    switch (topic) {
      case 'Telescope Basics':
        return ['Manual Focus', 'Polar Alignment', 'Eyepiece Use', 'Tripod Setup', 'Sky Calibration'];
      default:
        return [];
    }
  };
  const generateWhatDidYouLearn = (subject, topic) => {
    if (subject && topic) {
      return `Explored ${subject} in the context of ${topic}.`;
    }
    return '';
  };
  const generateNextSteps = (topic, hours) => {
    const steps = [];
    if (topic === 'Telescope Basics') {
      steps.push('🔭 Try a 10s long exposure');
      steps.push('🧭 Sketch a nebula');
      steps.push('📷 Capture Saturn\'s rings');
    }
    return steps.join(', ');
  };
  const handleAddSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  const TOASTS = {
    create: '🚀 Log Starred Up!',
    read: '🔭 Viewing Star Log',
    update: '🛠️ Log Polished Up!',
    delete: '☄️ Log Comet Gone!'
  };
  const handleLearningSubmit = async (data) => {
    setLearningLoading(true);
    setLearningError('');
    try {
      const learningData = {
        ...data,
        userId: userId
      };
      
      let entry;
      if (editingEntry && editingEntry.id) {
        entry = await learningApi.update(editingEntry.id, learningData);
        setLearningEntries(entries => entries.map(e => e.id === entry.id ? entry : e));
        toast.success('Learning progress updated successfully! 🚀');
        setIsModalOpen(false);
        setEditingEntry(null);
      } else {
        const created = await learningApi.create(learningData);
        const id = created.id || created._id || created;
        try {
          const newEntry = await learningApi.getById(id);
          setLearningEntries(entries => [...entries, newEntry]);
          toast.success('Learning progress saved successfully! 🚀');
          setIsModalOpen(false);
          setEditingEntry(null);
        } catch (fetchErr) {
          console.error('Error fetching new learning entry:', fetchErr);
          setLearningError('Progress saved, but failed to fetch new entry. Please refresh.');
          toast.error('Progress saved, but failed to fetch new entry. Please refresh.');
        }
      }
    } catch (err) {
      console.error('Error saving learning entry:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.details || 
                         err.message || 
                         'Failed to save learning entry';
      setLearningError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLearningLoading(false);
    }
  };
  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };
  const handleDeleteEntry = async (id) => {
    setLearningLoading(true);
    setLearningError('');
    try {
      await learningApi.delete(id);
      setLearningEntries(entries => entries.filter(e => e.id !== id));
      setDeletePrompt({ show: false, id: null });
    } catch (err) {
      setLearningError('Failed to delete learning entry.');
    } finally {
      setLearningLoading(false);
    }
  };
  // --- End Learning Plan Handlers & Helpers ---

  // Like button handler
  const handleLikeClick = async (post) => {
    const postId = post.id;
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    setLikeCounts(prev => ({ ...prev, [postId]: (prev[postId] || post.likeCount || 0) + (likedPosts[postId] ? -1 : 1) }));
    try {
      if (!likedPosts[postId]) {
        await userService.likePost(postId);
      } else {
        await userService.unlikePost(postId);
      }
    } catch (err) {
      // revert on error
      setLikedPosts(prev => ({ ...prev, [postId]: !!prev[postId] }));
      setLikeCounts(prev => ({ ...prev, [postId]: (post.likeCount || 0) }));
    }
  };

  // Toggle comment section
  const handleToggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Update comment count handler
  const handleCommentCountChange = (postId, count) => {
    setCommentCounts(prev => ({ ...prev, [postId]: count }));
  };

  // Helper to render media (image or video) for posts feed
  const renderPostMedia = (mediaUrl, idx = 0) => {
    if (!mediaUrl) return null;
    const url = getBackendUrl(mediaUrl);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
    if (isVideo) {
      return (
        <video
          key={idx}
          controls
          width="100%"
          className="w-full h-48 object-cover rounded-lg cursor-pointer bg-black"
          onClick={e => { e.stopPropagation(); setZoomImg(url); }}
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        key={idx}
        src={url}
        alt="Post media"
        className="w-full h-48 object-cover rounded-lg cursor-pointer"
        onClick={() => setZoomImg(url)}
      />
    );
  };

  const handleFollow = async (targetId) => {
    await userApi.follow(targetId);
    userApi.getAll().then(res => setAllUsers(res.data));
    userApi.getFollowers(user.id).then(res => setFollowers(res.data));
    userApi.getFollowing(user.id).then(res => setFollowing(res.data));
  };

  const handleUnfollow = async (targetId) => {
    await userApi.unfollow(targetId);
    userApi.getAll().then(res => setAllUsers(res.data));
    userApi.getFollowers(user.id).then(res => setFollowers(res.data));
    userApi.getFollowing(user.id).then(res => setFollowing(res.data));
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
                <div className="relative inline-block">
                  {typeof profilePic === 'string' && profilePic.trim() !== '' ? (
                <img 
                      src={profilePic} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full mx-auto border-2 border-space-purple relative z-10"
                />
                  ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-full mx-auto border-2 border-space-purple bg-space-navy relative z-10">
                      <FaUserAstronaut className="text-6xl text-space-purple" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-space-purple rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-all">
                    <FaCamera className="text-white" />
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
                {isEditing ? (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-gray-800 rounded-lg p-2 text-white border border-space-purple focus:outline-none focus:ring-2 focus:ring-space-purple"
                      placeholder="Your Name"
                    />
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="w-full bg-gray-800 rounded-lg p-2 text-white border border-space-purple focus:outline-none focus:ring-2 focus:ring-space-purple mt-2"
                      placeholder="Your Summary"
                      rows="3"
                    />
                    {saveError && <div className="text-red-400 mt-2 text-sm">{saveError}</div>}
                    {saveSuccess && <div className="text-green-400 mt-2 text-sm">Profile updated successfully!</div>}
                    <div className="flex justify-center space-x-2 mt-2">
                      <button onClick={handleSaveProfile} disabled={saveLoading} className="px-3 py-1 bg-space-purple rounded-lg hover:bg-opacity-90 transition-all flex items-center space-x-1 disabled:opacity-50">
                        <FaSave className="text-sm" />
                        <span>{saveLoading ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button onClick={handleEditToggle} disabled={saveLoading} className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-1">
                        <FaTimes className="text-sm" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-orbitron mt-4" style={styles.gradientText}>{renderUser.fullName}</h2>
                    <p className="text-gray-400 mt-2 text-sm">{renderUser.biography}</p>
                    <button onClick={handleEditToggle} className="mt-2 px-3 py-1 bg-space-purple rounded-lg hover:bg-opacity-90 transition-all flex items-center space-x-1 mx-auto">
                      <FaEdit className="text-sm" />
                      <span>Edit Profile</span>
                    </button>
                  </>
                )}
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Learning Progress</span>
                    <span className="text-sm text-space-purple">{renderUser.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 progress-bar">
                    <div 
                      className="bg-space-purple h-2 rounded-full" 
                      style={{ width: `${renderUser.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-800 hover-card">
                    <div className="text-2xl font-orbitron" style={styles.gradientText}>{followers.length}</div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-800 hover-card">
                    <div className="text-2xl font-orbitron" style={styles.gradientText}>{following.length}</div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-orbitron mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(renderUser.skills || []).map((skill, index) => (
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
              {/* All Users List */}
              <div className="mt-8">
                <h3 className="text-sm font-orbitron mb-2 text-space-purple">Discover Astronomers</h3>
                <div className="max-h-72 overflow-y-auto flex flex-col gap-3 pr-1">
                  {allUsers.filter(u => u.id !== user?.id).map(u => {
                    const isFollowing = following.some(f => f.id === u.id);
                    return (
                      <div key={u.id} className="flex items-center gap-3 bg-gray-800 rounded-lg p-2 hover-card">
                        {u.imageUrl ? (
                          <img src={u.imageUrl.startsWith('http') ? u.imageUrl : `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/${u.imageUrl}`} alt="Profile" className="w-10 h-10 rounded-full border border-space-purple object-cover" />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-space-purple bg-space-navy">
                            <FaUserAstronaut className="text-xl text-space-purple" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-bold text-space-purple text-sm">{u.fullName}</div>
                          <div className="text-xs text-gray-400">{u.biography?.slice(0, 30) || ''}</div>
                        </div>
                        {isFollowing ? (
                          <button onClick={() => handleUnfollow(u.id)} className="px-3 py-1 bg-gray-700 text-white rounded-lg text-xs hover:bg-space-purple transition-all">Unfollow</button>
                        ) : (
                          <button onClick={() => handleFollow(u.id)} className="px-3 py-1 bg-space-purple text-white rounded-lg text-xs hover:bg-purple-700 transition-all">Follow</button>
                        )}
                      </div>
                    );
                  })}
                  {allUsers.filter(u => u.id !== user?.id).length === 0 && (
                    <div className="text-gray-400 text-center text-xs">No other users found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Post Creation */}
            <div className="bg-space-navy rounded-lg p-6 mb-6 border border-space-purple hover-card">
              <div className="flex flex-col space-y-4">
                {/* Category Selection */}
                <div className="flex flex-col items-center mb-4">
                  {/* Show selected category or choose button */}
                  {!showCategoryOptions ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-space-purple text-white font-bold shadow hover:scale-105 transition-all"
                      onClick={() => setShowCategoryOptions(true)}
                    >
                      <FaTags className="text-lg" />
                      {postCategory ? `Category: ${postCategory}` : 'Choose Category'}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-row gap-8 justify-center mt-2 overflow-x-auto pb-2"
                      style={{ scrollbarWidth: 'none' }}
                    >
                      {COLORFUL_CATEGORIES.map((cat, idx) => (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.93 }}
                          whileHover={{ scale: 1.08 }}
                          animate={{ y: [0, -10, 0, 10, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', delay: idx * 0.15, ease: 'easeInOut' }}
                          className={`relative rounded-full flex flex-col items-center justify-center w-28 h-28 shadow-lg font-bold text-xs bg-gradient-to-br from-blue-700 to-purple-700 border-2 border-space-purple transition-all duration-200 ${postCategory === cat.id ? 'ring-4 ring-space-purple' : ''}`}
                          onClick={() => { setPostCategory(cat.id); setShowCategoryOptions(false); }}
                          tabIndex={0}
                          title={cat.fullLabel || cat.label}
                        >
                          <span className="text-4xl mb-2">{cat.icon}</span>
                          <span className="text-xs font-semibold text-white mt-1 text-center px-2 leading-tight break-words" style={{maxWidth: '90px', minHeight: '2.2em', wordBreak: 'break-word', overflowWrap: 'break-word', display: 'block'}}>
                            {cat.label}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {/* Media Upload */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative flex flex-col items-center">
                    <button
                      type="button"
                      className="flex items-center justify-center w-14 h-14 rounded-full bg-space-purple hover:bg-opacity-80 transition-all shadow-lg"
                      onClick={() => document.getElementById('create-media-upload-input').click()}
                      onMouseEnter={() => setShowEditMediaTooltip(true)}
                      onMouseLeave={() => setShowEditMediaTooltip(false)}
                      style={{ position: 'relative' }}
                    >
                      <FaCamera className="text-xl text-white" />
                      {/* Improved Tooltip */}
                      {showEditMediaTooltip && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl shadow-lg z-20 flex flex-col items-center" style={{ minWidth: '160px', fontWeight: 500, lineHeight: 1.4 }}>
                          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}>
                            <svg width="18" height="10" viewBox="0 0 18 10"><polygon points="9,0 18,10 0,10" fill="#18181b" /></svg>
                          </div>
                          Upload up to 3 images<br />or 1 video
                        </div>
                      )}
                    </button>
                    <input
                      id="create-media-upload-input"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </div>
                  {/* Previews */}
                  {postMediaPreviews.length > 0 && (
                    <div className="flex gap-4 mt-4">
                      {postMediaPreviews.map((media, idx) => (
                        <div key={idx} className="relative w-32 h-32 flex items-center justify-center border-2 border-space-purple rounded-lg overflow-hidden bg-black">
                          {media.type === 'video' ? (
                            <video src={media.url} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={media.url} alt="preview" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Content Input */}
                  <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                    placeholder="Share your cosmic discoveries..."
                    className="w-full bg-gray-800 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-space-purple"
                    rows="3"
                  />
                {/* Poll Creation as Floating Bubbles */}
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${showPoll ? 'bg-space-purple text-white' : 'bg-gray-800 text-gray-300'}`}
                    onClick={() => setShowPoll(p => !p)}
                  >
                    <FaPoll />
                    <span>{showPoll ? 'Remove Poll' : 'Add Poll'}</span>
                      </button>
                  {showPoll && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-wrap gap-2 items-center">
                      <input
                        type="text"
                        value={postPoll.question}
                        onChange={e => setPostPoll(p => ({ ...p, question: e.target.value }))}
                        placeholder="Poll question"
                        className="w-full bg-gray-800 rounded-lg p-2 text-white border border-space-purple focus:outline-none focus:ring-2 focus:ring-space-purple mb-2"
                      />
                      {postPoll.options.map((opt, idx) => (
                        <motion.div key={idx} layout initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => handlePollOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="bg-space-purple/80 text-white rounded-full px-4 py-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-space-purple text-center text-sm animate-float"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                          />
                          {postPoll.options.length > 1 && (
                            <button onClick={() => removePollOption(idx)} className="absolute -top-2 -right-2 text-red-400 hover:text-red-600 bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                          )}
                        </motion.div>
                      ))}
                      <button onClick={addPollOption} className="mt-1 px-2 py-1 bg-space-purple rounded-lg text-white text-xs">Add Option</button>
                    </motion.div>
                  )}
                    </div>
                {/* Launch Post Button & Animation */}
                <div className="flex justify-end items-center mt-4">
                  <button
                    onClick={() => setShowSkillTagModal(true)}
                    disabled={postLoading}
                    className="px-6 py-2 bg-space-purple rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:scale-105 flex items-center space-x-2 font-bold text-lg disabled:opacity-50"
                  >
                      <FaRocket className="text-lg animate-bounce" />
                    <span>{postLoading ? 'Launching...' : 'Launch Post'}</span>
                    </button>
                </div>
                {postError && <div className="text-red-400 mt-2 text-sm text-center">{postError}</div>}
                {postSuccess && <div className="text-green-400 mt-2 text-sm text-center">Post created successfully!</div>}
                <AnimatePresence>
                  {showSkyLogAnim && postCategory === 'SkyLog' && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      className="flex justify-center mt-4"
                    >
                      <FaRocket className="text-5xl text-space-purple animate-bounce" />
                      <span className="ml-4 text-2xl font-orbitron text-space-purple animate-pulse">SkyLog Launched!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Skill Tag Modal */}
                <AnimatePresence>
                  {showSkillTagModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                    >
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-space-navy rounded-xl p-8 border-2 border-space-purple shadow-2xl max-w-md w-full">
                        <h2 className="text-xl font-bold text-space-purple mb-4 text-center">Select Skill Tags</h2>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {SKILL_TAGS.map(tag => (
                            <button
                              key={tag}
                              onClick={() => handleSkillTagToggle(tag)}
                              className={`px-3 py-1 rounded-full text-sm font-semibold border transition-all duration-200 ${postSkillTags.includes(tag) ? 'bg-space-purple text-white border-space-purple' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
                            >
                              <FaTags className="inline mr-1" />{tag}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setShowSkillTagModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">Cancel</button>
                          <button onClick={() => { setShowSkillTagModal(false); handleCreatePost(); }} className="px-4 py-2 bg-space-purple rounded-lg text-white font-bold">Confirm & Launch</button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Public Toggle */}
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    className={`rounded-full p-2 border-2 ${isPublic ? 'border-green-400 bg-green-900/30' : 'border-yellow-400 bg-yellow-900/30'} transition-all`}
                    onClick={() => setIsPublic(v => !v)}
                    title={isPublic ? 'Public Post' : 'Private Post'}
                  >
                    {isPublic ? <FaLockOpen className="text-green-400 text-xl" /> : <FaLock className="text-yellow-400 text-xl" />}
                  </button>
                  <span className="text-sm text-gray-300">{isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6">
              {[
                { id: 'posts', icon: <FaStar />, label: 'Posts' },
                { id: 'progress', icon: <FaChartLine />, label: 'Progress' },
                { id: 'community', icon: <FaUsers />, label: 'Community' },
                { id: 'learning', icon: <FaRocket />, label: 'Learning' },
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
              {activeTab === 'posts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post, index) => (
                    <div key={post.id} className="bg-space-navy rounded-lg p-4 border border-space-purple hover-card relative">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-3">
                        {post.authorImageUrl ? (
                          <img
                            src={getProfilePicUrl(post.authorImageUrl)}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border border-space-purple object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-space-purple bg-space-navy">
                            <FaUserAstronaut className="text-xl text-space-purple" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-poppins text-sm font-bold text-space-purple">
                            {post.authorName || 'Astronomy Enthusiast'}
                          </span>
                          <span className="text-xs text-gray-400">Posted {timeAgo(post.createdAt)}</span>
                        </div>
                      </div>

                      {/* Media Display */}
                      {post.mediaUrls && post.mediaUrls.length > 0 && (
                        <div className="mb-3">
                          {post.mediaUrls.length === 1 ? (
                            renderPostMedia(post.mediaUrls[0])
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {post.mediaUrls.slice(0, 4).map((url, idx) => (
                                renderPostMedia(url, idx)
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <p className="text-sm text-gray-200 mb-3 line-clamp-3">{post.content}</p>

                      {/* Category and Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {COLORFUL_CATEGORIES.filter(cat => cat.id === post.category).map(cat => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-space-purple/20 text-space-purple"
                          >
                            <span className="mr-1">{cat.icon}</span>
                            {cat.label}
                          </span>
                        ))}
                        {post.skillTags && post.skillTags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs bg-purple-100/30 text-space-purple"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Poll */}
                      {post.poll && Array.isArray(post.poll.options) && post.poll.options.length > 0 && (
                        <div className="mb-3">
                          <button
                            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-space-purple text-white font-semibold shadow hover:scale-105 transition-all mb-2"
                            onClick={() => setExpandedPoll(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          >
                            <FaPoll className="text-lg" />
                            {expandedPoll[post.id] ? 'Hide Poll' : 'Show Poll'}
                          </button>
                          {expandedPoll[post.id] && (
                            <div className="mt-2 p-4 rounded-2xl border border-purple-200 bg-white/10 backdrop-blur-md shadow">
                              <h4 className="font-semibold text-space-purple mb-3 flex items-center gap-2 text-lg">
                                <FaPoll className="text-xl" /> {post.poll.question}
                              </h4>
                              <form className="flex flex-col gap-3">
                                {post.poll.options.map((option, idx) => (
                                  <label
                                    key={idx}
                                    className="flex items-center gap-3 cursor-pointer bg-purple-50/60 hover:bg-purple-100/80 rounded-lg px-4 py-3 transition-all border border-purple-200 shadow-sm group"
                                    style={{ fontWeight: 500 }}
                                  >
                                    <input
                                      type="radio"
                                      name={`poll-${post.id}`}
                                      className="accent-space-purple scale-125"
                                      // You can add checked/onChange logic here if you want voting
                                    />
                                    <span className="flex-1 text-gray-800 font-medium">{option}</span>
                                  </label>
                                ))}
                              </form>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-space-purple/20">
                        <div className="flex items-center gap-6">
                          <button
                            className="flex flex-col items-center group focus:outline-none"
                            onClick={() => handleLikeClick(post)}
                            aria-label={likedPosts[post.id] ? 'Unlike' : 'Like'}
                            style={{ outline: 'none' }}
                          >
                            <span
                              className={`text-xl transition-all duration-200 ${likedPosts[post.id] ? 'font-bold' : ''}`}
                              style={{
                                color: likedPosts[post.id] ? '#1DA1F2' : '#bbb',
                                filter: likedPosts[post.id] ? 'drop-shadow(0 0 8px #1DA1F2)' : 'none',
                                opacity: likedPosts[post.id] ? 1 : 0.7,
                                transform: likedPosts[post.id] ? 'scale(1.25)' : 'scale(1)',
                                transition: 'color 0.18s, transform 0.18s, opacity 0.18s',
                              }}
                            >
                              👍
                            </span>
                            <span className="text-xs mt-1 font-bold" style={{ color: likedPosts[post.id] ? '#1DA1F2' : '#bbb' }}>{likeCounts[post.id] ?? post.likeCount ?? 0}</span>
                          </button>
                          <button
                            className="flex flex-col items-center group transition-all hover:text-blue-600 focus:outline-none"
                            onClick={() => handleToggleComments(post.id)}
                          >
                            <FaCommentDots className="text-xl group-hover:scale-110 transition-transform" />
                            <span className="text-xs mt-1">{commentCounts[post.id] ?? post.commentCount ?? 0}</span>
                          </button>
                        </div>
                        <div className="relative post-menu">
                          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-space-purple focus:outline-none" onClick={() => setMenuOpenIndex(index)}>
                            <FaEllipsisV />
                          </button>
                          {menuOpenIndex === index && (
                            <div className="absolute right-0 bottom-10 mb-2 w-32 bg-space-navy border border-space-purple rounded-lg shadow-lg z-20 animate-fade-in flex flex-col items-center py-2">
                              <button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white mb-2 transition-all text-xl"
                                title="Edit Post"
                                onClick={() => { setShowEditModal(true); setPostToEdit(post); setEditContent(post.content || ''); setEditCategory(post.category || 'AstroCapture'); setEditSkillTags(post.skillTags || []); setEditShowPoll(!!(post.poll && post.poll.question)); setEditPostPoll(post.poll ? { ...post.poll, options: post.poll.options || [''] } : { question: '', options: [''] }); setEditPostMedia([]); setEditPostMediaPreviews(post.mediaUrls ? post.mediaUrls.map(url => getBackendUrl(url)) : []); setEditIsPublic(typeof post.isPublic === 'boolean' ? post.isPublic : true); setMenuOpenIndex(null); }}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all text-xl"
                                title="Delete Post"
                                onClick={() => { setShowDeleteModal(true); setPostToDelete(post); setMenuOpenIndex(null); }}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Toggleable comment section */}
                      {expandedComments[post.id] && (
                        <div className="mt-4">
                          <CommentSection
                            postId={post.id}
                            expanded={true}
                            onCommentCountChange={count => handleCommentCountChange(post.id, count)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Delete Modal */}
              <AnimatePresence>
                {showDeleteModal && postToDelete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-space-navy rounded-xl p-8 border-2 border-space-purple shadow-2xl max-w-md w-full flex flex-col items-center">
                      <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="mb-4">
                        <FaMeteor className="text-6xl text-space-purple animate-pulse" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-space-purple mb-2 text-center">Delete Post?</h2>
                      <p className="text-gray-300 mb-4 text-center">Are you sure you want to delete this post? This action cannot be undone.</p>
                      {deleteError && <div className="text-red-400 mb-2">{deleteError}</div>}
                      <div className="flex gap-4">
                        <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">Cancel</button>
                        <button onClick={handleDeletePost} disabled={deleteLoading} className="px-4 py-2 bg-red-600 rounded-lg text-white font-bold disabled:opacity-50">
                          {deleteLoading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      { name: 'Deep Space Objects', status: 'Not Started', icon: <FaSatellite /> }
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

              {activeTab === 'learning' && (
                <div className="p-0">
                  <div className="flex items-center justify-between mb-6 px-6 pt-6">
                    <h2 className="text-3xl font-orbitron" style={{
                      background: 'linear-gradient(45deg, #6200ee, #bb86fc)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px rgba(187, 134, 252, 0.3)',
                      letterSpacing: '1px'
                    }}>My Learning Progress</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group relative p-3 bg-space-purple rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(187,134,252,0.5)]"
                      title="Add Learning Progress"
                    >
                      <FaPlus className="text-2xl text-white transform group-hover:rotate-90 transition-transform duration-300" />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Add New Progress
                      </span>
                    </button>
                  </div>
                  <div className="bg-space-navy rounded-lg p-6 border border-space-purple hover-card">
                    {learningLoading && <div className="text-space-purple text-center">Loading...</div>}
                    {learningError && <div className="text-red-400 text-center mb-2">{learningError}</div>}
                    <div className="flex flex-wrap gap-x-8 gap-y-8 justify-center">
                      {learningEntries.map(entry => (
                        <LearningFlipCard
                          key={entry.id}
                          data={entry}
                          onEdit={handleEditEntry}
                          onDelete={() => setDeletePrompt({ show: true, id: entry.id })}
                        />
                      ))}
                    </div>
                  </div>
                  <LearningProgressModal
                    isOpen={isModalOpen}
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingEntry(null);
                    }}
                    onSubmit={handleLearningSubmit}
                    editingEntry={editingEntry}
                  />
                  <ToastContainer />
                  {deletePrompt.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-[#18182a] border-4 border-space-purple rounded-2xl p-10 shadow-2xl flex flex-col items-center animate-pulse" style={{ boxShadow: '0 0 40px 8px #a084f3, 0 0 0 8px #23234d inset' }}>
                        <span className="text-5xl mb-4 animate-bounce">☄️</span>
                        <h3 className="text-2xl font-orbitron text-space-purple mb-2">Cosmic Deletion</h3>
                        <p className="text-lg text-blue-200 mb-6 text-center">Are you sure you want to erase this log from your universe?</p>
                        <div className="flex gap-6 mt-2">
                          <button onClick={() => handleDeleteEntry(deletePrompt.id)} className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg text-lg font-semibold">
                            <span role="img" aria-label="comet">☄️</span> Delete Log
                          </button>
                          <button onClick={() => setDeletePrompt({ show: false, id: null })} className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-space-purple shadow text-lg font-semibold">
                            <span role="img" aria-label="planet">🪐</span> Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Modal */}
              <AnimatePresence>
                {showEditModal && postToEdit && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} 
                      className="bg-space-navy rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-space-purple shadow-2xl max-w-3xl w-full flex flex-col items-center m-4"
                      style={{ maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px 8px rgba(98,0,238,0.15)' }}
                    >
                      <FaEdit className="text-4xl text-space-purple mb-4 animate-pulse" />
                      <h2 className="text-xl font-bold text-space-purple mb-6 text-center">Edit Post</h2>
                      {/* Category Selection */}
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {COLORFUL_CATEGORIES.map(cat => (
                          <motion.button
                            key={cat.id}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            className={`px-4 py-2 rounded-lg flex items-center space-x-2 font-bold transition-all duration-200 ${cat.color} ${editCategory === cat.id ? 'ring-4 ring-space-purple shadow-[0_0_20px_rgba(187,134,252,0.5)] opacity-100 scale-105' : 'opacity-70 hover:opacity-90'}`}
                            onClick={() => setEditCategory(cat.id)}
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span>{cat.label}</span>
                          </motion.button>
                        ))}
                      </div>
                      {/* Media Upload */}
                      <div className="flex flex-col items-center mb-6 w-full">
                        <div className="relative flex flex-col items-center">
                          {/* Upload Icon Button */}
                          <button
                            type="button"
                            className="flex items-center justify-center w-16 h-16 rounded-full bg-space-purple hover:bg-opacity-80 transition-all"
                            onClick={() => document.getElementById('edit-media-upload-input').click()}
                            onMouseEnter={() => setShowEditMediaTooltip(true)}
                            onMouseLeave={() => setShowEditMediaTooltip(false)}
                            style={{ position: 'relative' }}
                          >
                            <FaCamera className="text-2xl text-white" />
                            {/* Tooltip */}
                            {showEditMediaTooltip && (
                              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                                Upload up to 3 images or 1 video
                              </div>
                            )}
                          </button>
                          <input
                            id="edit-media-upload-input"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleEditMediaChange}
                          />
                        </div>
                        {/* Previews */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {editPostMediaPreviews.map((src, idx) => (
                            <div key={idx} className="relative">
                              <img src={src} alt="preview" className="w-20 h-20 object-cover rounded-lg border-2 border-space-purple" />
                              <button
                                onClick={() => handleRemoveEditMediaPreview(idx)}
                                className="absolute -top-2 -right-2 text-red-400 hover:text-red-600 bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Content Input */}
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        placeholder="Share your cosmic discoveries..."
                        className="w-full bg-gray-800 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-space-purple mb-6"
                        rows="3"
                      />
                      {/* Poll Creation as Floating Bubbles */}
                      <div className="flex items-center space-x-2 mb-6 w-full">
                        <button
                          className={`px-3 py-1 rounded-lg flex items-center space-x-1 ${editShowPoll ? 'bg-space-purple text-white' : 'bg-gray-800 text-gray-300'}`}
                          onClick={() => setEditShowPoll(p => !p)}
                        >
                          <FaPoll />
                          <span>{editShowPoll ? 'Remove Poll' : 'Add Poll'}</span>
                        </button>
                        {editShowPoll && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-wrap gap-2 items-center">
                            <input
                              type="text"
                              value={editPostPoll.question}
                              onChange={e => setEditPostPoll(p => ({ ...p, question: e.target.value }))}
                              placeholder="Poll question"
                              className="w-full bg-gray-800 rounded-lg p-2 text-white border border-space-purple focus:outline-none focus:ring-2 focus:ring-space-purple mb-2"
                            />
                            {editPostPoll.options.map((opt, idx) => (
                              <motion.div key={idx} layout initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => handleEditPollOptionChange(idx, e.target.value)}
                                  placeholder={`Option ${idx + 1}`}
                                  className="bg-space-purple/80 text-white rounded-full px-4 py-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-space-purple text-center text-sm animate-float"
                                  style={{ animationDelay: `${idx * 0.1}s` }}
                                />
                                {editPostPoll.options.length > 1 && (
                                  <button onClick={() => removeEditPollOption(idx)} className="absolute -top-2 -right-2 text-red-400 hover:text-red-600 bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
                                )}
                              </motion.div>
                            ))}
                            <button onClick={addEditPollOption} className="mt-1 px-2 py-1 bg-space-purple rounded-lg text-white text-xs">Add Option</button>
                          </motion.div>
                        )}
                      </div>
                      {/* Skill Tag Selection */}
                      <div className="flex flex-wrap gap-2 justify-center mb-6 w-full">
                        {SKILL_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setEditSkillTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                            className={`px-3 py-1 rounded-full text-sm font-semibold border transition-all duration-200 ${editSkillTags.includes(tag) ? 'bg-space-purple text-white border-space-purple' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
                          >
                            <FaTags className="inline mr-1" />{tag}
                          </button>
                        ))}
                      </div>
                      {/* Public Toggle */}
                      <div className="flex items-center gap-3 mb-6">
                        <button
                          type="button"
                          className={`rounded-full p-2 border-2 ${editIsPublic ? 'border-green-400 bg-green-900/30' : 'border-yellow-400 bg-yellow-900/30'} transition-all`}
                          onClick={() => setEditIsPublic(v => !v)}
                          title={editIsPublic ? 'Public Post' : 'Private Post'}
                        >
                          {editIsPublic ? <FaLockOpen className="text-green-400 text-xl" /> : <FaLock className="text-yellow-400 text-xl" />}
                        </button>
                        <span className="text-sm text-gray-300">{editIsPublic ? 'Public' : 'Private'}</span>
                      </div>
                      {editError && <div className="text-red-400 mb-2">{editError}</div>}
                      <div className="flex gap-4 mt-2">
                        <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-700 rounded-lg text-white">Cancel</button>
                        <button onClick={handleUpdatePost} disabled={editLoading} className="px-4 py-2 bg-space-purple rounded-lg text-white font-bold disabled:opacity-50">
                          {editLoading ? 'Updating...' : 'Update'}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Zoom Modal */}
              {zoomImg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setZoomImg(null)}>
                  <img src={zoomImg} alt="Zoomed" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-space-navy" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Explore() {
  const [publicPosts, setPublicPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authService.getCurrentUser && authService.getCurrentUser();

  useEffect(() => {
    async function fetchPublicPosts() {
      setLoading(true);
      setError('');
      try {
        const res = await userService.getFeedPosts();
        setPublicPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load public posts.');
      } finally {
        setLoading(false);
      }
    }
    fetchPublicPosts();
  }, []);

  return (
    <div className="min-h-screen bg-space-dark text-star-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-space-purple">Explore Public Posts</h1>
        {loading && <div className="text-center text-space-purple">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="space-y-8">
          {publicPosts.map((post, index) => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUser}
              commentCount={post.commentCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 