import { useState, useEffect } from "react";
import { getAllFoodItems, searchFoodItemsByName } from "../services/apiService.js";

const useFoodItems = () => {
    const [options, setOptions] = useState([]);
    const [noResults, setNoResults] = useState([]);

    const fetchAllFoodItems = async () => {
        try {
            const data = await getAllFoodItems();
            setOptions(data);
            return data;
        } catch (error) {
            console.error("Error fetching all food items:", error);
            return [];
        }
    };

    const handleSearch = async (query, index) => {
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
                console.error("Error fetching food items:", error);
            }
        } else {
            const allItems = await fetchAllFoodItems();
            const newOptions = [...options];
            const newNoResults = [...noResults];
            newOptions[index] = allItems;
            newNoResults[index] = false;
            setOptions(newOptions);
            setNoResults(newNoResults);
        }
    };

    useEffect(() => {
        fetchAllFoodItems();
    }, []);

    return { options, noResults, handleSearch };
};

export default useFoodItems;
