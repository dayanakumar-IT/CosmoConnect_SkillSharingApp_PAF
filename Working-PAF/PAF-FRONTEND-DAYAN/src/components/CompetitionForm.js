import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { competitionApi } from '../api/competitionApi';
import { useAuth } from '../contexts/AuthContext';
import { FaUpload, FaSpinner, FaTimes, FaFileAlt, FaTrophy, FaRocket } from 'react-icons/fa';

const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  return path && path.startsWith('http') ? path : (path ? API_BASE + path : '');
};

const CompetitionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@gmail.com';

  const [formData, setFormData] = useState({
    competitionTitle: '',
    competitionCategory: '',
    competitionType: '',
    maxTeamSize: 1,
    competitionDescription: '',
    problemStatement: '',
    startDate: '',
    submissionDeadline: '',
    competitionStatus: 'ACTIVE',
    countdownTimerEnabled: true,
    competitionBanner: null,
    competitionInstructions: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewInstructions, setPreviewInstructions] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/competitions');
      return;
    }

    if (id) {
      fetchCompetition();
    }
  }, [id, isAdmin]);

  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const response = await competitionApi.getById(id);
      const data = response.data;
      setFormData({
        ...data,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        submissionDeadline: new Date(data.submissionDeadline).toISOString().split('T')[0]
      });
      if (data.competitionBanner) {
        setPreviewBanner(data.competitionBanner);
      }
      if (data.competition_instructions) {
        setPreviewInstructions(data.competition_instructions);
      }
    } catch (err) {
      setError('Failed to fetch competition details');
      console.error('Error fetching competition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      if (name === 'competitionBanner') {
        setPreviewBanner(URL.createObjectURL(files[0]));
      }
      if (name === 'competitionInstructions') {
        setPreviewInstructions(URL.createObjectURL(files[0]));
      }
    }
  };

  const removeFile = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
    if (field === 'competitionBanner') {
      setPreviewBanner(null);
    }
    if (field === 'competitionInstructions') {
      setPreviewInstructions(null);
    }
  };

  const validateForm = () => {
    if (!formData.competitionTitle) {
      setError('Competition title is required');
      return false;
    }
    if (!formData.competitionCategory) {
      setError('Category is required');
      return false;
    }
    if (!formData.competitionType) {
      setError('Type is required');
      return false;
    }
    if (formData.maxTeamSize < 1) {
      setError('Max team size must be at least 1');
      return false;
    }
    if (!formData.competitionDescription) {
      setError('Description is required');
      return false;
    }
    if (!formData.problemStatement) {
      setError('Problem statement is required');
      return false;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!formData.submissionDeadline) {
      setError('Submission deadline is required');
      return false;
    }
    if (new Date(formData.submissionDeadline) <= new Date(formData.startDate)) {
      setError('Submission deadline must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      
      // Add all text fields
      formDataToSend.append('competitionTitle', formData.competitionTitle);
      formDataToSend.append('competitionCategory', formData.competitionCategory);
      formDataToSend.append('competitionType', formData.competitionType);
      formDataToSend.append('maxTeamSize', formData.maxTeamSize);
      formDataToSend.append('competitionDescription', formData.competitionDescription);
      formDataToSend.append('problemStatement', formData.problemStatement);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('submissionDeadline', formData.submissionDeadline);
      formDataToSend.append('competitionStatus', formData.competitionStatus);
      formDataToSend.append('countdownTimerEnabled', formData.countdownTimerEnabled);

      // Add files if they exist
      if (formData.competitionBanner) {
        formDataToSend.append('competitionBanner', formData.competitionBanner);
      }
      if (formData.competitionInstructions) {
        formDataToSend.append('competitionInstructions', formData.competitionInstructions);
      }

      console.log('Sending form data:', Object.fromEntries(formDataToSend));

      if (id) {
        await competitionApi.update(id, formDataToSend);
      } else {
        await competitionApi.create(formDataToSend);
      }

      navigate('/competitions');
    } catch (err) {
      console.error('Error saving competition:', err);
      setError(err.response?.data?.message || 'Failed to save competition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading && id) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 rounded-3xl shadow-2xl border border-purple-700/40 backdrop-blur-md">
      <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
        <FaTrophy className="text-yellow-400 animate-bounce" />
        {id ? 'Edit Competition' : 'Create New Competition'}
      </h2>
      <p className="text-purple-200 mb-6 text-lg">Host a cosmic challenge! Fill in the details below to launch your competition.</p>

      {error && (
        <div className="bg-red-900/80 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <FaTimes className="text-red-300" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <FaRocket className="text-purple-400" /> Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Competition Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                name="competitionTitle"
                value={formData.competitionTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
                placeholder="e.g. Cosmic Quiz Bowl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Category <span className="text-red-400">*</span></label>
              <select
                name="competitionCategory"
                value={formData.competitionCategory}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
              >
                <option value="">Select Category</option>
                <option value="Astronomy">Astronomy</option>
                <option value="Astrophysics">Astrophysics</option>
                <option value="Space Technology">Space Technology</option>
                <option value="Rocket Science">Rocket Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Type <span className="text-red-400">*</span></label>
              <select
                name="competitionType"
                value={formData.competitionType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Max Team Size <span className="text-red-400">*</span></label>
              <input
                type="number"
                name="maxTeamSize"
                value={formData.maxTeamSize}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Start Date <span className="text-red-400">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Submission Deadline <span className="text-red-400">*</span></label>
              <input
                type="date"
                name="submissionDeadline"
                value={formData.submissionDeadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <FaFileAlt className="text-purple-400" /> Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Description <span className="text-red-400">*</span></label>
              <textarea
                name="competitionDescription"
                value={formData.competitionDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
                placeholder="Describe the competition..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Problem Statement <span className="text-red-400">*</span></label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
                placeholder="State the main challenge or problem..."
              />
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div>
          <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <FaUpload className="text-purple-400" /> Media & Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Competition Banner</label>
              <div className="flex flex-col items-center gap-2 border-2 border-dashed border-purple-500 rounded-xl p-4 bg-[#23234b]/60 hover:bg-[#23234b]/80 transition-colors duration-200">
                <label className="w-full flex flex-col items-center cursor-pointer">
                  <FaUpload className="text-2xl text-purple-400 mb-2" />
                  <span className="text-purple-300">{formData.competitionBanner ? 'Change Banner' : 'Upload Banner'}</span>
                  <input
                    type="file"
                    name="competitionBanner"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {previewBanner && (
                  <div className="relative mt-2">
                    <img
                      src={previewBanner.startsWith('blob:') ? previewBanner : getBackendUrl(previewBanner)}
                      alt="Banner preview"
                      className="h-28 w-44 object-cover rounded-lg shadow-lg border-2 border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('competitionBanner')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Competition Instructions (PDF)</label>
              <div className="flex flex-col items-center gap-2 border-2 border-dashed border-purple-500 rounded-xl p-4 bg-[#23234b]/60 hover:bg-[#23234b]/80 transition-colors duration-200">
                <label className="w-full flex flex-col items-center cursor-pointer">
                  <FaUpload className="text-2xl text-purple-400 mb-2" />
                  <span className="text-purple-300">{formData.competitionInstructions ? 'Change Instructions' : 'Upload Instructions'}</span>
                  <input
                    type="file"
                    name="competitionInstructions"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
                {previewInstructions && (
                  <div className="relative mt-2">
                    <div className="h-28 w-24 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-purple-500">
                      <FaFileAlt className="text-4xl text-purple-300" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('competitionInstructions')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Options Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Status</label>
            <select
              name="competitionStatus"
              value={formData.competitionStatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#23234b] text-white rounded-xl border border-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-8 md:mt-0">
            <input
              type="checkbox"
              name="countdownTimerEnabled"
              checked={formData.countdownTimerEnabled}
              onChange={handleChange}
              className="w-5 h-5 text-purple-600 bg-[#23234b] border-purple-700 rounded focus:ring-purple-500"
            />
            <label className="text-md font-medium text-purple-200">
              Enable Countdown Timer
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/competitions')}
            className="px-6 py-2 text-purple-300 hover:text-white border border-purple-500 rounded-lg transition-all duration-200 shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {id ? 'Update Competition' : 'Create Competition'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompetitionForm; 