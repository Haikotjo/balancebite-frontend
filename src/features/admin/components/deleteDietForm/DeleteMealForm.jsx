import { useState, useEffect } from "react";
import { getAccessToken } from "../../../../utils/helpers/getAccessToken.js";
import {
    deleteAdminDietPlanApi,
    getAllAdminDietPlansApi
} from "../../../../services/apiService.js";
import { handleApiError } from "../../../../utils/helpers/handleApiError.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";

const DeleteDietPlanForm = () => {
    const [dietPlans, setDietPlans] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchDietPlans = async () => {
            try {
                const token = getAccessToken();
                const response = await getAllAdminDietPlansApi(token);
                const options = response.map(diet => ({
                    value: diet.id.toString(),
                    label: `${diet.name} (Created by: ${diet.creatorName}, Adjusted by: ${diet.adjustedByName})`,
                }));
                setDietPlans(options);
            } catch (error) {
                handleApiError(error);
            }
        };

        fetchDietPlans();
    }, []);

    const handleDelete = async () => {
        try {
            const token = getAccessToken();
            await deleteAdminDietPlanApi(selectedDiet.value, token);
            setSuccessMessage(`Diet plan "${selectedDiet.label}" deleted.`);
            setSelectedDiet(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth">
            <CustomFloatingSelect
                label="Select Diet Plan to Delete"
                placeholder="Select Diet Plan to Delete"
                options={dietPlans}
                value={selectedDiet}
                onChange={(selected) => setSelectedDiet(selected)}
            />

            <CustomButton
                type="button"
                disabled={!selectedDiet}
                onClick={handleDelete}
                className="text-sm px-4 py-2 text-white bg-red-600 rounded-md mb-5 mt-2 hover:bg-red-700"
            >
                Delete Diet Plan
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

export default DeleteDietPlanForm;
