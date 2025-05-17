import React, { useState, useEffect } from 'react';

const certificateTemplates = [
  "Space Exploration Fundamentals Certificate",
  "Cosmology Studies Certificate",
  "Stellar Physics Specialist",
  "Astronomy Fundamentals Certificate"
];

const Glitter = () => (
  <div className="absolute inset-0 pointer-events-none z-10">
    <div className="absolute top-2 left-8 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse"></div>
    <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-70 animate-pulse"></div>
    <div className="absolute bottom-8 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-60 animate-pulse"></div>
    <div className="absolute bottom-4 right-10 w-2 h-2 bg-white rounded-full opacity-90 animate-pulse"></div>
    <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-gradient-to-br from-purple-400 via-indigo-300 to-transparent rounded-full opacity-40 blur-sm animate-pulse"></div>
    <div className="absolute top-10 left-1/2 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-80 animate-pulse"></div>
    <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-pulse"></div>
  </div>
);

const LearningPlanForm = ({ show, onClose, onSubmit, editingPlan }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficultyLevel: 'Beginner',
    duration: '',
    materials: null
  });

  useEffect(() => {
    if (editingPlan) {
      setFormData(editingPlan);
    } else {
      setFormData({
        title: '',
        description: '',
        difficultyLevel: 'Beginner',
        duration: '',
        materials: null
      });
    }
  }, [editingPlan, show]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl rounded-2xl shadow-2xl p-0 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at top left, #23263a 80%, #181c2f 100%)",
          border: "1px solid #3b3f5c",
          boxShadow: "0 0 40px 10px #6d28d9, 0 0 0 1px #23263a"
        }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Astronomy Visual/Content Side */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900 p-8 w-1/2 text-center text-white relative">
            <Glitter />
            <div className="text-6xl mb-4 animate-bounce">🪐</div>
            <h3 className="text-2xl font-bold mb-2 relative z-20">Create Your Cosmic Course</h3>
            <p className="text-purple-200 mb-4">
              Chart a path through the stars! <br />
              <span className="text-indigo-300">Add a new astronomy learning plan and inspire future explorers.</span>
            </p>
            <div className="flex justify-center gap-2 text-2xl">
              <span title="Rocket">🚀</span>
              <span title="Telescope">🔭</span>
              <span title="Star">⭐</span>
              <span title="Galaxy">🌌</span>
            </div>
          </div>
          {/* Form Side */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl mb-4 flex items-center gap-2 font-bold text-white tracking-wide">
              <span role="img" aria-label="rocket">🚀</span>
              {editingPlan ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block mb-1 text-purple-300 font-semibold">Plan Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#181c2f] border-2 border-purple-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-700 text-white shadow-inner transition"
                  placeholder="e.g., Exploring the Stars"
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-purple-300 font-semibold">Difficulty Level</label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#181c2f] border-2 border-purple-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-700 text-white shadow-inner transition"
                >
                  <option value="Beginner">🪐 Beginner</option>
                  <option value="Intermediate">🌌 Intermediate</option>
                  <option value="Advanced">🚀 Advanced</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-purple-300 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#181c2f] border-2 border-purple-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-700 text-white shadow-inner transition"
                  placeholder="Course overview..."
                  rows={2}
                />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-purple-300 font-semibold">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#181c2f] border-2 border-purple-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-700 text-white shadow-inner transition"
                  placeholder="e.g., 8 weeks"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-purple-300 font-semibold">Course Materials</label>
                <input
                  type="file"
                  name="materials"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full text-white file:bg-purple-700 file:text-white file:rounded file:px-3 file:py-1"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow transition"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg font-bold transition ring-2 ring-purple-900"
                >
                  {editingPlan ? 'Update' : 'Add'} Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanForm;