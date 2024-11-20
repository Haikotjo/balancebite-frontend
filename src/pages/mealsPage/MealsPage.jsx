import React from "react";
import MealCard from "../../components/mealCard/MealCard"; // Zorg ervoor dat het pad naar de MealCard klopt

function MealsPage() {
    return (
        <div>
            <h1>This is the Meals page</h1>
            {/* Laad een enkele MealCard met id 1 */}
            <MealCard mealId={6} />
        </div>
    );
}

export default MealsPage;


