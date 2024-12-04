import React, { useState } from 'react';
import { useAuth } from '../authcontext';
import { updateProfile } from './profileService';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../auth.controller';


const EditProfile: React.FC = () => {
    const { currentUser, refreshUserProfile } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        displayName: currentUser?.displayName || '',
        photoURL: currentUser?.photoURL || '',
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!currentUser?.id) throw new Error('No user ID found');
            
            await updateProfile(currentUser.id, {
                username: formData.username,
                displayName: formData.displayName,
                photoURL: formData.photoURL,
            });

            await refreshUserProfile();
            navigate('/profile');
        } catch (err) {
            setError('Failed to update profile');
            console.error('Profile update error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                await deleteUserAccount();
                navigate('/login');
            } catch (err: any) {
                setError(err.message || 'Failed to delete account');
                console.error('Account deletion error:', err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <h1 className="text-2xl mb-6 text-center">Edit Profile</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            name="photoURL"
                            value={formData.photoURL}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        >
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        >
                            {isLoading ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            This action cannot be undone.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;