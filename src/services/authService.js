// src/services/authService.js
import { Interceptor } from "./authInterceptor";
import {logError} from "../utils/helpers/loggingHelpers.js";

// LOGIN
export const loginApi = async (email, password) => {
    const endpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || "/auth/login";
    try {
        const response = await Interceptor.post(endpoint, { email, password });
        console.log("[DEBUG] Login succesvol:", response.data);
        return response.data;
    } catch (error) {
        logError(error);
        let msg = "Something went wrong, please try again later.";
        if (error.response) {
            const data = error.response.data;
            if (typeof data === "string") {
                msg = data;
            } else if (data.message) {
                msg = data.message;
            } else if (data.error) {
                msg = data.error;
            }
        }
        throw new Error(msg);
    }
};


// LOGOUT
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
        logError(error);
        let msg = "Something went wrong, please try again later.";
        if (error.response) {
            const data = error.response.data;
            if (typeof data === "string") {
                msg = data;
            } else if (data.message) {
                msg = data.message;
            } else if (data.error) {
                msg = data.error;
            }
        }
        throw new Error(msg);
    }
};


// REGISTER
export const registerUserApi = async (data) => {
    const endpoint = import.meta.env.VITE_AUTH_REGISTER_ENDPOINT;
    try {
        const response = await Interceptor.post(endpoint, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        logError(error);
        let msg = "Something went wrong, please try again later.";
        if (error.response) {
            const data = error.response.data;
            if (typeof data === "string") {
                msg = data;
            } else if (data.message) {
                msg = data.message;
            } else if (data.error) {
                msg = data.error;
            }
        }
        throw new Error(msg);
    }
};
