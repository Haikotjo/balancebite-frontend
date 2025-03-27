import { Box, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";
import FloatingLabelSelectIngredient from "../../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";
import FloatingLabelQuantityField from "../../floatingLabelQuantityField/FloatingLabelQuantityField.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options } = useFoodItems();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Map food item options to react-select format:
    const ingredientOptions = options.map((item) => ({
        value: item.id.toString(),
        label: item.name,
    }));

    // Handler for ingredient selection:
    const handleIngredientChange = (index, selectedOption) => {
        const newIngredients = [...value];
        newIngredients[index].foodItemId = selectedOption ? selectedOption.value : "";
        onChange(newIngredients);
    };

    // Handler for quantity changes:
    const handleQuantityChange = (newVal, index) => {
        const newIngredients = [...value];
        newIngredients[index].quantity = newVal === "" ? "" : Math.max(0, Number(newVal));
        onChange(newIngredients);
    };

    return (
        <Box sx={{ maxWidth: "600px" }}>
            {value.map((ingredient, index) => (
                <Box
                    key={index}
                    display="flex"
                    gap={1}
                    alignItems="center"
                    sx={{
                        flexWrap: "nowrap", // Zorgt ervoor dat alles op één regel blijft
                        mb: 1,
                    }}
                >
                    {/* Ingredient selector */}
                    <Box sx={{ flex: isSmallScreen ? 2 : 3 }}>
                        <FloatingLabelSelectIngredient
                            label="Ingredient"
                            isMulti={false}
                            options={ingredientOptions}
                            value={
                                ingredientOptions.find(
                                    (opt) => opt.value === ingredient.foodItemId
                                ) || null
                            }
                            onChange={(selected) =>
                                handleIngredientChange(index, selected)
                            }
                        />
                    </Box>

                    {/* Quantity field */}
                    <Box sx={{ flex: 1 }}>
                        <FloatingLabelQuantityField
                            label="Quantity (g)"
                            value={
                                ingredient.quantity === 0 ? "" : ingredient.quantity.toString()
                            }
                            onChange={(e) => handleQuantityChange(e.target.value, index)}
                        />
                    </Box>

                    {/* Remove button */}
                    <RemoveFoodItemButton
                        value={value}
                        index={index}
                        onRemove={(i) => {
                            const newIngredients = value.filter((_, idx) => idx !== i);
                            onChange(newIngredients);
                        }}
                    />
                </Box>
            ))}

            {/* Nieuwe entry-rij voor een ingrediënt */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={0.1}
                sx={{ marginTop: 1 }}
            >
                <Typography
                    sx={{ fontSize: "0.8rem", color: "text.secondary", cursor: "pointer" }}
                    onClick={() => {
                        onChange([...value, { foodItemId: "", quantity: 0 }]);
                    }}
                >
                    {value.filter((item) => item.foodItemId !== "").length < 2
                        ? "Add two or more ingredients"
                        : "Click to add more ingredients"}
                </Typography>

                <IconButton
                    aria-label="add ingredient"
                    color="primary"
                    disabled={value.filter((item) => item.foodItemId !== "").length < 2}
                    onClick={() => {
                        onChange([...value, { foodItemId: "", quantity: 0 }]);
                    }}
                >
                    <AddCircleOutlineRoundedIcon />
                </IconButton>
            </Box>
        </Box>
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
