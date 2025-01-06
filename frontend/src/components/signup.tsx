import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../auth.controller';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await doCreateUserWithEmailAndPassword(
        formData.username,
        formData.email,
        formData.password
      );
      navigate('/profile');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await doSignInWithGoogle();
      navigate('/profile');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google');
      console.error('Google signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create Account</h1>

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
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading}
              style={styles.primaryButton}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              style={styles.googleButton}
            >
              Sign Up with Google
            </button>
          </div>
        </form>

        <div style={styles.textCenter}>
          <p style={styles.textSm}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={styles.linkButton}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--background-color)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "var(--background-primary-mix)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "var(--primary-color)",
    marginBottom: "25px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "1.1rem",
    color: "var(--primary-color)",
    marginBottom: "8px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid var(--subtle-accent)",
    backgroundColor: "var(--background-primary-mix)",
    color: "var(--text-color)",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
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
  googleButton: {
    padding: "12px 20px",
    backgroundColor: "var(--secondary-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  textCenter: {
    textAlign: "center",
    marginTop: "20px",
  },
  textSm: {
    fontSize: "0.9rem",
    color: "var(--subtle-accent)",
  },
  linkButton: {
    color: "var(--accent-color)",
    textDecoration: "underline",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  }
};

export default SignUp;
