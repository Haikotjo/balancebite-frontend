import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import {Alert, Button} from "@mui/material";
import useFoodItems from "../../hooks/useFoodItems.js";
import {useState} from "react";
import CustomBox from "../layout/CustomBox.jsx";
import useDeleteFoodItem from "../../hooks/useDeleteFoodItem.js";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

const DeleteFoodItemForm = () => {
    const { options, refetch } = useFoodItems();
    const [selectedItem, setSelectedItem] = useState(null);

    const { successMessage, deleteFoodItem, setSuccessMessage } = useDeleteFoodItem(refetch);

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth">
            <CustomFloatingSelect
                label="Select Food Item to Delete"
                placeholder="Select Food Item to Delete"
                options={options.map(item => ({
                    value: item.id.toString(),
                    label: item.name,
                }))}
                value={selectedItem}
                onChange={(selected) => setSelectedItem(selected)}
            />

            <CustomButton
                type="button"
                disabled={!selectedItem}
                onClick={() => deleteFoodItem(selectedItem.value)}
                className="text-sm px-4 py-2 text-white bg-red-600 rounded-md mb-5 mt-2 hover:bg-red-700"
            >
                Delete Food Item
            </CustomButton>

            <ErrorDialog
                open={!!successMessage}  // Shows the dialog if a success message exists
                onClose={() => setSuccessMessage("")}  // Close dialog and reset success message
                message={successMessage}  // Show the success message
                type="success"  // Type is success for green success icon and message
            />
        </CustomBox>
    );
};

export default DeleteFoodItemForm;
