import { Box, TextField, Typography, IconButton, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options, noResults, handleSearch } = useFoodItems();

    return (
        <Box>
            <Typography sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.2rem" } }}>Ingredients</Typography>

            {value.map((ingredient, index) => (
                <Box
                    key={index}
                    display="flex"
                    gap={1} // 📌 Minder ruimte tussen velden
                    alignItems="center"
                    sx={{
                        flexWrap: "nowrap",
                        mb: 1,
                        "@media (max-width:600px)": { flexWrap: "wrap" }, // 📌 Op mobiel wrap als het echt niet past
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
                                label="Food Item"
                                sx={{
                                    "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" } }, // 📌 Kleinere tekst
                                    "& .MuiInputLabel-root": { fontSize: { xs: "0.8rem", sm: "1rem" } }, // 📌 Kleinere labels
                                }}
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
                                        color: "primary",
                                    },
                                },
                            },
                        }}
                        sx={{ flex: 2, minWidth: { xs: "45%", sm: "60%" }, marginTop: 1 }} // 📌 Op mobiel kleinere minWidth
                    />

                    <TextField
                        label="Quantity (g)"
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
                        sx={{
                            flex: 1,
                            minWidth: { xs: "35%", sm: "20%" },
                            "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" } },
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
