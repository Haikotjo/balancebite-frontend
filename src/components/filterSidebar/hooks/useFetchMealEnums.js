import { useState, useEffect } from "react";
import {fetchMealEnums} from "../../../services/apiService.js";


const useFetchMealEnums = (isOpen) => {
    const [diets, setDiets] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [mealTypes, setMealTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchMealEnums()
                .then(response => {
                    setDiets(response.diets || []);
                    setCuisines(response.cuisines || []);
                    setMealTypes(response.mealTypes || []);
                })
                .catch(error => {
                    console.error("Error fetching enums:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    return { diets, cuisines, mealTypes, loading };
};

export default useFetchMealEnums;
