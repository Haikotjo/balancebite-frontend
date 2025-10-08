import { useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import useFoodItems from "../../../../hooks/useFoodItems.js";
import UpdateFoodItemForm from "../updateFooditemForm/UpdateFoodItemForm.jsx";

/**
 * UpdateFoodItemPicker
 * - Select a FoodItem first
 * - When selected, renders UpdateFoodItemForm for that item
 */
const UpdateFoodItemPicker = () => {
    const { options } = useFoodItems();
    const [selected, setSelected] = useState(null);

    return (
        <CustomBox className="w-full mx-auto p-2 flex flex-col gap-3 mt-4 mb-12 sm:mb-4">
            <CustomFloatingSelect
                label="Select Food Item to Update"
                placeholder="Select Food Item to Update"
                options={options.map((it) => ({ value: it.id.toString(), label: it.name }))}
                value={selected}
                onChange={setSelected}
            />

            {selected ? (
                <UpdateFoodItemForm foodItemId={selected.value} key={selected.value} />
            ) : (
                <CustomTypography className="text-sm text-gray-500">
                    Select a food item to load the update form.
                </CustomTypography>
            )}
        </CustomBox>
    );
};

export default UpdateFoodItemPicker;
