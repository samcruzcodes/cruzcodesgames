const Profile = ({ user }: { user: any }) => {
    if (!user) {
        return (
            <center>
                <h1>Welcome!</h1>
                <p>You are not logged in. Please log in or create an account to view your profile.</p>
                <button onClick={() => window.location.href = '/login'}>Login</button>
                <button onClick={() => window.location.href = '/signup'}>Create Account</button>
            </center>
        );
    }

    return (
        <center>
            <h1>Welcome, {user.username}!</h1>
            <h2>Your Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
                <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <button>Edit Profile</button>
        </center>
    );
};
export default Profile;
