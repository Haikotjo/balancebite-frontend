import PropTypes from "prop-types";
import useFoodItems from "../../../hooks/useFoodItems.js";

import CustomFloatingSelect from "../../../components/layout/CustomFloatingSelect.jsx";
import CustomFloatingNumberInput from "../../../components/layout/CustomFloatingNumberInput.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import { PlusCircle } from "lucide-react";
import CustomIconButton from "../../../components/layout/CustomIconButton.jsx";
import ButtonRemoveFoodItem from "../../../components/buttonRemoveFooditem/ButtonRemoveFoodItem.jsx";

/**
 * MealIngredients allows users to dynamically add, remove and update
 * ingredient entries when creating or editing a meal.
 *
 * Each entry consists of:
 * - A dropdown to select a food item
 * - A numeric input for quantity (in grams)
 * - A remove button
 *
 * @component
 * @param {Object[]} value - Current list of ingredients
 * @param {Function} onChange - Function to update the ingredients list
 * @param {Object[]} [errors] - Optional validation errors per ingredient
 */
const CreateMealMealIngredients = ({ value, onChange }) => {
    const { options } = useFoodItems();
    const lastItem = value[value.length - 1];
    const disableAdd = !lastItem || lastItem.foodItemId === "";


    // Convert food item options to react-select compatible format
    const ingredientOptions = options.map((item) => ({
        value: item.id.toString(),
        label: item.name,
    }));

    // Handle ingredient selection from dropdown
    const handleIngredientChange = (index, selectedOption) => {
        const newIngredients = [...value];
        newIngredients[index].foodItemId = selectedOption ? selectedOption.value : "";
        onChange(newIngredients);
    };

    // Handle quantity change from input
    const handleQuantityChange = (newVal, index) => {
        const newIngredients = [...value];
        newIngredients[index].quantity = newVal === "" ? "" : Math.max(0, Number(newVal));
        onChange(newIngredients);
    };

    const selectedIds = value.map((item) => item.foodItemId).filter(Boolean);

    const getAvailableOptions = (currentIndex) =>
        ingredientOptions.filter((opt) => {
            const currentId = value[currentIndex]?.foodItemId;
            return !selectedIds.includes(opt.value) || opt.value === currentId;
        });

    return (
        <CustomBox className="max-w-[600px]">
            {value.map((ingredient, index) => (
                <CustomBox
                    key={index}
                    className="flex gap-1 items-center flex-nowrap mb-1"
                >
                    {/* Ingredient select dropdown */}
                    <CustomBox className="flex-[3] sm:flex-[2]">
                        <CustomFloatingSelect
                            label="Ingredient"
                            options={getAvailableOptions(index)}
                            value={
                                ingredientOptions.find(
                                    (opt) => opt.value === ingredient.foodItemId
                                ) || null
                            }
                            onChange={(selected) => handleIngredientChange(index, selected)}
                        />
                    </CustomBox>

                    {/* Quantity input */}
                    <CustomBox className="w-[90px] sm:flex-1">
                        <CustomFloatingNumberInput
                            label="Quantity (g)"
                            value={ingredient.quantity === 0 ? "" : ingredient.quantity.toString()}
                            onChange={(e) => handleQuantityChange(e.target.value, index)}
                        />

                    </CustomBox>

                    {/* Remove button */}
                    {ingredient.foodItemId && (
                        <ButtonRemoveFoodItem
                            value={value}
                            index={index}
                            onRemove={(i) => {
                                const newIngredients = value.filter((_, idx) => idx !== i);
                                onChange(newIngredients);
                            }}
                        />
                    )}
                </CustomBox>
            ))}

            {/* Add new ingredient */}
            <CustomBox className="flex items-center justify-center gap-2 mt-1">
                <CustomTypography
                    as="p"
                    variant="small"
                    className={`cursor-pointer ${disableAdd ? "opacity-50" : ""}`}
                    onClick={() => {
                        if (!disableAdd) {
                            onChange([...value, { foodItemId: "", quantity: 0 }]);
                        }
                    }}
                >
                    {value.length === 0 || value.every((item) => item.foodItemId === "")
                        ? "Add at least one ingredient"
                        : "Click to add more ingredients"}
                </CustomTypography>

                <CustomIconButton
                    icon={<PlusCircle size={20} className="text-primary" />}
                    onClick={() => {
                        if (!disableAdd) {
                            onChange([...value, { foodItemId: "", quantity: 0 }]);
                        }
                    }}
                    bgColor="bg-transparent"
                    disableScale
                    className={disableAdd ? "opacity-50 pointer-events-none" : ""}
                />
            </CustomBox>
        </CustomBox>
    );
};

CreateMealMealIngredients.propTypes = {
    value: PropTypes.arrayOf(
        PropTypes.shape({
            foodItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            foodItemId: PropTypes.shape({ message: PropTypes.string }),
            quantity: PropTypes.shape({ message: PropTypes.string }),
        })
    ),
};

export default CreateMealMealIngredients;
