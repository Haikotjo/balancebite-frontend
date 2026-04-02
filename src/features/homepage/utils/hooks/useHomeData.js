import { useEffect, useState } from "react";
import Interceptor from "../../../../services/authInterceptor.js";
import fetchStickyItemDetails from "../../../../utils/helpers/fetchStickyItemDetails.js";
import {getAllStickyItems} from "../../../../services/apiService.js";

/**
 * Custom hook for homepage data
 */
export default function useHomeData({ applyUserCopies, userMeals, fetchDietsData }) {
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [highProteinMeals, setHighProteinMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [stickyItems, setStickyItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMealsByQuery = async (query) => {
            const token = localStorage.getItem("accessToken");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await Interceptor.get(
                `${import.meta.env.VITE_BASE_URL}/meals?${query}`,
                { headers }
            );
            return response?.data?.content || [];
        };

        const loadHomePageData = async () => {
            setIsLoading(true);

            try {
                const [
                    vegetarianResponse,
                    highProteinResponse,
                    allMealsResponse,
                    rawStickyItems,
                ] = await Promise.all([
                    fetchMealsByQuery("page=0&size=12&diets=VEGETARIAN&includeUserCopies=false"),
                    fetchMealsByQuery("page=0&size=12&diets=HIGH_PROTEIN&includeUserCopies=false"),
                    fetchMealsByQuery("page=0&size=18&includeUserCopies=false"),
                    getAllStickyItems(),
                ]);

                const { meals, diets: stickyDiets } =
                    await fetchStickyItemDetails(rawStickyItems || []);

                const enrichedStickyItems = (rawStickyItems || [])
                    .map((item) => {
                        const reference =
                            item.type === "MEAL"
                                ? meals.find((meal) => meal.id === item.referenceId)
                                : stickyDiets.find((diet) => diet.id === item.referenceId);

                        return { ...item, reference };
                    })
                    .filter((item) => item.reference);

                if (controller.signal.aborted) return;
                setStickyItems(enrichedStickyItems);
                setVegetarianMeals(vegetarianResponse.slice(0, 12));
                setHighProteinMeals(highProteinResponse.slice(0, 12));
                setAllMeals(allMealsResponse.slice(0, 18));

                await fetchDietsData();
            } catch (error) {
                console.error("Failed to load homepage data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHomePageData();

        return () => controller.abort();
    }, [applyUserCopies, fetchDietsData, userMeals]);

    return {
        vegetarianMeals,
        highProteinMeals,
        allMeals,
        stickyItems,
        isLoading,
    };
}