import { useState } from 'react';
import { useAuth } from '../authcontext';
import { updateProfile } from './profileService';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../auth.controller';
import { CSSProperties } from 'react';

const EditProfile = () => {
  const { currentUser, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    displayName: currentUser?.displayName || '',
  });

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      if (!currentUser?.id) throw new Error('No user ID found');

      await updateProfile(currentUser.id, {
        username: formData.username,
        displayName: formData.displayName,
      });

      await refreshUserProfile();
      navigate('/profile');
    } catch (err) {
      setError((err as Error).message || 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteUserAccount();
        navigate('/login');
      } catch (err) {
        setError((err as Error).message || 'Failed to delete account');
        console.error('Account deletion error:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Edit Profile</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isSaving || isDeleting}
              style={styles.primaryButton}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          </div>

          <div style={styles.deleteSection}>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isSaving || isDeleting}
              style={styles.deleteButton}
            >
              {isDeleting ? 'Deleting Account...' : 'Delete Account'}
            </button>
            <p style={styles.deleteWarning}>
              This action cannot be undone.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", 
    height: "100vh", 
    padding: "20px",
    backgroundColor: "var(--background-color)",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "var(--background-primary-mix)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    marginTop: "20px", 
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--primary-color)",
    marginBottom: "20px",
    textAlign: "center" as const, 
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center" as const, 
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "1rem",
    color: "var(--text-color)",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "var(--text-color)",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column" as const, 
    gap: "15px",
  },
  primaryButton: {
    padding: "12px 20px",
    backgroundColor: "var(--accent-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  secondaryButton: {
    padding: "12px 20px",
    backgroundColor: "var(--secondary-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  deleteSection: {
    marginTop: "20px",
    textAlign: "center" as const, 
  },
  deleteButton: {
    padding: "12px 20px",
    backgroundColor: "var(--highlight-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  deleteWarning: {
    fontSize: "0.9rem",
    color: "var(--text-color)",
    marginTop: "10px",
  },
};

export default EditProfile;
