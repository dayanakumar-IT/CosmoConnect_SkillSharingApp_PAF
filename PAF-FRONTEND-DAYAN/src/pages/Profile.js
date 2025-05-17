import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '../components/Profile/ProfileView';
import ProfileEdit from '../components/Profile/ProfileEdit';
import ProfilePhoto from '../components/Profile/ProfilePhoto';
import userService from '../services/user.service';
import authService from '../services/auth.service';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (err) {
            setError('Failed to load profile. Please try again.');
            if (err.response?.status === 401) {
                authService.logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (updatedData) => {
        try {
            setLoading(true);
            const updatedUser = await userService.updateProfile(user.id, updatedData);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpdate = async (file) => {
        try {
            setLoading(true);
            const updatedUser = await userService.updateProfilePhoto(user.id, file);
            setUser(updatedUser);
        } catch (err) {
            setError('Failed to update photo. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
                    <p className="text-gray-400">Please try logging in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="mb-6 bg-red-900 bg-opacity-50 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <ProfileEdit
                        user={user}
                        onSave={handleSaveProfile}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-center">
                            <ProfilePhoto
                                currentPhotoUrl={user.imageUrl}
                                onPhotoUpdate={handlePhotoUpdate}
                            />
                        </div>
                        <ProfileView user={user} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 