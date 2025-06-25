import { useState, useEffect } from "react";
import {getAccessToken} from "../../../../utils/helpers/getAccessToken.js";
import {deleteMealApi, getAllMealsApi} from "../../../../services/apiService.js";
import {handleApiError} from "../../../../utils/helpers/handleApiError.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

const DeleteMealForm = () => {
    const [meals, setMeals] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch meals
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllMealsApi(token);
                const options = response.map(meal => {
                    const createdBy = meal.createdBy?.userName ?? 'unknown';
                    const adjustedBy = meal.adjustedBy?.userName;
                    const ownerPart = adjustedBy ? `, Owned by: ${adjustedBy}` : '';
                    return {
                        value: meal.id.toString(),
                        label: `${meal.name} (ID: ${meal.id}, Created by: ${createdBy}${ownerPart})`,
                    };
                });
                setMeals(options);
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchMeals();
    }, []);

    const handleDelete = async () => {
        try {
            const token = getAccessToken();
            await deleteMealApi(selectedMeal.value, token);
            setSuccessMessage(`Meal "${selectedMeal.label}" deleted.`);
            setSelectedMeal(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth">
            <CustomFloatingSelect
                label="Select Meal to Delete"
                placeholder="Select Meal to Delete"
                options={meals}
                value={selectedMeal}
                onChange={(selected) => setSelectedMeal(selected)}
            />

            <CustomButton
                type="button"
                disabled={!selectedMeal}
                onClick={handleDelete}
                className="text-sm px-4 py-2 text-white bg-red-600 rounded-md mb-5 mt-2 hover:bg-red-700"
            >
                Delete Meal
            </CustomButton>

            <ErrorDialog
                open={!!successMessage}
                onClose={() => setSuccessMessage("")}
                message={successMessage}
                type="success"
            />
        </CustomBox>
    );
};

export default DeleteMealForm;
