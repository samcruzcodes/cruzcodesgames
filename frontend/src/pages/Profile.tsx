import React from "react";
import { useAuth } from "../authcontext";
import { doSignOut } from "../auth.controller";
import { useNavigate } from "react-router-dom";

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
      <div className="container">
        <div className="card text-center">
          <h1 className="heading">Welcome!</h1>
          <p className="text-muted">
            You are not logged in. Please log in or create an account to view
            your profile.
          </p>
          <div className="button-group">
            <button onClick={() => navigate("/login")} className="primary-button">
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="secondary-button"
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
    <div className="container">
      <div className="card">
        <h1 className="heading text-center">
          Welcome, {currentUser?.username || currentUser?.email}!
        </h1>

        {currentUser?.photoURL && (
          <div className="profile-picture">
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="rounded-full"
            />
          </div>
        )}

        <div className="info-group">
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p>
            <strong>Display Name:</strong>{" "}
            {currentUser?.displayName || "Not set"}
          </p>
          <p><strong>User ID:</strong> {currentUser?.id}</p>
          <p><strong>Created:</strong> {formattedDate}</p>
          <p><strong>Last Updated:</strong> {formattedUpdateDate}</p>
        </div>

        <div className="button-group">
          <button onClick={handleEditProfile} className="primary-button">
            Edit Profile
          </button>
          <button onClick={handleSignOut} className="danger-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
