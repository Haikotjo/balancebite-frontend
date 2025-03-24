import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";
import { cuisinesOptions, dietsOptions, mealTypesOptions } from "./dropdownOptionsMeals.js";
import TextFieldCreateMeal from "./textFieldCreateMeal/TextFieldCreateMeal.jsx";
import Select from "react-select"

const MealDropdowns = ({ control, errors }) => {
    return (
        <>
            {/* Meal Type Dropdown */}
            <Controller
                name="mealTypes"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Meal Types"
                        SelectProps={{ multiple: true }}
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.mealTypes}
                        helperText={errors?.mealTypes?.message || ""}
                        sx={{ mt: 2 }}
                    >
                        {mealTypesOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'white',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextFieldCreateMeal>
                )}
            />

            {/* Cuisines Dropdown */}
            <Controller
                name="cuisines"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Cuisines"
                        SelectProps={{ multiple: true }}
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.cuisines}
                        helperText={errors?.cuisines?.message || ""}
                        sx={{ mt: 2 }}
                    >
                        {cuisinesOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'white',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextFieldCreateMeal>
                )}
            />

            {/* Diets Dropdown */}
            <Controller
                name="diets"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextFieldCreateMeal
                        {...field}
                        select
                        label="Diets"
                        SelectProps={{ multiple: true }}
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors?.diets}
                        helperText={errors?.diets?.message || ""}
                        sx={{ mt: 2 }}
                    >
                        {dietsOptions.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'white',
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
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
        mealTypes: PropTypes.shape({ message: PropTypes.string }),
        cuisines: PropTypes.shape({ message: PropTypes.string }),
        diets: PropTypes.shape({ message: PropTypes.string }),
    }),
};

export default MealDropdowns;
