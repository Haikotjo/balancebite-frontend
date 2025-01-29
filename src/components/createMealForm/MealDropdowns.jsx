import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import { cuisineOptions, dietOptions, mealTypeOptions } from "./dropdownOptionsMeals.js";
import TextFieldCreateMeal from "./textFieldCreateMeal/TextFieldCreateMeal.jsx";

const MealDropdowns = ({ control, errors }) => {
    return (
        <>
            {/* Meal Type Dropdown */}
            <Controller
                name="mealType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Meal Type"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.mealType}
                        helperText={errors?.mealType?.message || ""}
                        sx={{ mt: 2 }} // Extra ruimte boven elk dropdown veld
                    >
                        <MenuItem value="" disabled>Select a Meal Type</MenuItem>
                        {mealTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextFieldCreateMeal>
                )}
            />

            {/* Cuisine Dropdown */}
            <Controller
                name="cuisine"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Cuisine"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.cuisine}
                        helperText={errors?.cuisine?.message || ""}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select a Cuisine</MenuItem>
                        {cuisineOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextFieldCreateMeal>
                )}
            />

            {/* Diet Dropdown */}
            <Controller
                name="diet"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Diet"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.diet}
                        helperText={errors?.diet?.message || ""}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Select a Diet</MenuItem>
                        {dietOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextFieldCreateMeal>
                )}
            />
        </>
    );
};

// ✅ PropTypes validatie
MealDropdowns.propTypes = {
    control: PropTypes.shape({
        register: PropTypes.func,
        unregister: PropTypes.func,
        getValues: PropTypes.func,
        setValue: PropTypes.func,
        trigger: PropTypes.func,
    }).isRequired,
    errors: PropTypes.shape({
        mealType: PropTypes.shape({ message: PropTypes.string }),
        cuisine: PropTypes.shape({ message: PropTypes.string }),
        diet: PropTypes.shape({ message: PropTypes.string }),
    }),
};

export default MealDropdowns;
