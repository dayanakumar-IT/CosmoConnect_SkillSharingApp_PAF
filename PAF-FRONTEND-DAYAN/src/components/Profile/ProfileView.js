import React from 'react';
import PropTypes from 'prop-types';
import { FaGlobe, FaInstagram, FaTwitter, FaLanguage } from 'react-icons/fa';

const ProfileView = ({ user }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                    <img
                        src={user.imageUrl || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">{user.fullName}</h1>
                    <p className="text-gray-400">{user.email}</p>
                    <div className="mt-2">
                        <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                            {user.astronomyLevel}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {user.biography && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">About</h2>
                        <p className="text-gray-300">{user.biography}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {user.location && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400">Location</h3>
                            <p className="text-white">{user.location}</p>
                        </div>
                    )}
                    {user.timezone && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400">Timezone</h3>
                            <p className="text-white">{user.timezone}</p>
                        </div>
                    )}
                </div>

                {user.astronomyInterests?.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.astronomyInterests.map((interest, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {user.observationEquipment?.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Equipment</h2>
                        <div className="flex flex-wrap gap-2">
                            {user.observationEquipment.map((equipment, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {equipment}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex space-x-4">
                    {user.websiteUrl && (
                        <a
                            href={user.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                        >
                            <FaGlobe className="w-6 h-6" />
                        </a>
                    )}
                    {user.instagramProfile && (
                        <a
                            href={`https://instagram.com/${user.instagramProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                        >
                            <FaInstagram className="w-6 h-6" />
                        </a>
                    )}
                    {user.twitterProfile && (
                        <a
                            href={`https://twitter.com/${user.twitterProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTwitter className="w-6 h-6" />
                        </a>
                    )}
                </div>

                {user.knownLanguages?.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Languages</h2>
                        <div className="flex items-center space-x-2">
                            <FaLanguage className="text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {user.knownLanguages.map((language, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {language}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ProfileView.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
        biography: PropTypes.string,
        location: PropTypes.string,
        timezone: PropTypes.string,
        astronomyLevel: PropTypes.string,
        astronomyInterests: PropTypes.arrayOf(PropTypes.string),
        observationEquipment: PropTypes.arrayOf(PropTypes.string),
        websiteUrl: PropTypes.string,
        instagramProfile: PropTypes.string,
        twitterProfile: PropTypes.string,
        knownLanguages: PropTypes.arrayOf(PropTypes.string),
        profileCompleteness: PropTypes.number
    }).isRequired
};

export default ProfileView; 