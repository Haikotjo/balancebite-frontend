import { Box, TextField, Typography, IconButton, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";
import { useTheme } from "@mui/material/styles";
import TextFieldCreateMeal from "./textFieldCreateMeal/TextFieldCreateMeal.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options, noResults, handleSearch } = useFoodItems();
    const isAddDisabled = value.filter(item => item.foodItemId !== "").length < 2;

    return (
        <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem" } }}>Ingredients</Typography>

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
                                label="Food Item"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" } },
                                    "& .MuiInputLabel-root": { fontSize: { xs: "0.8rem", sm: "1rem" } },
                                }}
                            />

                        )}
                        slotProps={{
                            listbox: {}
                        }}
                        sx={{ flex: 2, minWidth: { xs: "45%", sm: "60%" }, marginTop: 1 }}
                    />


                    <TextFieldCreateMeal
                        label="Quantity (g)"
                        value={ingredient.quantity === 0 ? "" : ingredient.quantity.toString()}
                        onChange={(e) => {
                            const inputValue = e.target.value;

                            const newValue = inputValue === "" ? "" : Math.max(0, Number(inputValue));

                            const newIngredients = [...value];
                            newIngredients[index].quantity = newValue;
                            onChange(newIngredients);
                        }}
                        onBlur={() => {
                            if (ingredient.quantity === "" || ingredient.quantity === null) {
                                const newIngredients = [...value];
                                newIngredients[index].quantity = 0;
                                onChange(newIngredients);
                            }
                        }}
                        error={errors?.[index]?.quantity}
                        helperText={errors?.[index]?.quantity?.message || ""}
                        type="number"
                        slotProps={{ input: { min: 0 } }}
                        sx={{ flex: 1, minWidth: { xs: "35%", sm: "20%" },     "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" } },
                            "& .MuiInputLabel-root": { fontSize: { xs: "0.8rem", sm: "1rem" } }, }}
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
                onClick={() => {
                    if (!isAddDisabled) {
                        onChange([...value, { foodItemId: "", quantity: 0 }]);
                    }
                }}
            >
                <Typography
                    sx={{ fontSize: "0.8rem", color: "text.secondary", cursor: "pointer" }}
                >
                    {isAddDisabled ? "Choose ingredients" : "Click to add more ingredients"}
                </Typography>

                <IconButton
                    aria-label="add ingredient"
                    color="primary"
                    disabled={isAddDisabled}
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
