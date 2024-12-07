import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode"; // Correcte import behouden
import { loginApi, logoutApi } from "../services/apiService"; // Importeer de API functies
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

            const response = await loginApi(email, password); // Gebruik de loginApi uit apiService

            console.log("Login successful, received data:", response);

            const { accessToken, refreshToken } = response;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const userData = jwtDecode(accessToken);
            console.log("Decoded user data on login:", userData);

            setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
            setRole(userData.roles);
            setToken(accessToken); // Zet token in state
        } catch (err) {
            console.error("Login failed:", err.response?.data?.error || err.message);
            throw new Error(err.response?.data?.error || "Login failed");
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
            // Gebruik de logoutApi uit apiService
            await logoutApi(currentToken);

            console.log("Successfully logged out on the server.");
        } catch (error) {
            console.error("Error during logout request:", error.response?.data?.error || error.message);
        }

        // Verwijder tokens uit localStorage en reset state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log("localStorage after logout:", localStorage); // Log de state van localStorage

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
