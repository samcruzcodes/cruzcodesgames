import React, { useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User, AuthContextType } from "../../lib/types";

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser); 
        return unsubscribe;
    }, []);

    async function initializeUser(firebaseUser: FirebaseUser | null) {
        if (firebaseUser) {
            const newUser: User = {
                id: firebaseUser.uid,
                username: firebaseUser.displayName || "Anonymous", 
                email: firebaseUser.email || "", 
                createdAt: new Date().toISOString(),
            };
            setCurrentUser(newUser);
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value: AuthContextType = {
        currentUser,
        userLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}