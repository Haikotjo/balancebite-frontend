import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import {
    addDietPlanToUserApi,
    removeDietFromUserApi
} from "../../../../services/apiService.js";

export const useFavoritesDiets = () => {
    const { token } = useContext(AuthContext);
    const {
        removeDietFromUserDiets,
        addDietToUserDiets,
        removeDietFromDiets,
        replaceDietInDiets,
    } = useContext(UserDietsContext);

    const addDietToFavorites = async (diet) => {
        const response = await addDietPlanToUserApi(diet.id);
        let newDiet = response.diets?.find(d => String(d.originalDietId) === String(diet.id))
            || response.diets?.find(d => String(d.id) === String(diet.id))
            || response;

        if (!newDiet) throw new Error("Diet not found in response.");

        addDietToUserDiets(newDiet);
        replaceDietInDiets(diet.id, newDiet);
    };

    const removeDietFromFavorites = async (diet) => {
        await removeDietFromUserApi(diet.id, token);
        removeDietFromUserDiets(diet.id);
        removeDietFromDiets(diet.id);
    };

    return { addDietToFavorites, removeDietFromFavorites };
};

export default useFavoritesDiets;
