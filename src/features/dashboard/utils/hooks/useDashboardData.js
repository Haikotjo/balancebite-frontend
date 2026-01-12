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

    /**
     * Effect: Fetch general RDI data (weekly/monthly) when token changes.
     * Resets nutrition data if no token is present.
     */
    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        } else {
            try {
                const userId = JSON.parse(atob(token.split(".")[1])).sub;
                fetchWeeklyRdi(userId);
                fetchMonthlyRdi(userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [token, fetchWeeklyRdi, fetchMonthlyRdi, setRecommendedNutrition]);

    /**
     * Effect: Fetch daily RDI records for the past 7 days.
     * Updates the dailyRdiList state once all requests are processed.
     */
    useEffect(() => {
        const loadDailyRdi = async () => {
            const today = new Date();
            const days = [];

            for (let i = 1; i <= 7; i++) {
                const date = subDays(today, i);
                const formattedDate = format(date, "yyyy-MM-dd");

                try {
                    const data = await fetchDailyRdiByDate(formattedDate);
                    if (data) {
                        days.push({ date: formattedDate, data });
                    }
                } catch {
                    // Fail silently for 404s to allow the loop to continue for other dates
                    console.warn(`No data found for ${formattedDate}`);
                }
            }

            setDailyRdiList(days.reverse());
        };

        if (token) {
            // Void operator or calling then() handles the floating promise warning
            void loadDailyRdi();
        } else {
            setDailyRdiList([]);
        }
    }, [token, fetchDailyRdiByDate]);

    return {
        recommendedNutrition,
        baseNutrition,
        weeklyRdi,
        monthlyRdi,
        dailyRdiList
    };
};