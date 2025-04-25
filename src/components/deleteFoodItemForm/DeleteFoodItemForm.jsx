import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import useFoodItems from "../../hooks/useFoodItems.js";
import { useState } from "react";
import CustomBox from "../layout/CustomBox.jsx";
import useDeleteFoodItem from "../../hooks/useDeleteFoodItem.js";
import CustomButton from "../layout/CustomButton.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

/**
 * Component to handle deletion of a food item.
 * Allows the user to select an item and delete it.
 * Displays a success dialog upon successful deletion.
 */
const DeleteFoodItemForm = () => {
    // Fetch available food items and refetch data after deletion
    const { options, refetch } = useFoodItems();

    // State for the selected food item to delete
    const [selectedItem, setSelectedItem] = useState(null);

    // Hook for deleting food item and handling success messages
    const { successMessage, deleteFoodItem, setSuccessMessage } = useDeleteFoodItem(refetch);

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-2 mt-4 mb-12 sm:mb-4 scroll-smooth">
            {/* Dropdown to select food item to delete */}
            <CustomFloatingSelect
                label="Select Food Item to Delete"
                placeholder="Select Food Item to Delete"
                options={options.map(item => ({
                    value: item.id.toString(),
                    label: item.name,
                }))}
                value={selectedItem}
                onChange={(selected) => setSelectedItem(selected)} // Update selected item
            />

            {/* Button to delete the selected food item */}
            <CustomButton
                type="button"
                disabled={!selectedItem} // Disable button if no item is selected
                onClick={() => deleteFoodItem(selectedItem.value)} // Trigger delete action
                className="text-sm px-4 py-2 text-white bg-red-600 rounded-md mb-5 mt-2 hover:bg-red-700"
            >
                Delete Food Item
            </CustomButton>

            {/* Success dialog that appears when a food item is successfully deleted */}
            <ErrorDialog
                open={!!successMessage} // Show dialog if success message is set
                onClose={() => setSuccessMessage("")} // Close dialog and reset success message
                message={successMessage} // Display the success message
                type="success" // Use green color for success message
            />
        </CustomBox>
    );
};

export default DeleteFoodItemForm;
