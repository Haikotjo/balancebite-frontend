import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {
    fetchRecommendedNutritionApi,
    fetchBaseNutritionApi,
    fetchWeeklyRdiApi,
    fetchMonthlyRdiApi,
    fetchDailyRdiByDateApi,
} from "../services/apiService.js";

export const RecommendedNutritionContext = createContext();

export const RecommendedNutritionProvider = ({ children }) => {
    const [recommendedNutrition, setRecommendedNutrition] = useState(null);
    const [baseNutrition, setBaseNutrition] = useState(null);
    const [weeklyRdi, setWeeklyRdi] = useState(null);
    const [monthlyRdi, setMonthlyRdi] = useState(null);
    const [loading, setLoading] = useState(true);

    const { token, user } = useContext(AuthContext);

    const fetchRecommendedNutrition = async () => {
        try {
            const data = await fetchRecommendedNutritionApi(token);
            if (data) setRecommendedNutrition(data);
        } catch (error) {
            console.error("Error fetching recommended nutrition:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBaseNutrition = async () => {
        try {
            const data = await fetchBaseNutritionApi(token);
            if (data) setBaseNutrition(data);
        } catch (error) {
            console.error("Error fetching base nutrition:", error);
        }
    };

    const fetchDailyRdiByDate = async (date) => {
        if (!user?.id) return null;
        try {
            const data = await fetchDailyRdiByDateApi(user.id, date);
            return data || null;
        } catch (error) {
            console.error("Error fetching daily RDI by date:", error);
            return null;
        }
    };

    const fetchWeeklyRdi = async () => {
        if (!user?.id) return;
        try {
            const raw = await fetchWeeklyRdiApi(user.id);
            setWeeklyRdi({
                nutrients: Object.entries(raw || {}).map(([name, value]) => ({ name, value })),
                createdAtFormatted: null,
            });
        } catch (error) {
            console.error("Error fetching weekly RDI:", error);
        }
    };

    const fetchMonthlyRdi = async () => {
        if (!user?.id) return;
        try {
            const raw = await fetchMonthlyRdiApi(user.id);
            setMonthlyRdi({
                nutrients: Object.entries(raw || {}).map(([name, value]) => ({ name, value })),
                createdAtFormatted: null,
            });
        } catch (error) {
            console.error("Error fetching monthly RDI:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchRecommendedNutrition();
            fetchBaseNutrition();
            fetchWeeklyRdi();
            fetchMonthlyRdi();
        } else {
            setLoading(false);
        }
    }, [token]);

    const value = {
        recommendedNutrition,
        baseNutrition,
        weeklyRdi,
        monthlyRdi,
        loading,
        setRecommendedNutrition,
        fetchRecommendedNutrition,
        fetchBaseNutrition,
        fetchWeeklyRdi,
        fetchMonthlyRdi,
        fetchDailyRdiByDate,
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
