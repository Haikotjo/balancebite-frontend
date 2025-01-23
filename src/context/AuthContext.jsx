import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { loginApi, logoutApi } from "../services/authService.js";
import { Box, CircularProgress } from "@mui/material";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");

            try {
                if (storedToken) {

                    const userData = jwtDecode(storedToken);
                    setUser({ id: userData.sub, roles: userData.roles, type: userData.type });
                    setRole(userData.roles);
                    setToken(storedToken);
                } else {
                    console.warn("No access token found. User not logged in.");
                }
            } catch (error) {
                console.error("Error during authentication initialization:", error.message);
                logout();
            } finally {
                setLoading(false);
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
            setToken(accessToken);
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

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setRole(null);
        setToken(null);
        setLoading(false);
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
