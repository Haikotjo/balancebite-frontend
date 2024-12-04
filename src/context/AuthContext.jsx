import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider to provide context
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user information
    const [role, setRole] = useState(null); // Holds the user's role
    const [loading, setLoading] = useState(true); // Indicates if auth context is initializing

    useEffect(() => {
        // Simulate retrieving a token or verification
        const token = localStorage.getItem("accessToken"); // Example: JWT token in localStorage
        console.log("Retrieved token from localStorage:", token); // Log the token

        if (token) {
            try {
                // Decode the token or fetch data from an API
                const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
                console.log("Decoded user data from token:", userData); // Log decoded user data
                setUser(userData.sub);
                setRole(userData.role);
            } catch (error) {
                console.error("Error decoding token:", error.message); // Log decoding errors
                logout(); // Clear the token if invalid
            }
        } else {
            console.log("No token found, user is not logged in."); // Log absence of token
        }
        setLoading(false); // Mark initialization as complete
    }, []);

    const login = (token) => {
        console.log("Storing token and logging in user."); // Log login attempt
        localStorage.setItem("accessToken", token);
        try {
            const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            console.log("Decoded user data on login:", userData); // Log decoded user data
            setUser(userData.sub);
            setRole(userData.role);
        } catch (error) {
            console.error("Error decoding token during login:", error.message); // Log decoding errors
        }
    };

    const logout = () => {
        console.log("Logging out and clearing token."); // Log logout action
        localStorage.removeItem("accessToken");
        setUser(null);
        setRole(null);
    };

    if (loading) {
        return <div>Loading authentication...</div>; // Show loading state while initializing
    }

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Validates that 'children' is a React node
};
