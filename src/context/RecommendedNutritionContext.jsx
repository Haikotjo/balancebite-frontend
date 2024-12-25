import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import Interceptor from "../services/authInterceptor.js";

export const RecommendedNutritionContext = createContext();

export const RecommendedNutritionProvider = ({ children }) => {
    const [recommendedNutrition, setRecommendedNutrition] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext); // Haal de token uit de context

    const fetchRecommendedNutrition = async () => {
        try {
            console.log("Fetching recommended nutrition...");
            const response = await Interceptor.get("/daily-intake/user");
            if (response && response.data) {
                console.log("Recommended nutrition fetched successfully:", response.data);
                setRecommendedNutrition(response.data); // Hiermee wordt `createdAtFormatted` doorgegeven
            } else {
                console.warn("No data received for recommended nutrition.");
            }
        } catch (error) {
            console.error("Error fetching recommended nutrition:", error);
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecommendedNutrition();
        } else {
            console.warn("No token available. Skipping nutrition fetch.");
            setLoading(false);
        }
    }, [token]); // Alleen fetchen als de token beschikbaar is

    const value = {
        recommendedNutrition,
        setRecommendedNutrition,
        loading,
        fetchRecommendedNutrition, // Hier toegevoegd
    };

    return (
        <RecommendedNutritionContext.Provider value={value}>
            {children}
        </RecommendedNutritionContext.Provider>
    );
};

RecommendedNutritionProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
