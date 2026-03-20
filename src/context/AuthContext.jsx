// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { loginApi, logoutApi, refreshAccessTokenApi } from "../services/authService.js";
import Spinner from "../components/layout/Spinner.jsx";
import CustomBox from "../components/layout/CustomBox.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const applyAccessToken = (nextAccessToken) => {
        const userData = jwtDecode(nextAccessToken);

        if (!userData.sub || !userData.roles) {
            throw new Error("Invalid token payload.");
        }

        const roles = Array.isArray(userData.roles)
            ? userData.roles
            : [userData.roles];

        localStorage.setItem("accessToken", nextAccessToken);
        setUser({ id: userData.sub, roles, type: userData.type });
        setRole(roles);
        setToken(nextAccessToken);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            try {
                if (storedToken) {
                    const userData = jwtDecode(storedToken);

                    if (userData.exp && Date.now() >= userData.exp * 1000) {
                        if (!storedRefreshToken) {
                            throw new Error("Access token expired and no refresh token is available.");
                        }
                        const { accessToken: refreshedAccessToken } = await refreshAccessTokenApi(storedRefreshToken);
                        applyAccessToken(refreshedAccessToken);
                        return;
                    }

                    applyAccessToken(storedToken);
                    return;
                }

                if (storedRefreshToken) {
                    const { accessToken: refreshedAccessToken } = await refreshAccessTokenApi(storedRefreshToken);
                    applyAccessToken(refreshedAccessToken);
                }
            } catch (error) {
                console.error("Error during authentication initialization:", error.message);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUser(null);
                setRole(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { accessToken, refreshToken } = await loginApi(email, password);
            localStorage.setItem("refreshToken", refreshToken);

            applyAccessToken(accessToken);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || "Login failed";
            console.error("Login failed:", msg);
            throw new Error(msg);
        }
    };

    const logout = async () => {
        const currentToken = localStorage.getItem("accessToken");

        if (currentToken) {
            try {
                await logoutApi(currentToken);
            } catch (err) {
                console.error("Error during logout request:", err.response?.data?.error || err.message);
            }
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setRole(null);
        setToken(null);
        setLoading(false);
    };

    if (loading) return null;

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
