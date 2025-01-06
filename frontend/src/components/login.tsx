import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../auth.controller";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await doSignInWithEmailAndPassword(formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      setError(error.message || "Failed to sign in");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await doSignInWithGoogle();
      navigate("/profile");
    } catch (error) {
      setError(error.message || "Failed to sign in with Google");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Login</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleEmailLogin}>
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

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading}
              style={styles.primaryButton}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={styles.googleButton}
            >
              Sign In with Google
            </button>
          </div>
        </form>

        <div style={styles.textCenter}>
          <p style={styles.textSm}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={styles.linkButton}
            >
              Sign Up
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
    maxWidth: "400px",
    padding: "25px",
    borderRadius: "10px",
    backgroundColor: "var(--background-primary-mix)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "var(--primary-color)",
    marginBottom: "20px",
  },
  error: {
    color: "var(--highlight-color)",
    fontSize: "0.9rem",
    marginBottom: "15px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    marginBottom: "5px",
    color: "var(--subtle-accent)",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid var(--subtle-accent)",
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.3s",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  primaryButton: {
    padding: "12px",
    backgroundColor: "var(--accent-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  primaryButtonHover: {
    backgroundColor: "var(--highlight-color)",
  },
  googleButton: {
    padding: "12px",
    backgroundColor: "var(--secondary-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  textCenter: {
    marginTop: "25px",
    textAlign: "center",
  },
  textSm: {
    fontSize: "0.9rem",
    color: "var(--subtle-accent)",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "var(--highlight-color)",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
