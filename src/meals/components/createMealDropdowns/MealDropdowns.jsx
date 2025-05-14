import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomFloatingSelect from "../../../components/layout/CustomFloatingSelect.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomMultiSelect from "../../../components/layout/CustomMultiSelect.jsx";
import CustomGrid from "../../../components/layout/CustomGrid.jsx";
import {
    mealTypesOptions,
    cuisinesOptions,
    dietsOptions,
} from "../../utils/helpers/dropdownOptionsMealsTypes.js"
import  {  preparationTimeOptions } from "../../utils/helpers/dropdownOptionsMealsTime.js"

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
                    <CustomBox className="w-[160px]">
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
                <CustomBox className="w-[160px]">
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
        <CustomGrid gap="1rem">
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
