import { useState, useEffect, useContext, useCallback } from "react";
import {
    getAllFoodItemNames,
    searchFoodItemsByName,
    fetchFoodItemsBySource
} from "../services/apiService.js";
import { AuthContext } from "../context/AuthContext.jsx";
import useUserProfile from "../features/profile/utils/hooks/useUserProfile.js";

/**
 * Custom hook to manage food item retrieval and search functionality.
 * Automatically restricts items to the user's foodSource if they are a supermarket user.
 */
const useFoodItems = () => {
    const [options, setOptions] = useState([]);
    const [noResults, setNoResults] = useState([]);

    const { token } = useContext(AuthContext);
    const { userData, isLoading: isUserLoading } = useUserProfile(token);

    const userFoodSource = userData?.foodSource;

    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetches food items.
     * Checks for userData and foodSource before deciding which API to call.
     */
    const fetchAllFoodItems = useCallback(async () => {
        if (isUserLoading) return;

        setIsLoading(true);
        try {
            let data;

            if (userFoodSource) {
                data = await fetchFoodItemsBySource(userFoodSource);
            } else {
                data = await getAllFoodItemNames();
            }

            setOptions(data);
            return data;
        } catch (error) {
            console.error("[useFoodItems] Error fetching food item names:", error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [userFoodSource, isUserLoading]);

    const handleSearch = async (query, index) => {
        if (userFoodSource) return;

        if (query.length > 1) {
            try {
                const data = await searchFoodItemsByName(query);
                const newOptions = [...options];
                const newNoResults = [...noResults];
                newNoResults[index] = data.length === 0;
                newOptions[index] = data;
                setOptions(newOptions);
                setNoResults(newNoResults);
            } catch (error) {
                console.error("[useFoodItems] Search error:", error);
            }
        } else {
            await fetchAllFoodItems();
        }
    };

    useEffect(() => {
        if (isUserLoading) return;

        fetchAllFoodItems();
    }, [isUserLoading, userFoodSource]);

    return {
        options,
        noResults,
        handleSearch,
        refetch: fetchAllFoodItems,
        isUserLoading,
        isLoading
    };
};

export default useFoodItems;