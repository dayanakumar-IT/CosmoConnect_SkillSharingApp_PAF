import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ShareDialog = ({ open, onClose, plan }) => {
    const [shareData, setShareData] = useState({ recipient: '', shareMethod: 'email' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!open || !plan) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShareData((prev) => ({ ...prev, [name]: value }));
    };

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post(`http://localhost:8080/api/v1/learningplan/${plan.id}/share`, null, {
                params: {
                    recipient: shareData.recipient,
                    shareMethod: shareData.shareMethod,
                },
            });
            setSuccess('Shared successfully!');
            setShareData({ recipient: '', shareMethod: 'email' });
        } catch (err) {
            setError('Failed to share learning plan.');
        } finally {
            setLoading(false);
        }
    };

    const getMailtoLink = () => {
        const subject = encodeURIComponent(`Check out this Learning Plan: ${plan.title}`);
        const body = encodeURIComponent(
            `Hi,\n\nI wanted to share this learning plan with you!\n\nTitle: ${plan.title}\nDescription: ${plan.description}\n` +
            (plan.difficultyLevel ? `Difficulty: ${plan.difficultyLevel}\n` : '') +
            (plan.duration ? `Duration: ${plan.duration} weeks\n` : '') +
            (plan.certificate ? `Certificate: ${plan.certificate}\n` : '') +
            (plan.price ? `Price: $${plan.price}\n` : '') +
            `\nView this plan in the app!`
        );
        return `mailto:${shareData.recipient}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}><FaTimes size={20} /></button>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Share Learning Plan</h2>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                {success && <div className="text-green-600 mb-2">{success}</div>}
                <form onSubmit={handleShare} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">Share Method</label>
                        <select
                            name="shareMethod"
                            value={shareData.shareMethod}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded text-gray-900"
                        >
                            <option value="email" className="text-gray-900">Email</option>
                            <option value="whatsapp" className="text-gray-900">WhatsApp</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-900">
                            {shareData.shareMethod === 'email' ? 'Recipient Email' : 'WhatsApp Number'}
                        </label>
                        <input
                            type="text"
                            name="recipient"
                            value={shareData.recipient}
                            onChange={handleChange}
                            placeholder={shareData.shareMethod === 'email' ? 'Enter email address' : 'Enter WhatsApp number'}
                            className="w-full px-3 py-2 border rounded text-gray-800"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                        {shareData.shareMethod === 'email' && shareData.recipient && (
                            <a
                                href={getMailtoLink()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open Email
                            </a>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareDialog; 