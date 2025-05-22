import {useContext, useState} from "react";
import {updateDietPlanApi} from "../../../../services/apiService.js";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";

export const useUpdateDiet = (dietId, onSuccess) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { replaceDietInDiets } = useContext(UserDietsContext);

    const handleUpdate = async (formData) => {
        setLoading(true);
        setError("");
        try {
            const updatedDiet = await updateDietPlanApi(dietId, formData);
            replaceDietInDiets(dietId, updatedDiet);
            onSuccess?.();
        } catch (err) {
            console.error("Fout bij updaten dieet:", err);
            setError("Failed to update diet plan.");
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdate, loading, error };
};
