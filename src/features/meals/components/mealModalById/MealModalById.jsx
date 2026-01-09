// src/features/meals/components/mealModal/MealModalById.jsx
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Spinner from "../../../../components/layout/Spinner.jsx";
import { fetchMealById } from "../../../../services/apiService.js";
import MealModal from "../mealModal/MealModal.jsx";

const MealModalById = ({ mealId }) => {
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                const fullMeal = await fetchMealById(mealId);
                if (alive) setMeal(fullMeal);
            } catch (e) {
                if (alive) setMeal(null);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => { alive = false; };
    }, [mealId]);

    if (loading) return <Spinner className="mx-auto my-4" />;
    if (!meal) return <div className="p-4 text-sm opacity-70">Meal not found.</div>;

    return <MealModal meal={meal} />;
};

MealModalById.propTypes = {
    mealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default MealModalById;
