import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaCamera, FaSpinner, FaUser } from 'react-icons/fa';

const ProfilePhoto = ({ currentPhotoUrl, onPhotoUpdate, maxFileSize = 10 * 1024 * 1024 }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxFileSize) {
            setError(`File size should be less than ${maxFileSize / (1024 * 1024)}MB`);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Create preview URL
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);

            // Call the update function
            await onPhotoUpdate(file);
        } catch (err) {
            setError('Failed to update photo. Please try again.');
            // Revert preview on error
            setPreviewUrl(currentPhotoUrl);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative group">
            <div
                className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer bg-gray-700 flex items-center justify-center"
                onClick={handleClick}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <FaUser className="w-16 h-16 text-gray-500" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <FaCamera className="text-white text-2xl" />
                </div>
                {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <FaSpinner className="text-white text-2xl animate-spin" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}

            <p className="mt-2 text-xs text-gray-400 text-center">
                Click to change photo
            </p>
        </div>
    );
};

ProfilePhoto.propTypes = {
    currentPhotoUrl: PropTypes.string,
    onPhotoUpdate: PropTypes.func.isRequired,
    maxFileSize: PropTypes.number
};

export default ProfilePhoto; 