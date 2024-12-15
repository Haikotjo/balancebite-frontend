import { Box, TextField, Typography, IconButton, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options, noResults, handleSearch } = useFoodItems();

    return (
        <Box>
            <Typography sx={{ fontWeight: "bold" }}>Ingredients</Typography>

            {value.map((ingredient, index) => (
                <Box
                    key={index}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    sx={{
                        flexWrap: "wrap",
                        mb: 1,
                        "@media (max-width:600px)": { flexDirection: "column" },
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
                            <TextField
                                {...params}
                                label="Search Food Item by Name"
                            />
                        )}
                        slotProps={{
                            listbox: {
                                sx: {
                                    backgroundColor: "#e3f2fd",
                                    borderRadius: "5px",
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "0.9rem",
                                    '& .MuiAutocomplete-option:hover': {
                                        backgroundColor: "#ffffff",
                                        color: "#04aa9c",
                                    },
                                },
                            },
                    }}
                        sx={{ flex: 2, minWidth: "60%", marginTop: 1 }}
                    />

                    <TextField
                        label="Quantity (grams) (Search Field)"
                        value={ingredient.quantity}
                        onChange={(e) => {
                            const newIngredients = [...value];
                            newIngredients[index].quantity = Math.max(0, e.target.value);
                            onChange(newIngredients);
                        }}
                        error={!!errors?.[index]?.quantity}
                        helperText={errors?.[index]?.quantity?.message || ""}
                        type="number"
                        slotProps={{ input: { min: 0 } }}
                        sx={{ flex: 1, minWidth: "20%" }}
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

            <IconButton
                onClick={() => onChange([...value, { foodItemId: "", quantity: 0 }])}
                aria-label="add ingredient"
                color="primary"
                sx={{ marginTop: 1 }}
            >
                <AddCircleOutlineRoundedIcon />
            </IconButton>
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
