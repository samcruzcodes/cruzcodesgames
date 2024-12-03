import React from "react";
import { useAuth } from "../authcontext";
import { doSignOut } from "../../../backend/auth.controller";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
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
            <div className="min-h-screen flex flex-col justify-center items-center">
                <h1 className="text-2xl mb-4">Welcome!</h1>
                <p className="mb-4">
                    You are not logged in. Please log in or create an account to
                    view your profile.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        );
    }

    const formattedDate = currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleString() : "N/A";

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl mb-4 text-center">
                    Welcome, {currentUser?.username || currentUser?.email}!
                </h1>
                <h2 className="text-xl mb-4 text-center">Your Profile</h2>

                <div className="mb-4">
                    <strong>Email:</strong> {currentUser?.email}
                </div>

                <div className="mb-4">
                    <strong>User ID:</strong> {currentUser?.id}
                </div>

                <div className="mb-4">
                    <strong>Created At:</strong> {formattedDate}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleEditProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
