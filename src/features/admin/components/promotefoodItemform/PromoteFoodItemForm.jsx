import { useState } from "react";
import { getAccessToken } from "../../../../utils/helpers/getAccessToken.js";
import useFoodItems from "../../../../hooks/useFoodItems.js";


import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import {createPromotionApi} from "../../../../services/apiService.js";

const PromoteFoodItemForm = () => {
    const token = getAccessToken();
    const { options } = useFoodItems();

    const [foodItemId, setFoodItemId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!foodItemId || !startDate) {
            setErrorMessage("Please select a food item and a start date.");
            return;
        }

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const input = {
                foodItemId: Number(foodItemId),
                startDate: `${startDate}T00:00:00`,
            };
            await createPromotionApi (input, token);
            setSuccessMessage("Promotion created successfully.");
            setFoodItemId("");
            setStartDate("");
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to create promotion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CustomBox className="flex flex-col gap-4">
                <CustomFloatingSelect
                    label="Select Food Item"
                    options={options.map((item) => ({
                        value: item.id,
                        label: `${item.name} (ID: ${item.id})`,
                    }))}
                    value={options.find((opt) => opt.id === foodItemId) || null}
                    onChange={(val) => setFoodItemId(val?.value || "")}
                />

                <label className="text-sm font-semibold">
                    Start Date
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                </label>

                <CustomButton
                    type="submit"
                    disabled={loading}
                    className="text-sm px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 mt-2"
                >
                    {loading ? "Creating..." : "Promote Food Item"}
                </CustomButton>

                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
                <ErrorDialog
                    open={!!errorMessage}
                    onClose={() => setErrorMessage("")}
                    message={errorMessage}
                    type="error"
                />
            </CustomBox>
        </form>
    );
};

export default PromoteFoodItemForm;
