// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { loginApi, logoutApi } from "../services/authService.js";
import Spinner from "../components/layout/Spinner.jsx";
import CustomBox from "../components/layout/CustomBox.jsx";

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

                    // Check of token verlopen is (optioneel)
                    if (userData.exp && Date.now() >= userData.exp * 1000) {
                        throw new Error("Access token is expired.");
                    }

                    // Check op geldige structuur
                    if (!userData.sub || !userData.roles) {
                        throw new Error("Invalid token payload.");
                    }

                    // Normaliseer rollen indien nodig
                    const roles = Array.isArray(userData.roles)
                        ? userData.roles
                        : [userData.roles];

                    setUser({ id: userData.sub, roles, type: userData.type });
                    setRole(roles);
                    setToken(storedToken);
                }
            } catch (error) {
                console.error("Error during authentication initialization:", error.message);
                await logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { accessToken, refreshToken } = await loginApi(email, password);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            const userData = jwtDecode(accessToken);

            const roles = Array.isArray(userData.roles)
                ? userData.roles
                : [userData.roles];

            setUser({ id: userData.sub, roles, type: userData.type });
            setRole(roles);
            setToken(accessToken);
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

    if (loading) {
        return (
            <CustomBox className="flex items-center justify-center h-screen">
                <Spinner />
            </CustomBox>
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
