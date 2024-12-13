import { Interceptor } from "./authInterceptor";

export const loginApi = async (email, password) => {
    const endpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || "/auth/login";
    try {
        const response = await Interceptor.post(endpoint, { email, password });
        console.log("[DEBUG] Login succesvol:", response.data);
        return response.data;
    } catch (error) {
        console.error("[DEBUG] Fout bij inloggen:", error.response?.data?.error || error.message);
        throw error;
    }
};

export const logoutApi = async (token) => {
    const endpoint = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || "/auth/logout";
    try {
        const response = await Interceptor.post(
            endpoint,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
        );
        console.log("[DEBUG] Logout succesvol:", response.data);
        return response.data;
    } catch (error) {
        console.error("[DEBUG] Fout bij uitloggen:", error.response?.data?.error || error.message);
        throw error;
    }
};

export const registerUserApi = async (formData) => {
    const endpoint = import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || "/auth/register";
    try {
        const response = await Interceptor.post(endpoint, formData);
        console.log("[API] Registration successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("[API Error] Registration failed:", error.response?.data?.error || error.message);
        throw error;
    }
};
