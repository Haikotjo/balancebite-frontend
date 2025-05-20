import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import {
    addDietPlanToUserApi,
    removeDietFromUserApi
} from "../../../../services/apiService.js";

export const useDietFavorites = () => {
    const { token } = useContext(AuthContext);
    const {
        addDietToUserDiets,
        removeDietFromUserDiets,
        removeDietFromDiets,
        replaceDietInDiets,
    } = useContext(UserDietsContext);

    const addDietToFavorites = async (diet) => {
        console.log("⬅️ Received diet object:", diet);
        if (!diet?.id) throw new Error("No diet ID provided.");

        const response = await addDietPlanToUserApi(diet.id);
        const copiedDiet = response;

        if (!copiedDiet?.originalDietId) throw new Error("Copied diet has no originalDietId");

        replaceDietInDiets(copiedDiet.originalDietId, copiedDiet);
        addDietToUserDiets(copiedDiet);
    };

    const removeDietFromFavorites = async (diet) => {
        await removeDietFromUserApi(diet.id, token);
        removeDietFromUserDiets(diet.id);
        removeDietFromDiets(diet.id);
    };

    return { addDietToFavorites, removeDietFromFavorites };
};

export default useDietFavorites;
