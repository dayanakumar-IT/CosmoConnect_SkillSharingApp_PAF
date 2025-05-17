import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaShareAlt, FaStar, FaEye, FaRocket } from 'react-icons/fa';
import { CosmicJourneyForm } from './CreateLearningPlan';
import EditLearningPlan from './EditLearningPlan';
import DeleteConfirmation from '../common/DeleteConfirmation';
import ShareDialog from './ShareDialog';
import axios from 'axios';
import ReactModal from 'react-modal';
import { useAuth } from '../../contexts/AuthContext';

const getBackendUrl = (path) => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
    return API_BASE + path;
};

const LearningPlanPage = () => {
    const [learningPlans, setLearningPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { user } = useAuth();
    const [isMyPlansOpen, setIsMyPlansOpen] = useState(false);

    useEffect(() => {
        fetchLearningPlans();
    }, []);

    const fetchLearningPlans = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8080/api/v1/learningplan', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLearningPlans(response.data);
        } catch (error) {
            console.error('Error fetching learning plans:', error);
        }
    };

    const handleCreate = () => setIsCreateOpen(true);
    const handleEdit = (plan) => { setSelectedPlan(plan); setIsEditOpen(true); };
    const handleDelete = (plan) => { setPlanToDelete(plan); setIsDeleteOpen(true); };
    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8080/api/v1/learningplan/${planToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLearningPlans();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Error deleting learning plan:', error);
        }
    };
    const handleShare = (plan) => { setSelectedPlan(plan); setIsShareOpen(true); };
    const handleViewDetails = (plan) => {
        setSelectedPlan(plan);
        setIsDetailsOpen(true);
    };

    const handleDownloadMaterial = async (url) => {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
            alert('Failed to download file');
            return;
        }
        const blob = await response.blob();
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Learning Plans</h1>
                <div className="flex gap-2">
                    <button
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
                        onClick={handleCreate}
                    >
                        <FaPlus /> Create New Plan
                    </button>
                    <button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                        onClick={() => setIsMyPlansOpen(true)}
                    >
                        My Plans
                    </button>
                </div>
            </div>

            {/* Timeline View */}
            <div className="relative border-l-2 border-purple-500 ml-4 mb-8">
                {learningPlans.map((plan, idx) => (
                    <div key={plan.id} className="mb-8 ml-6 relative flex items-stretch">
                        {/* Timeline dot */}
                        <div className="absolute -left-6 top-2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white"></div>
                        {/* Card */}
                        <div className="bg-gray-800 rounded-lg shadow p-6 flex-1 flex flex-col relative min-h-[160px]">
                            {/* Decorative Icon */}
                            <FaStar className="absolute top-4 right-4 text-yellow-400 text-3xl opacity-80" />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-white">
                                    {plan.title}
                                    <span className="text-gray-400">
                                        @ {plan.createdByName ? plan.createdByName : (plan.createdBy ? plan.createdBy.split('@')[0] : '')}
                                    </span>
                                </h2>
                                <p className="text-gray-300 mt-1 mb-2 break-words whitespace-pre-line">{plan.description}</p>
                                <div className="text-sm text-gray-400 space-x-4 mb-2">
                                    <span>Difficulty: {plan.difficultyLevel}</span>
                                    <span>Duration: {plan.duration}</span>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                                    onClick={() => handleViewDetails(plan)}
                                    title="View Details"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="w-10 h-10 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white rounded-full"
                                    onClick={() => handleShare(plan)}
                                    title="Share"
                                >
                                    <FaShareAlt />
                                </button>
                            </div>
                        </div>
                        {/* Timeline extension and icon/image */}
                        <div className="flex flex-col items-center ml-6 relative">
                            {/* Animated vertical line (except for last card) */}
                            {idx < learningPlans.length - 1 && (
                                <div className="h-24 w-1 bg-gradient-to-b from-purple-400 to-pink-400 animate-pulse"></div>
                            )}
                            {/* Space-themed image/icon */}
                            <FaRocket className="text-purple-600 text-5xl animate-bounce mt-2 drop-shadow-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Modal */}
            <ReactModal
                isOpen={isDetailsOpen}
                onRequestClose={() => setIsDetailsOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                overlayClassName=""
                ariaHideApp={false}
            >
                {selectedPlan && (
                    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative border-4 border-purple-300">
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={() => setIsDetailsOpen(false)}>
                            <FaStar size={28} />
                        </button>
                        <div className="flex items-center gap-4 mb-6">
                            <FaStar className="text-yellow-400 text-4xl" />
                            <h2 className="text-3xl font-bold text-purple-800">{selectedPlan.title}</h2>
                        </div>
                        <p className="text-gray-700 text-lg mb-4 whitespace-pre-line">{selectedPlan.description}</p>
                        <div className="flex flex-wrap gap-6 mb-4">
                            <div className="flex items-center gap-2 text-purple-700 font-semibold">
                                <span>Difficulty:</span> <span>{selectedPlan.difficultyLevel}</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-700 font-semibold">
                                <span>Duration:</span> <span>{selectedPlan.duration} weeks</span>
                            </div>
                            {selectedPlan.certificate && (
                                <div className="flex items-center gap-2 text-green-700 font-semibold">
                                    <span>Certificate:</span> <span>{selectedPlan.certificate}</span>
                                </div>
                            )}
                            {selectedPlan.price && (
                                <div className="flex items-center gap-2 text-pink-700 font-semibold">
                                    <span>Price:</span> <span>${selectedPlan.price}</span>
                                </div>
                            )}
                        </div>
                        {selectedPlan.learningMaterials && selectedPlan.learningMaterials.length > 0 && (
                            <div className="mb-4">
                                <div className="text-gray-800 font-semibold mb-1">Learning Materials:</div>
                                {selectedPlan.learningMaterials.map((material, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDownloadMaterial(getBackendUrl(material))}
                                        className="inline-block bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded mr-2 mb-2"
                                    >
                                        View Material {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-8">
                            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:from-purple-700 hover:to-pink-600 transition text-lg">
                                Register
                            </button>
                        </div>
                    </div>
                )}
            </ReactModal>

            {/* Modals */}
            <CosmicJourneyForm
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    fetchLearningPlans();
                }}
            />

            <EditLearningPlan
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => {
                    setIsEditOpen(false);
                    fetchLearningPlans();
                }}
                plan={selectedPlan}
            />

            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={<span className="flex items-center gap-2 text-red-600"><FaTrash /> Delete Learning Plan</span>}
                message={`Are you sure you want to delete "${planToDelete?.title}"?`}
            />

            <ShareDialog
                open={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                plan={selectedPlan}
            />

            {/* My Plans Modal */}
            <ReactModal
                isOpen={isMyPlansOpen}
                onRequestClose={() => setIsMyPlansOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
                overlayClassName=""
                ariaHideApp={false}
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative border-4 border-blue-300">
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={() => setIsMyPlansOpen(false)}>
                        Close
                    </button>
                    <h2 className="text-2xl font-bold text-blue-800 mb-6">My Learning Plans</h2>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                        {learningPlans.filter(plan => plan.createdBy === user?.email).length === 0 ? (
                            <div className="text-gray-500 text-center">You have not created any learning plans yet.</div>
                        ) : (
                            learningPlans.filter(plan => plan.createdBy === user?.email).map(plan => (
                                <div key={plan.id} className="bg-gray-100 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between relative">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-900">{plan.title}</h3>
                                        <p className="text-gray-700 mb-1 break-words whitespace-pre-line">{plan.description}</p>
                                        <div className="text-sm text-gray-500 space-x-4 mb-2">
                                            <span>Difficulty: {plan.difficultyLevel}</span>
                                            <span>Duration: {plan.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 md:mt-0">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
                                            onClick={() => { setSelectedPlan(plan); setIsEditOpen(true); }}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full"
                                            onClick={() => { setPlanToDelete(plan); setIsDeleteOpen(true); }}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </ReactModal>
        </div>
    );
};

export default LearningPlanPage; 