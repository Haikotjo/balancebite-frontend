import PropTypes from "prop-types";
import { PlusCircle } from "lucide-react";
import useFoodItems from "../../../../hooks/useFoodItems.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomFloatingNumberInput from "../../../../components/layout/CustomFloatingNumberInput.jsx";
import ButtonRemoveFoodItem from "../../../admin/components/buttonRemoveFooditem/ButtonRemoveFoodItem.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * CreateMealMealIngredients
 * Same behavior, cleaner layout.
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

    // Prevent duplicate ingredient selection (except current row)
    const selectedIds = value.map((item) => item.foodItemId).filter(Boolean);

    const getAvailableOptions = (currentIndex) =>
        ingredientOptions.filter((opt) => {
            const currentId = value[currentIndex]?.foodItemId;
            return !selectedIds.includes(opt.value) || opt.value === currentId;
        });

    const handleAdd = () => {
        if (disableAdd) return;
        onChange([...value, { foodItemId: "", quantity: 0 }]);
    };

    const addLabel =
        value.length === 0 || value.every((item) => item.foodItemId === "")
            ? "Add at least one ingredient"
            : "Click to add more ingredients";

    return (
        <CustomBox className="max-w-[680px] w-full mx-auto">
            {/* List */}
            <CustomBox className="flex flex-col gap-2">
                {value.map((ingredient, index) => (
                    <CustomBox
                        key={index}
                        className="
                            flex items-start gap-2
                            rounded-xl
                            border border-borderDark/30 dark:border-borderLight/20
                            bg-lightBackground/60 dark:bg-darkBackground/40
                            px-2 py-2
                        "
                    >
                        {/* Row index */}
                        <CustomBox className="pt-4 w-6 flex justify-center select-none">
                            <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400">
                                {index + 1}
                            </CustomTypography>
                        </CustomBox>

                        {/* Main inputs */}
                        <CustomBox className="flex-1 flex gap-2 items-start">
                            {/* Ingredient select */}
                            <CustomBox className="flex-[3] sm:flex-[2] min-w-0">
                                <CustomFloatingSelect
                                    label="Ingredient *"
                                    variant="outlined"
                                    options={getAvailableOptions(index)}
                                    value={
                                        ingredientOptions.find((opt) => opt.value === ingredient.foodItemId) || null
                                    }
                                    onChange={(selected) => handleIngredientChange(index, selected)}
                                />
                            </CustomBox>

                            {/* Quantity */}
                            <CustomBox className="w-[110px] sm:w-[140px]">
                                <CustomFloatingNumberInput
                                    label="Quantity"
                                    variant="outlined"
                                    value={ingredient.quantity === 0 ? "" : ingredient.quantity.toString()}
                                    onChange={(e) => handleQuantityChange(e.target.value, index)}
                                    suffix="(g)"
                                    showSuffix
                                />
                            </CustomBox>
                        </CustomBox>

                        {/* Remove */}
                        <CustomBox className="pt-4">
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
                    </CustomBox>
                ))}
            </CustomBox>

            {/* Add */}
            <CustomBox className="flex items-center justify-center gap-2 mt-3">
                <CustomTypography
                    as="p"
                    variant="small"
                    className={`cursor-pointer select-none ${disableAdd ? "opacity-50" : ""}`}
                    onClick={handleAdd}
                >
                    {addLabel}
                </CustomTypography>

                <CustomIconButton
                    icon={<PlusCircle size={20} className="text-primary" />}
                    onClick={handleAdd}
                    bgColor="bg-transparent"
                    disableScale
                    className={disableAdd ? "opacity-50 pointer-events-none" : ""}
                    ariaLabel="Add ingredient"
                />
            </CustomBox>
        </CustomBox>
    );
};

CreateMealMealIngredients.propTypes = {
    value: PropTypes.arrayOf(
        PropTypes.shape({
            foodItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
