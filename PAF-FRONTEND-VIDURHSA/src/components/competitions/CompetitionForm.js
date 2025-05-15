import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompetitionForm = ({ competition, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(competition || {
    competitionTitle: '',
    competitionCategory: '',
    competitionType: 'Individual',
    maxTeamSize: '',
    competitionDescription: '',
    problemStatement: '',
    startDate: '',
    submissionDeadline: '',
    competitionStatus: 'Upcoming',
    countdownTimerEnabled: true,
    competitionBanner: null,
    competitionInstructions: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    navigate('/admin/competitions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-400">
          {competition ? 'Edit Competition' : 'Add New Competition'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Title</label>
              <input
                type="text"
                name="competitionTitle"
                value={formData.competitionTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Category</label>
              <input
                type="text"
                name="competitionCategory"
                value={formData.competitionCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Type</label>
              <select
                name="competitionType"
                value={formData.competitionType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Group">Group</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
            {formData.competitionType === 'Group' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Team Size</label>
                <input
                  type="number"
                  name="maxTeamSize"
                  value={formData.maxTeamSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Description</label>
              <textarea
                name="competitionDescription"
                value={formData.competitionDescription}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Problem Statement</label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Submission Deadline</label>
              <input
                type="datetime-local"
                name="submissionDeadline"
                value={formData.submissionDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Status</label>
              <select
                name="competitionStatus"
                value={formData.competitionStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="countdownTimerEnabled"
                checked={formData.countdownTimerEnabled}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-300">Enable Countdown Timer</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Banner (Image)</label>
              <input
                type="file"
                name="competitionBanner"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Competition Instructions (PDF)</label>
              <input
                type="file"
                name="competitionInstructions"
                accept="application/pdf"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin/competitions')}
              className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              {competition ? 'Update Competition' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitionForm; 