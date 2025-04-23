import { useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";
import CustomFloatingSelect from "../../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";
import FloatingLabelQuantityField from "../../floatingLabelQuantityField/FloatingLabelQuantityField.jsx";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import { PlusCircle } from "lucide-react";
import CustomIconButton from "../../layout/CustomIconButton.jsx";

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
const MealIngredients = ({ value, onChange }) => {
    const { options } = useFoodItems();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

    return (
        <CustomBox className="max-w-[600px]">
            {value.map((ingredient, index) => (
                <CustomBox
                    key={index}
                    className="flex gap-1 items-center flex-nowrap mb-1"
                >
                    {/* Ingredient select dropdown */}
                    <CustomBox className={isSmallScreen ? "flex-[2]" : "flex-[3]"}>
                        <CustomFloatingSelect
                            label="Ingredient"
                            options={ingredientOptions}
                            value={
                                ingredientOptions.find(
                                    (opt) => opt.value === ingredient.foodItemId
                                ) || null
                            }
                            onChange={(selected) => handleIngredientChange(index, selected)}
                        />
                    </CustomBox>

                    {/* Quantity input */}
                    <CustomBox className="flex-1">
                        <FloatingLabelQuantityField
                            label="Quantity (g)"
                            value={
                                ingredient.quantity === 0 ? "" : ingredient.quantity.toString()
                            }
                            onChange={(e) => handleQuantityChange(e.target.value, index)}
                        />
                    </CustomBox>

                    {/* Remove button */}
                    <RemoveFoodItemButton
                        value={value}
                        index={index}
                        onRemove={(i) => {
                            const newIngredients = value.filter((_, idx) => idx !== i);
                            onChange(newIngredients);
                        }}
                    />
                </CustomBox>
            ))}

            {/* Add new ingredient */}
            <CustomBox className="flex flex-col items-center justify-center gap-[0.25rem] mt-1">
                <CustomTypography
                    as="p"
                    variant="small"
                    className="cursor-pointer"
                    onClick={() => {
                        onChange([...value, { foodItemId: "", quantity: 0 }]);
                    }}
                >
                    {value.filter((item) => item.foodItemId !== "").length < 1
                        ? "Add at least one ingredient"
                        : "Click to add more ingredients"}
                </CustomTypography>

                <CustomIconButton
                    icon={<PlusCircle size={20} className="text-primary" />}
                    onClick={() => {
                        onChange([...value, { foodItemId: "", quantity: 0 }]);
                    }}
                    bgColor="bg-transparent"
                    disableScale
                    className={
                        value.filter((item) => item.foodItemId !== "").length < 1
                            ? "opacity-50 pointer-events-none"
                            : ""
                    }
                />
            </CustomBox>
        </CustomBox>
    );
};

MealIngredients.propTypes = {
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

export default MealIngredients;
