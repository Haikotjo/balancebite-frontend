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
    const [dailyRdiList, setDailyRdiList] = useState(null);

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
        const controller = new AbortController();

        const loadDailyRdi = async () => {
            const today = new Date();

            const promises = Array.from({ length: 7 }, (_, i) => {
                const date = subDays(today, i + 1);
                const formattedDate = format(date, "yyyy-MM-dd");

                return fetchDailyRdiByDate(formattedDate)
                    .then(data => data ? { date: formattedDate, data } : null)
                    .catch(() => {
                        // Fail silently for 404s to allow other dates to resolve
                        console.warn(`No data found for ${formattedDate}`);
                        return null;
                    });
            });

            const results = await Promise.all(promises);
            if (!controller.signal.aborted) {
                setDailyRdiList(results.filter(Boolean).reverse());
            }
        };

        if (token) {
            void loadDailyRdi();
        } else {
            setDailyRdiList([]);
        }

        return () => controller.abort();
    }, [token, fetchDailyRdiByDate]);

    return {
        recommendedNutrition,
        baseNutrition,
        weeklyRdi,
        monthlyRdi,
        dailyRdiList
    };
};