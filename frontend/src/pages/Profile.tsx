import { useAuth } from "../authcontext";
import { useNavigate } from "react-router-dom";
import { doSignOut } from "../auth.controller";
import placeholder from "../assets/placeholder.jpg"

const Profile = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!userLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.heading}>Welcome!</h1>
          <p style={styles.textMuted}>
            You are not logged in. Please log in or create an account to view
            your profile.
          </p>
          <div style={styles.buttonGroup}>
            <button onClick={() => navigate("/login")} style={styles.primaryButton}>
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              style={styles.secondaryButton}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleString()
    : "N/A";

  const formattedUpdateDate = currentUser?.updatedAt
    ? new Date(currentUser.updatedAt).toLocaleString()
    : "Never";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome, {currentUser?.username || currentUser?.email}!</h1>

        <div style={styles.profilePicture}>
          <img
            src={currentUser?.photoURL || placeholder}
            alt="Profile Photo"
            style={styles.profileImage}
          />
        </div>

        <div style={styles.infoGroup}>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p>
            <strong>Display Name:</strong>{" "}
            {currentUser?.displayName || currentUser?.username}
          </p>
          <p><strong>User ID:</strong> {currentUser?.id}</p>
          <p><strong>Created:</strong> {formattedDate}</p>
          <p><strong>Last Updated:</strong> {formattedUpdateDate}</p>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={handleEditProfile} style={styles.primaryButton}>
            Edit Profile
          </button>
          <button onClick={handleSignOut} style={styles.dangerButton}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
  textMuted: {
    fontSize: "1.1rem",
    color: "var(--subtle-accent)",
    marginBottom: "20px",
  },
  profilePicture: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover" as const,
  },
  infoGroup: {
    marginBottom: "25px",
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
  dangerButton: {
    padding: "12px 20px",
    backgroundColor: "var(--highlight-color)",
    color: "var(--primary-color)",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Profile;
