import { useState, useContext } from "react";
import { fetchMeals } from "../../../services/apiService.js";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx";

const useMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentListEndpoint } = useContext(UserMealsContext);


    const refreshList = async () => {
        try {
            setLoading(true);
            const mealsData = await fetchMeals(currentListEndpoint);
            setMeals(mealsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { meals, loading, error, refreshList };
};

export default useMeals;
