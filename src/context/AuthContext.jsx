import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode"; // Correcte import
import { Box, CircularProgress } from "@mui/material";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null); // Token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Retrieved token from localStorage:", storedToken);

        if (storedToken) {
            try {
                const userData = jwtDecode(storedToken);
                console.log("Decoded user data from token:", userData);
                setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
                setRole(userData.roles);
                setToken(storedToken); // Zet token in state
            } catch (error) {
                console.error("Error decoding token:", error.message);
                logout();
            }
        } else {
            console.log("No token found, user is not logged in.");
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Attempting login with email:", email);

            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("Login response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login error:", errorData.error || "Unknown error");
                throw new Error(errorData.error || "Login failed");
            }

            const data = await response.json();
            console.log("Login successful, received data:", data);

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            const userData = jwtDecode(data.accessToken);
            console.log("Decoded user data on login:", userData);

            setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
            setRole(userData.roles);
            setToken(data.accessToken); // Zet token in state
        } catch (err) {
            console.error("Login failed:", err.message);
            throw err; // Zorgt ervoor dat de error verder kan worden afgehandeld
        }
    };

    const logout = async () => {
        console.log("Logging out and clearing token.");
        const currentToken = localStorage.getItem("accessToken");

        if (!currentToken) {
            console.error("No token found in localStorage. Logout cannot proceed.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentToken}`,
                },
                credentials: "include",
            });

            if (response.ok) {
                console.log("Successfully logged out on the server.");
            } else {
                console.error("Logout request failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error during logout request:", error.message);
        }

        localStorage.removeItem("accessToken");
        setUser(null);
        setRole(null);
        setToken(null); // Verwijder token uit state
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
