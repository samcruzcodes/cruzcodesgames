import React from "react";
import { useAuth } from "../authcontext";
import { doSignOut } from "../auth.controller";
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

    const formattedDate = currentUser?.createdAt 
        ? new Date(currentUser.createdAt).toLocaleString() 
        : "N/A";

    const formattedUpdateDate = currentUser?.updatedAt
        ? new Date(currentUser.updatedAt).toLocaleString()
        : "Never";

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <h1 className="text-2xl mb-4 text-center">
                    Welcome, {currentUser?.username || currentUser?.email}!
                </h1>
                
                {currentUser?.photoURL && (
                    <div className="flex justify-center mb-4">
                        <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <strong>Email:</strong> {currentUser?.email}
                </div>

                <div className="mb-4">
                    <strong>Display Name:</strong> {currentUser?.displayName || 'Not set'}
                </div>

                <div className="mb-4">
                    <strong>User ID:</strong> {currentUser?.id}
                </div>

                <div className="mb-4">
                    <strong>Created:</strong> {formattedDate}
                </div>

                <div className="mb-4">
                    <strong>Last Updated:</strong> {formattedUpdateDate}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handleEditProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition-colors"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
