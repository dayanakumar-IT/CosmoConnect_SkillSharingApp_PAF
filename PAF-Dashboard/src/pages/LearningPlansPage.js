import React, { useState } from 'react';
import LearningPlanForm from '../components/LearningPlanForm';

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

const LearningPlansPage = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleShow = (plan = null) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleSubmit = (formData) => {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-orbitron text-white">Learning Plans</h1>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleShow()}
        >
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-[#181c2f] rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
            <p className="mb-2 text-gray-300">{plan.description}</p>
            <div className="mb-1"><span className="font-semibold">Difficulty:</span> {plan.difficultyLevel}</div>
            <div className="mb-1"><span className="font-semibold">Duration:</span> {plan.duration}</div>
            <div className="mb-3"><span className="font-semibold">Certificate:</span> {plan.certificateName}</div>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleShow(plan)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(plan.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <LearningPlanForm
        show={showModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editingPlan={editingPlan}
      />
    </div>
  );
};

export default LearningPlansPage; 