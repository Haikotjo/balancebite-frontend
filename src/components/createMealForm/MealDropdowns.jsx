import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import Select from "react-select";
import { useTheme } from "@mui/material/styles";
import { cuisinesOptions, dietsOptions, mealTypesOptions } from "./dropdownOptionsMeals.js";
import customSelectStyles from "../../styles/customSelectStyles.js";

/**
 * Component that renders meal dropdowns for meal types, cuisines, and diets.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.control - The react-hook-form control object.
 * @param {Object} props.errors - The form errors.
 * @returns {JSX.Element} The rendered MealDropdowns component.
 */
const MealDropdowns = ({ control, errors }) => {
    const theme = useTheme();

    /**
     * Renders a react-select component controlled by react-hook-form's Controller.
     *
     * @param {string} name - The name of the field.
     * @param {string} label - The label to display (in singular form).
     * @param {Array} options - The array of options for the select.
     * @param {Object} error - The error object for the field.
     * @returns {JSX.Element} The rendered select component.
     */
    const renderSelect = (name, label, options, error) => (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => {
                // Access field.onChange, field.value, etc.
                return (
                    <div style={{ position: "relative", marginTop: "24px" }}>
                        {/* Floating label */}
                        <label
                            style={{
                                position: "absolute",
                                top: "-10px",
                                left: "12px",
                                background: theme.palette.mode === "dark" ? "#2d2f39" : "#FFFFFF",
                                padding: "0 4px",
                                fontSize: "0.6rem",
                                color: theme.palette.mode === "dark" ? "#ffffff" : "#7a7c8b",
                                zIndex: 1,
                            }}
                        >
                            {label.replace(/s$/, "")}
                        </label>

                        {/* React-select component */}
                        <Select
                            {...field}
                            isMulti
                            options={options.map(opt => ({ value: opt.value, label: opt.label }))}
                            // Overschrijf de standaard placeholder door een lege string te gebruiken
                            placeholder=""
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            onChange={(selectedOptions) =>
                                field.onChange(selectedOptions.map((opt) => opt.value))
                            }
                            value={options
                                .filter((opt) => field.value?.includes(opt.value))
                                .map((opt) => ({ value: opt.value, label: opt.label }))}
                            styles={customSelectStyles(theme)}
                            isSearchable={false}
                            classNamePrefix="react-select"
                        />
                        {error && (
                            <p style={{ color: "red", fontSize: "0.8rem", marginTop: 4 }}>
                                {error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );

    return (
        <>
            {renderSelect("mealTypes", "Meal Types", mealTypesOptions, errors?.mealTypes)}
            {renderSelect("cuisines", "Cuisines", cuisinesOptions, errors?.cuisines)}
            {renderSelect("diets", "Diets", dietsOptions, errors?.diets)}
        </>
    );
};

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
