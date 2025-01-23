import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchRecommendedNutritionApi, fetchBaseNutritionApi } from "../services/apiService.js";

export const RecommendedNutritionContext = createContext();

export const RecommendedNutritionProvider = ({ children }) => {
    const [recommendedNutrition, setRecommendedNutrition] = useState(null);
    const [baseNutrition, setBaseNutrition] = useState(null);
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

    const fetchBaseNutrition = async () => {
        try {
            const data = await fetchBaseNutritionApi(token);
            if (data) {
                setBaseNutrition(data);
            } else {
                console.warn("No base nutrition data received.");
            }
        } catch (error) {
            console.error("Error fetching base nutrition:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecommendedNutrition();
            fetchBaseNutrition();
        } else {
            console.warn("No token available. Skipping nutrition fetch.");
            setLoading(false);
        }
    }, [token]);

    const calculateConsumedNutrition = () => {
        if (!baseNutrition || !recommendedNutrition) return null;

        return baseNutrition.nutrients.map((baseNutrient) => {
            const consumedValue = baseNutrient.value - (recommendedNutrition.nutrients.find(n => n.name === baseNutrient.name)?.value || 0);
            return {
                name: baseNutrient.name,
                consumed: consumedValue > 0 ? consumedValue : 0
            };
        });
    };

    const value = {
        recommendedNutrition,
        setRecommendedNutrition,
        baseNutrition,
        consumedNutrition: calculateConsumedNutrition(),
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
