import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import Select from "react-select";
import { useTheme } from "@mui/material/styles";
import { cuisinesOptions, dietsOptions, mealTypesOptions } from "./dropdownOptionsMeals.js";
import customSelectStyles from "../../styles/customSelectStyles.js";

const MealDropdowns = ({ control, errors }) => {
    const theme = useTheme();

    const renderSelect = (name, label, options, error) => (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <div style={{ marginTop: '16px' }}>
                    <Select
                        {...field}
                        isMulti
                        options={options.map(opt => ({ value: opt.value, label: opt.label }))}
                        placeholder={`Select ${label.toLowerCase()}`}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selectedOptions) =>
                            field.onChange(selectedOptions.map((opt) => opt.value))
                        }
                        value={options
                            .filter((opt) => field.value?.includes(opt.value))
                            .map((opt) => ({ value: opt.value, label: opt.label }))
                        }
                        styles={customSelectStyles(theme)}
                        isSearchable={false}
                    />
                    {error && (
                        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>
                            {error.message}
                        </p>
                    )}
                </div>
            )}
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
