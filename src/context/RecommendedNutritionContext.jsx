import { createContext, useState, useEffect, useContext, useCallback } from "react";
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

    /**
     * Fetch recommended nutrition settings for the user
     */
    const fetchRecommendedNutrition = useCallback(async () => {
        try {
            const data = await fetchRecommendedNutritionApi(token);
            if (data) setRecommendedNutrition(data);
        } catch (error) {
            console.error("Error fetching recommended nutrition:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Fetch base nutrition goals/limits
     */
    const fetchBaseNutrition = useCallback(async () => {
        try {
            const data = await fetchBaseNutritionApi(token);
            if (data) setBaseNutrition(data);
        } catch (error) {
            console.error("Error fetching base nutrition:", error);
        }
    }, [token]);

    /**
     * Fetch specific daily RDI data by date string
     */
    const fetchDailyRdiByDate = useCallback(async (date) => {
        if (!user?.id) return null;
        try {
            const data = await fetchDailyRdiByDateApi(user.id, date);
            return data || null;
        } catch (error) {
            console.error("Error fetching daily RDI by date:", error);
            return null;
        }
    }, [user?.id]);

    /**
     * Fetch aggregated weekly RDI data
     */
    const fetchWeeklyRdi = useCallback(async () => {
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
    }, [user?.id]);

    /**
     * Fetch aggregated monthly RDI data
     */
    const fetchMonthlyRdi = useCallback(async () => {
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
    }, [user?.id]);

    // Initial data load on login
    useEffect(() => {
        if (token) {
            void fetchRecommendedNutrition();
            void fetchBaseNutrition();
            void fetchWeeklyRdi();
            void fetchMonthlyRdi();
        } else {
            setLoading(false);
        }
    }, [token, fetchRecommendedNutrition, fetchBaseNutrition, fetchWeeklyRdi, fetchMonthlyRdi]);

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