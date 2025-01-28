import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {cuisineOptions, dietOptions, mealTypeOptions} from "./dropdownOptionsMeals.js";


const MealDropdowns = ({ control, errors }) => {
    return (
        <>
            {/* Meal Type Dropdown */}
            <FormControl fullWidth>
                <InputLabel id="meal-type-label">Meal Type</InputLabel>
                <Controller
                    name="mealType"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select {...field} labelId="meal-type-label" error={!!errors.mealType}>
                            {mealTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>

            {/* Cuisine Dropdown */}
            <FormControl fullWidth>
                <InputLabel id="cuisine-label">Cuisine</InputLabel>
                <Controller
                    name="cuisine"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select {...field} labelId="cuisine-label" error={!!errors.cuisine}>
                            {cuisineOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>

            {/* Diet Dropdown */}
            <FormControl fullWidth>
                <InputLabel id="diet-label">Diet</InputLabel>
                <Controller
                    name="diet"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select {...field} labelId="diet-label" error={!!errors.diet}>
                            {dietOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
            </FormControl>
        </>
    );
};

MealDropdowns.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

export default MealDropdowns;
