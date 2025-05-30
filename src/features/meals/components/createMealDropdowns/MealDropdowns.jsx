import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import {
    mealTypesOptions,
    cuisinesOptions,
    dietsOptions,
} from "../../utils/helpers/dropdownOptionsMealsTypes.js"
import  {  preparationTimeOptions } from "../../utils/helpers/dropdownOptionsMealsTime.js"
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomMultiSelect from "../../../../components/layout/CustomMultiSelect.jsx";
import CustomGridCompact from "../../../../components/layout/CustomGridCompact.jsx";

/**
 * Renders dropdowns for preparation time, meal types, cuisines and diets.
 * Uses CustomFloatingSelect for single-select and CustomMultiSelect for multi-select fields.
 */
const CreateMealDropdowns = ({ control, errors }) => {
    const renderSingleSelect = (name, label, options, error) => (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            render={({ field }) => {
                const selected = options.find(opt => opt.value === field.value) || null;
                return (
                    // each field wrapper fixed width of 160px
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
                // each field wrapper fixed width of 160px
                <CustomBox>
                    <CustomMultiSelect
                        label={label}
                        options={options}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                    />
                    {error && (
                        <CustomTypography as="p" variant="small" className="text-error mt-1">
                            {error.message}
                        </CustomTypography>
                    )}
                </CustomBox>
            )}
        />
    );

    return (
        // grid layout, items have fixed width wrappers
        <CustomGridCompact gap="1rem">
            {renderSingleSelect("preparationTime", "Preparation Time", preparationTimeOptions, errors?.preparationTime)}
            {renderMultiSelect("mealTypes", "Meal Types", mealTypesOptions, errors?.mealTypes)}
            {renderMultiSelect("cuisines", "Cuisines", cuisinesOptions, errors?.cuisines)}
            {renderMultiSelect("diets", "Diets", dietsOptions, errors?.diets)}
        </CustomGridCompact>
    );
};

CreateMealDropdowns.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object,
};

export default CreateMealDropdowns;
