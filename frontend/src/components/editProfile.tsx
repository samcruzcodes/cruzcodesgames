import React, { useState } from 'react';
import { useAuth } from '../authcontext';
import { updateProfile } from './profileService';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../auth.controller';

const EditProfile = () => {
  const { currentUser, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    displayName: currentUser?.displayName || '',
    photoURL: currentUser?.photoURL || '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
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
      } catch (err) {
        setError(err.message || 'Failed to delete account');
        console.error('Account deletion error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading">Edit Profile</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">Profile Picture URL</label>
            <input
              type="text"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="secondary-button"
            >
              Cancel
            </button>
          </div>

          <div className="delete-section">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="delete-button"
            >
              {isLoading ? 'Deleting Account...' : 'Delete Account'}
            </button>
            <p className="delete-warning">
              This action cannot be undone.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
