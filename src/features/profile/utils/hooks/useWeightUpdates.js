import {updateTargetWeightOnly, updateWeightOnly} from "../../../../services/apiService.js";


export const useWeightUpdates = (refetch) => {
    const handleWeightUpdate = async (newValue, currentWeight) => {
        const num = Number(newValue);
        if (!newValue || num === currentWeight) return;

        try {
            await updateWeightOnly({ weight: num });
            if (refetch) await refetch();
            return { success: true };
        } catch (e) {
            console.error("Weight update failed:", e);
            return { success: false, error: e };
        }
    };

    const handleTargetUpdate = async (newValue, currentTarget) => {
        const num = Number(newValue);
        if (!newValue || num === currentTarget) return;

        try {
            await updateTargetWeightOnly({ targetWeight: num });
            if (refetch) await refetch();
            return { success: true };
        } catch (e) {
            console.error("Target update failed:", e);
            return { success: false, error: e };
        }
    };

    return { handleWeightUpdate, handleTargetUpdate };
};