import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Custom hook to extract initial user values from JWT token.
 *
 * @param {string} token - The JWT token containing user data.
 * @returns {[{ username: string, email: string } | null, Function]} - Extracted user info and setter.
 */
const useUserInitialValues = (token) => {
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        if (!token) return;

        try {
            const decodedToken = jwtDecode(token);
            setInitialValues({
                username: decodedToken.username || "Default Username",
                email: decodedToken.email || "default@example.com",
            });
        } catch (error) {
            console.error("Invalid token:", error.message);
            setInitialValues(null);
        }
    }, [token]);

    return [initialValues, setInitialValues]; // ✅ Return both values!
};

export default useUserInitialValues;
