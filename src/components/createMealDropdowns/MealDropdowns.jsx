import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { cuisinesOptions, dietsOptions, mealTypesOptions } from "../createMealForm/dropdownOptionsMeals.js";
import { preparationTimeOptions } from "../../utils/helpers/dropdownOptionsMeals.js";
import CustomFloatingSelect from "../floatingLabelSelect/FloatingLabelSelectIngredient.jsx";

import CustomGrid from "../layout/CustomGrid.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomMultiSelect from "../layout/CustomMultiSelect.jsx";


/**
 * Renders dropdowns for preparation time, meal types, cuisines and diets.
 * Uses CustomFloatingSelect for single-select and CustomMultiSelect for multi-select fields.
 */
const CreateMealDropdowns = ({ control, errors }) => {
    const renderSingleSelect = (name, label, options, error) => (
        <Controller
            name={name}
            control={control}
            defaultValue={""}
            render={({ field }) => {
                const selected = options.find(opt => opt.value === field.value) || null;
                return (
                    <CustomBox>
                        <CustomFloatingSelect
                            label={label}
                            options={options}
                            value={selected}
                            onChange={(opt) => field.onChange(opt?.value || "")}
                        />
                        {error && (
                            <CustomTypography as="p" variant="small" className="text-error mt-1">
                                {error.message}
                            </CustomTypography>
                        )}

                    </CustomBox>
                );
            }}
        />
    );

    const renderMultiSelect = (name, label, options, error) => (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <CustomBox>
                    <CustomMultiSelect
                        label={label}
                        options={options}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                    />
                    {error && <p className="text-error text-xs mt-1">{error.message}</p>}
                </CustomBox>
            )}
        />
    );

    return (
        <CustomGrid minItemWidth="250px" gap="1rem">
            {renderSingleSelect("preparationTime", "Preparation Time", preparationTimeOptions, errors?.preparationTime)}
            {renderMultiSelect("mealTypes", "Meal Types", mealTypesOptions, errors?.mealTypes)}
            {renderMultiSelect("cuisines", "Cuisines", cuisinesOptions, errors?.cuisines)}
            {renderMultiSelect("diets", "Diets", dietsOptions, errors?.diets)}
        </CustomGrid>

    );
};

CreateMealDropdowns.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object,
};

export default CreateMealDropdowns;
