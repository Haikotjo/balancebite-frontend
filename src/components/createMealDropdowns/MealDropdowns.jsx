import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import Select from "react-select";
import { useTheme } from "@mui/material/styles";
import { cuisinesOptions, dietsOptions, mealTypesOptions } from "../createMealForm/dropdownOptionsMeals.js";
import customSelectStyles from "../../styles/customSelectStyles.js";
import {preparationTimeOptions} from "../../utils/helpers/dropdownOptionsMeals.js";

/**
 * Component that renders meal dropdowns for meal types, cuisines, and diets.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.control - The react-hook-form control object.
 * @param {Object} props.errors - The form errors.
 * @returns {JSX.Element} The rendered CreateMealDropdowns component.
 */
const CreateMealDropdowns = ({ control, errors }) => {
    const theme = useTheme();

    /**
     * Renders a react-select component controlled by react-hook-form's Controller.
     *
     * @param {string} name - The name of the field.
     * @param {string} label - The label to display (in singular form).
     * @param {Array} options - The array of options for the select.
     * @param {Object} error - The error object for the field.
     * @param isMulti
     * @returns {JSX.Element} The rendered select component.
     */
    const renderSelect = (name, label, options, error, isMulti = true) => (

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
                            isMulti={isMulti}
                            options={options.map(opt => ({ value: opt.value, label: opt.label }))}
                            placeholder=""
                            closeMenuOnSelect={!isMulti}
                            hideSelectedOptions={false}
                            onChange={(selectedOptions) =>
                                field.onChange(
                                    isMulti
                                        ? selectedOptions.map((opt) => opt.value)
                                        : selectedOptions?.value || ""
                                )
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
                    {renderSelect("preparationTime", "Preparation Time", preparationTimeOptions, errors?.preparationTime, false)}
                </div>
                <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
                    {renderSelect("mealTypes", "Meal Types", mealTypesOptions, errors?.mealTypes)}
                </div>
                <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
                    {renderSelect("cuisines", "Cuisines", cuisinesOptions, errors?.cuisines)}
                </div>
                <div style={{ flex: "1 1 250px", minWidth: "250px" }}>
                    {renderSelect("diets", "Diets", dietsOptions, errors?.diets)}
                </div>
            </div>
        </>
    );
};

CreateMealDropdowns.propTypes = {
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
        preparationTime: PropTypes.shape({ message: PropTypes.string }), // ← voeg dit toe
    }),
};

export default CreateMealDropdowns;
