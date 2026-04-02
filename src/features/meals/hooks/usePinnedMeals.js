import { useState, useEffect } from "react";
import { getStickyItems } from "../../../services/apiService.js";
import fetchStickyItemDetails from "../../../utils/helpers/fetchStickyItemDetails.js";

export default function usePinnedMeals(activeOption, filters, sortBy) {
    const [pinnedMeals, setPinnedMeals] = useState([]);

    useEffect(() => {
        if (activeOption !== "All Meals" || Object.keys(filters).length || sortBy) {
            setPinnedMeals([]);
            return;
        }

        let cancelled = false;

        const load = async () => {
            try {
                const sticky = await getStickyItems();
                const { meals } = await fetchStickyItemDetails(sticky);
                if (!cancelled) setPinnedMeals(meals.length ? [meals[0]] : []);
            } catch {
                if (!cancelled) setPinnedMeals([]);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [activeOption, filters, sortBy]);

    return pinnedMeals;
}
