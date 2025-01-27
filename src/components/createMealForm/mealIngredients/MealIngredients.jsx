import { Box, Typography, IconButton, Autocomplete, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";
import TextFieldCreateMeal from "./textFieldCreateMeal/TextFieldCreateMeal.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options, handleSearch } = useFoodItems();

    // Haal de theme op, en check of het scherm ‘sm’ of kleiner is:
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const isAddDisabled = value.filter((item) => item.foodItemId !== "").length < 2;

    // Event-handler om de quantity te updaten:
    const handleQuantityChange = (newVal, index) => {
        const newIngredients = [...value];
        newIngredients[index].quantity = newVal === "" ? "" : Math.max(0, Number(newVal));
        onChange(newIngredients);
    };

    return (
        <Box sx={{ maxWidth: "600px" }}>
            {/*<Typography sx={{ fontSize: "1.2rem", color: "text.secondary", fontWeight: "normal" }}>*/}
            {/*    Ingredients*/}
            {/*</Typography>*/}

            {value.map((ingredient, index) => (
                <Box
                    key={index}
                    display="flex"
                    gap={1}
                    alignItems="center"
                    sx={{
                        flexWrap: "nowrap",
                        mb: 1,
                        "@media (max-width:600px)": { flexWrap: "wrap" },
                    }}
                >
                    {/* Autocomplete for searching food items by name */}
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option.name}
                        onInputChange={(event, newInputValue) => handleSearch(newInputValue)}
                        value={options.find((item) => item.id === ingredient.foodItemId) || null}
                        onChange={(event, newValue) => {
                            const newIngredients = [...value];
                            newIngredients[index].foodItemId = newValue ? newValue.id : "";
                            onChange(newIngredients);
                        }}
                        renderInput={(params) => (
                            <TextFieldCreateMeal
                                {...params}
                                label="Ingredient"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    flex: 3,
                                    minWidth: { xs: "50%", sm: "60%" },
                                    "& .MuiInputBase-input": {
                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                    },
                                }}
                            />
                        )}
                        sx={{ flex: 3, minWidth: { xs: "50%", sm: "70%" }, marginTop: 1 }}
                    />

                    <TextFieldCreateMeal
                        label={isSmallScreen ? "(grams)" : "Quantity (g)"}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={ingredient.quantity === 0 ? "" : ingredient.quantity.toString()}
                        onChange={(e) => handleQuantityChange(e.target.value, index)}
                        onBlur={() => {
                            if (ingredient.quantity === "" || ingredient.quantity === null) {
                                handleQuantityChange(0, index);
                            }
                        }}
                        error={errors?.[index]?.quantity}
                        helperText={errors?.[index]?.quantity?.message || ""}
                        InputLabelProps={{ shrink: true }}
                        slotProps={{ input: { min: 0 } }}
                        sx={{
                            flex: 1,
                        }}
                    />

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
                        if (!isAddDisabled) {
                            onChange([...value, { foodItemId: "", quantity: 0 }]);
                        }
                    }}
                >
                    {isAddDisabled ? "Add two or more ingredients" : "Click to add more ingredients"}
                </Typography>

                <IconButton
                    aria-label="add ingredient"
                    color="primary"
                    disabled={isAddDisabled}
                    onClick={() => {
                        if (!isAddDisabled) {
                            onChange([...value, { foodItemId: "", quantity: 0 }]);
                        }
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
            foodItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            foodItemId: PropTypes.shape({
                message: PropTypes.string,
            }),
            quantity: PropTypes.shape({
                message: PropTypes.string,
            }),
        })
    ),
};

export default MealIngredients;
