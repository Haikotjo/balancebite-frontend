import { useContext, useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

export const useDashboardData = () => {
    const {
        recommendedNutrition,
        baseNutrition,
        setRecommendedNutrition,
        weeklyRdi,
        monthlyRdi,
        fetchWeeklyRdi,
        fetchMonthlyRdi,
        fetchDailyRdiByDate
    } = useContext(RecommendedNutritionContext);

    const { token } = useContext(AuthContext);
    const [dailyRdiList, setDailyRdiList] = useState([]);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        } else {
            const userId = JSON.parse(atob(token.split(".")[1])).sub;
            fetchWeeklyRdi(userId);
            fetchMonthlyRdi(userId);
        }
    }, [token, setRecommendedNutrition, fetchWeeklyRdi, fetchMonthlyRdi]);

    useEffect(() => {
        const loadDailyRdi = async () => {
            const today = new Date();
            const days = [];
            for (let i = 1; i <= 7; i++) {
                const date = subDays(today, i);
                const formattedDate = format(date, "yyyy-MM-dd");
                const data = await fetchDailyRdiByDate(formattedDate);
                if (data) days.push({ date: formattedDate, data });
            }
            setDailyRdiList(days.reverse());
        };

        if (token) loadDailyRdi().catch(console.error);
    }, [token, fetchDailyRdiByDate]);

    return { recommendedNutrition, baseNutrition, weeklyRdi, monthlyRdi, dailyRdiList };
};