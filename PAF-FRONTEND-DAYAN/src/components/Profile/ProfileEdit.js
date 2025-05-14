import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

const ProfileEdit = ({ user, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            fullName: user.fullName,
            biography: user.biography || '',
            location: user.location || '',
            timezone: user.timezone ? { value: user.timezone, label: user.timezone } : null,
            astronomyLevel: user.astronomyLevel ? { value: user.astronomyLevel, label: user.astronomyLevel } : null,
            astronomyInterests: user.astronomyInterests?.map(interest => ({ value: interest, label: interest })) || [],
            observationEquipment: user.observationEquipment?.map(equipment => ({ value: equipment, label: equipment })) || [],
            websiteUrl: user.websiteUrl || '',
            instagramProfile: user.instagramProfile || '',
            twitterProfile: user.twitterProfile || '',
            knownLanguages: user.knownLanguages?.map(lang => ({ value: lang, label: lang })) || []
        }
    });

    const timezoneOptions = [
        { value: 'UTC', label: 'UTC' },
        { value: 'EST', label: 'EST' },
        { value: 'PST', label: 'PST' },
        { value: 'GMT', label: 'GMT' },
        { value: 'IST', label: 'IST' }
    ];

    const astronomyLevelOptions = [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
        { value: 'Professional', label: 'Professional' }
    ];

    const interestOptions = [
        { value: 'Astrophotography', label: 'Astrophotography' },
        { value: 'Telescope Making', label: 'Telescope Making' },
        { value: 'Star Gazing', label: 'Star Gazing' },
        { value: 'Planetary Science', label: 'Planetary Science' }
    ];

    const equipmentOptions = [
        { value: 'Telescope', label: 'Telescope' },
        { value: 'Binoculars', label: 'Binoculars' },
        { value: 'Camera', label: 'Camera' },
        { value: 'Mount', label: 'Mount' }
    ];

    const languageOptions = [
        { value: 'English', label: 'English' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'French', label: 'French' },
        { value: 'German', label: 'German' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Japanese', label: 'Japanese' }
    ];

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // Transform the data to match the API expectations
            const transformedData = {
                ...data,
                timezone: data.timezone?.value,
                astronomyLevel: data.astronomyLevel?.value,
                astronomyInterests: data.astronomyInterests?.map(item => item.value) || [],
                observationEquipment: data.observationEquipment?.map(item => item.value) || [],
                knownLanguages: data.knownLanguages?.map(item => item.value) || []
            };
            await onSave(transformedData);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Biography</label>
                    <textarea
                        {...register('biography', { maxLength: 500 })}
                        rows="4"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Location</label>
                        <input
                            type="text"
                            {...register('location')}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Timezone</label>
                        <Controller
                            name="timezone"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={timezoneOptions}
                                    className="mt-1"
                                    classNamePrefix="select"
                                    isClearable
                                />
                            )}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Astronomy Level</label>
                    <Controller
                        name="astronomyLevel"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={astronomyLevelOptions}
                                className="mt-1"
                                classNamePrefix="select"
                                isClearable
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Astronomy Interests</label>
                    <Controller
                        name="astronomyInterests"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={interestOptions}
                                className="mt-1"
                                classNamePrefix="select"
                                isMulti
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Observation Equipment</label>
                    <Controller
                        name="observationEquipment"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={equipmentOptions}
                                className="mt-1"
                                classNamePrefix="select"
                                isMulti
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Website URL</label>
                    <input
                        type="url"
                        {...register('websiteUrl')}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Instagram Profile</label>
                        <input
                            type="text"
                            {...register('instagramProfile', {
                                pattern: {
                                    value: /^@?[a-zA-Z0-9_]+$/,
                                    message: 'Invalid Instagram username'
                                }
                            })}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Twitter Profile</label>
                        <input
                            type="text"
                            {...register('twitterProfile', {
                                pattern: {
                                    value: /^@?[a-zA-Z0-9_]+$/,
                                    message: 'Invalid Twitter username'
                                }
                            })}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300">Known Languages</label>
                    <Controller
                        name="knownLanguages"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={languageOptions}
                                className="mt-1"
                                classNamePrefix="select"
                                isMulti
                            />
                        )}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

ProfileEdit.propTypes = {
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
        knownLanguages: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ProfileEdit; 