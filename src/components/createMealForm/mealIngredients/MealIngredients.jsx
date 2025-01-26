import { Box, Typography, IconButton, Autocomplete, Select, MenuItem, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import useFoodItems from "../../../hooks/useFoodItems.js";
import RemoveFoodItemButton from "./removeFooditemButton/RemoveFoodItemButton.jsx";
import TextFieldCreateMeal from "./textFieldCreateMeal/TextFieldCreateMeal.jsx";

const MealIngredients = ({ value, onChange, errors }) => {
    const { options, handleSearch } = useFoodItems();
    const isMobile = useMediaQuery("(max-width:768px)"); // ✅ Detecteer mobiel
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
                        slotProps={{ listbox: {} }}
                        sx={{ flex: 2, minWidth: { xs: "45%", sm: "60%" }, marginTop: 1 }}
                    />

                    {isMobile ? (
                        <Select
                            value={ingredient.quantity}
                            onChange={(e) => {
                                const newIngredients = [...value];
                                newIngredients[index].quantity = Number(e.target.value);
                                onChange(newIngredients);
                            }}
                            displayEmpty
                            sx={{
                                flex: 1,
                                minWidth: { xs: "35%", sm: "20%" },
                                fontSize: "1rem",
                                "& .MuiSelect-select": { padding: "8px" },
                            }}
                        >
                            {/* ✅ Kleine stappen (1g) voor 1-100g */}
                            {[...Array(100).keys()].map(num => (
                                <MenuItem key={num + 1} value={num + 1}>
                                    {num + 1} g
                                </MenuItem>
                            ))}

                            {/* ✅ Grotere stappen (10g) voor 110-1000g */}
                            {[...Array(91).keys()].map(num => (
                                <MenuItem key={num * 10 + 110} value={num * 10 + 110}>
                                    {num * 10 + 110} g
                                </MenuItem>
                            ))}
                        </Select>
                    ) : (
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
                            inputMode="numeric"
                            pattern="[0-9]*"
                            slotProps={{ input: { min: 0 } }}
                            sx={{
                                flex: 1,
                                minWidth: { xs: "35%", sm: "20%" },
                                "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" } },
                                "& .MuiInputLabel-root": { fontSize: { xs: "0.8rem", sm: "1rem" } },
                                "@media (min-width: 768px)": {
                                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                        "-webkit-appearance": "none",
                                        margin: 0
                                    },
                                    "& input[type=number]": {
                                        "-moz-appearance": "textfield"
                                    }
                                }
                            }}
                        />
                    )}


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

            {/* Knop + dynamische tekst */}
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
                <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", cursor: "pointer" }}>
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
