import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {fetchRecommendedNutritionApi} from "../services/apiService.js";

export const RecommendedNutritionContext = createContext();

export const RecommendedNutritionProvider = ({ children }) => {
    const [recommendedNutrition, setRecommendedNutrition] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchRecommendedNutrition = async () => {
        try {
            const data = await fetchRecommendedNutritionApi(token);
            if (data) {
                setRecommendedNutrition(data);
            } else {
                console.warn("No recommended nutrition data received.");
            }
        } catch (error) {
            console.error("Error fetching recommended nutrition:", error);
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
    }, [token]);

    const value = {
        recommendedNutrition,
        setRecommendedNutrition,
        loading,
        fetchRecommendedNutrition,
        refetchRecommendedNutrition: fetchRecommendedNutrition,
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
