import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode"; // Correcte import behouden
import { loginApi, logoutApi } from "../services/authService.js";
import { Box, CircularProgress } from "@mui/material";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null); // Token state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");

            try {
                if (storedToken) {
                    // Probeer access token te decoderen
                    const userData = jwtDecode(storedToken);
                    setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
                    setRole(userData.roles);
                    setToken(storedToken);
                } else {
                    console.warn("Geen access token gevonden. Gebruiker niet ingelogd.");
                }
            } catch (error) {
                console.error("Error during authentication initialization:", error.message);
                logout();
            } finally {
                setLoading(false); // Zorg ervoor dat loading altijd stopt
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginApi(email, password);
            const { accessToken, refreshToken } = response;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const userData = jwtDecode(accessToken);
            setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
            setRole(userData.roles);
            setToken(accessToken); // Zet token in state
        } catch (err) {
            console.error("Login failed:", err.response?.data?.error || err.message);
            throw new Error(err.response?.data?.error || "Login failed");
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem("accessToken");

        if (currentToken) {
            try {
                await logoutApi(currentToken);
            } catch (error) {
                console.error("Error during logout request:", error.response?.data?.error || error.message);
            }
        }

        // Verwijder tokens en reset state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setRole(null);
        setToken(null);
        setLoading(false); // Zorg dat de applicatie niet blijft hangen in een loading state
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
