import { useEffect, useState, useContext } from "react";
import {fetchMeals} from "../../../services/apiService.js";
import {UserMealsContext} from "../../../context/UserMealsContext.jsx";


const useMeals = (setCreatedByName, sortBy) => {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentListEndpoint } = useContext(UserMealsContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                let endpoint = currentListEndpoint;

                if (sortBy) {
                    endpoint = `${import.meta.env.VITE_BASE_URL}/meals/sorted?sortField=${encodeURIComponent(sortBy)}&sortOrder=desc`;
                }


                const mealsData = await fetchMeals(endpoint);
                setMeals(mealsData);
                setFilteredMeals(mealsData);

                if (mealsData.length > 0 && setCreatedByName) {
                    setCreatedByName(mealsData[0]?.createdBy?.userName || "Unknown User");
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().catch(console.error);
    }, [currentListEndpoint, setCreatedByName, sortBy]);

    const refreshList = async () => {
        try {
            setLoading(true);

            let endpoint = currentListEndpoint;

            if (sortBy) {
                endpoint = `${import.meta.env.VITE_BASE_URL}/meals/sorted?sortField=${encodeURIComponent(sortBy)}&sortOrder=desc`;
            }

            const mealsData = await fetchMeals(endpoint);
            setMeals(mealsData);
            setFilteredMeals(mealsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { meals, filteredMeals, setFilteredMeals, loading, error, refreshList };
};

export default useMeals;
