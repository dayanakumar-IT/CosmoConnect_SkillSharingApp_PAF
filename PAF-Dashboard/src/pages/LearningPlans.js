import React, { useState, useRef } from 'react';

const initialPlans = [
  {
    id: 1,
    title: "Introduction to Astronomy",
    description: "A beginner-friendly course covering the basics of astronomy, celestial objects, and observational techniques.",
    difficultyLevel: "Beginner",
    duration: "8 weeks",
    certificateName: "Astronomy Fundamentals Certificate",
    materials: "intro_astronomy.pdf"
  },
  {
    id: 2,
    title: "Advanced Stellar Physics",
    description: "Deep dive into stellar evolution, nuclear fusion, and the life cycle of stars.",
    difficultyLevel: "Advanced",
    duration: "12 weeks",
    certificateName: "Stellar Physics Specialist",
    materials: "stellar_physics.pdf"
  },
  {
    id: 3,
    title: "Cosmology and the Universe",
    description: "Explore the origins of the universe, dark matter, and the expanding cosmos.",
    difficultyLevel: "Intermediate",
    duration: "10 weeks",
    certificateName: "Cosmology Studies Certificate",
    materials: "cosmology_basics.pdf"
  }
];

const certificateTemplates = [
  'Space Exploration Fundamentals Certificate',
  'Stellar Physics Specialist',
  'Cosmology Studies Certificate',
  'Astronomy Fundamentals Certificate'
];

const getTimelineDates = (startDate, duration) => {
  // duration: e.g., '8 weeks' or '10 weeks'
  const weeks = parseInt(duration);
  const start = new Date(startDate);
  const timeline = [];
  for (let i = 0; i < weeks; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    timeline.push({
      label: `Week ${i + 1}`,
      date: d.toLocaleDateString()
    });
  }
  return timeline;
};

const emojiList = ['🚀', '🪐', '🌟', '🔭', '👽', '🌌', '🛰️', '🛸', '☄️', '🪐'];

const LearningPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficultyLevel: 'Beginner',
    duration: '',
    certificateName: '',
    materials: null
  });
  const [showCertPopover, setShowCertPopover] = useState(false);
  const [certInputEnabled, setCertInputEnabled] = useState(false);
  const certLabelRef = useRef(null);
  const certBtnRef = useRef(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeMilestone, setActiveMilestone] = useState(null);
  const today = new Date();

  const handleShow = (plan = null) => {
    setEditingPlan(plan);
    setFormData(plan || {
      title: '',
      description: '',
      difficultyLevel: 'Beginner',
      duration: '',
      certificateName: '',
      materials: null
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      title: '',
      description: '',
      difficultyLevel: 'Beginner',
      duration: '',
      certificateName: '',
      materials: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      setPlans(plans.map(plan =>
        plan.id === editingPlan.id ? { ...formData, id: plan.id } : plan
      ));
    } else {
      setPlans([...plans, { ...formData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Add Course button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-orbitron text-white">Learning Plans</h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transition"
          onClick={() => handleShow()}
        >
          Add Course
        </button>
      </div>
      {/* Roadmap Timeline */}
      <div className="mb-10">
        {selectedPlan ? (
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 rounded-2xl p-6 shadow-lg border-2 border-purple-700/60 flex flex-col items-center animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span role="img" aria-label="road">🛣️</span> {selectedPlan.title} Roadmap
            </h3>
            {/* Roadmap Journey */}
            <div className="relative w-full flex justify-center items-center" style={{ minHeight: '100px' }}>
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-purple-700 via-indigo-500 to-purple-700 rounded-full opacity-60 z-0" style={{ transform: 'translateY(-50%)' }}></div>
              <div className="flex w-full justify-between items-center z-10 px-8">
                {getTimelineDates(today, selectedPlan.duration).map((milestone, idx, arr) => (
                  <div key={milestone.label} className="flex flex-col items-center flex-1 cursor-pointer group" onClick={() => setActiveMilestone(idx)}>
                    <div className={`rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg border-4 transition-all duration-300 ${activeMilestone === idx ? 'border-yellow-400 scale-110 bg-indigo-700 animate-bounce' : 'border-purple-400 bg-purple-800 group-hover:scale-105'}`}
                      style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                      <span className={activeMilestone === idx ? 'animate-bounce' : ''}>{emojiList[idx % emojiList.length]}</span>
                    </div>
                    <div className={`text-xs font-semibold text-white mt-1 ${activeMilestone === idx ? 'text-yellow-300' : 'text-purple-200'}`}>{milestone.label}</div>
                    <div className="text-[10px] text-purple-300">{milestone.date}</div>
                  </div>
                ))}
              </div>
            </div>
            {activeMilestone !== null && (
              <div className="mt-6 text-center text-lg text-yellow-200 font-bold animate-fade-in">
                {getTimelineDates(today, selectedPlan.duration)[activeMilestone].label} - {getTimelineDates(today, selectedPlan.duration)[activeMilestone].date}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-purple-300 italic mb-4">Click a course card to visualize its roadmap!</div>
        )}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative bg-gradient-to-br from-indigo-900 via-purple-900 to-[#181c2f] rounded-3xl shadow-2xl p-8 text-white border-2 border-purple-700/60 hover:border-indigo-400 transition-all duration-300 group overflow-hidden cursor-pointer ${selectedPlan && selectedPlan.id === plan.id ? 'ring-4 ring-indigo-400/60' : ''}`}
            style={{ boxShadow: '0 0 32px 4px #7c3aed55, 0 0 0 2px #312e81' }}
            onClick={() => setSelectedPlan(plan)}
          >
            <h2 className="text-2xl font-bold mb-2 font-orbitron tracking-wide flex items-center gap-2">
              {plan.title}
            </h2>
            <p className="mb-4 text-gray-300 leading-relaxed" style={{ minHeight: '60px' }}>{plan.description}</p>
            <div className="mb-1"><span className="font-semibold text-indigo-300">Difficulty:</span> {plan.difficultyLevel}</div>
            <div className="mb-1"><span className="font-semibold text-indigo-300">Duration:</span> {plan.duration}</div>
            <div className="mb-4 flex items-center gap-2"><span className="font-semibold text-indigo-300">Certificate:</span> <span className="inline-flex items-center gap-1">{plan.certificateName.includes('Stellar') ? '🌟' : plan.certificateName.includes('Cosmology') ? '🌌' : plan.certificateName.includes('Space') ? '🪐' : plan.certificateName.includes('Astrobiology') ? '👽' : '🔭'} {plan.certificateName}</span></div>
            <div className="flex gap-3 mt-4">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-full shadow-lg font-bold transition ring-2 ring-purple-900 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400/50 text-lg"
                onClick={e => { e.stopPropagation(); handleShow(plan); }}
              >
                <span role="img" aria-label="edit">🔭</span> Edit
              </button>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-red-500 hover:from-red-600 hover:to-pink-700 text-white px-5 py-2 rounded-full shadow-lg font-bold transition ring-2 ring-pink-900 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400/50 text-lg"
                onClick={e => { e.stopPropagation(); handleDelete(plan.id); }}
              >
                <span role="img" aria-label="delete">🗑️</span> Delete
              </button>
            </div>
            {/* Subtle nebula/star overlay */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-16 right-12 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-8 left-1/2 w-2 h-2 bg-indigo-400 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute bottom-4 right-10 w-3 h-3 bg-white rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-900 via-indigo-800 to-transparent rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div
            className="relative w-full max-w-3xl rounded-2xl shadow-2xl p-0 overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at top left, #23263a 80%, #181c2f 100%)",
              border: "1px solid #3b3f5c",
              boxShadow: "0 0 40px 10px #6d28d9, 0 0 0 1px #23263a"
            }}
          >
            {/* Decorative Nebula/Stars */}
            <div className="absolute inset-0 pointer-events-none z-[-1]">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-16 right-12 w-3 h-3 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-8 left-1/2 w-2 h-2 bg-indigo-400 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute bottom-4 right-10 w-3 h-3 bg-white rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-900 via-indigo-800 to-transparent rounded-full opacity-30 blur-2xl"></div>
            </div>
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl"
              onClick={handleClose}
              title="Close"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              {/* Astronomy Visual/Content Side */}
              <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 to-purple-900 p-8 w-1/2 text-center text-white relative">
                <div className="text-6xl mb-4 animate-bounce">🪐</div>
                <h3 className="text-2xl font-bold mb-2">Create Your Cosmic Course</h3>
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="col-span-1 relative">
                    <label className="text-purple-300 font-semibold mb-1 block">Certificate Name</label>
                    <select
                      name="certificateName"
                      value={formData.certificateName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-800 to-indigo-900 border-2 border-purple-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-700 text-white shadow-inner transition mt-1 font-semibold text-lg appearance-none hover:bg-purple-900"
                      style={{ backgroundImage: 'linear-gradient(90deg, #6d28d9 0%, #312e81 100%)' }}
                    >
                      <option value="" className="text-gray-400">🌠 Select a certificate</option>
                      <option value="Astronomy Fundamentals Certificate">🪐 Astronomy Fundamentals Certificate</option>
                      <option value="Stellar Physics Specialist">🌟 Stellar Physics Specialist</option>
                      <option value="Cosmology Studies Certificate">🚀 Cosmology Studies Certificate</option>
                      <option value="Space Exploration Certificate">🔭 Space Exploration Certificate</option>
                      <option value="Astrobiology Achievement Certificate">👽 Astrobiology Achievement Certificate</option>
                    </select>
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
                      onClick={handleClose}
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
      )}
    </div>
  );
};

export default LearningPlans;