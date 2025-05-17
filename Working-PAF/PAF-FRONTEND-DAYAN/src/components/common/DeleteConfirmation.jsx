import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';

const DeleteConfirmation = ({ open, onClose, onConfirm, title, message }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}><FaTimes size={20} /></button>
                <h2 className="text-xl font-bold mb-4">{title || 'Confirm Delete'}</h2>
                <p className="mb-6 text-gray-700">{message || 'Are you sure you want to delete this item?'}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={onConfirm} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"><FaTrash /> Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation; 