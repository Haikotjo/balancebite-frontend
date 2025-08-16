import {useFieldArray, useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes             from "prop-types";
import {useFetchMeals} from "../../../../hooks/useFetchMeals.js";
import {useCreateDiet} from "../../utils/hooks/useCreateDiet.js";
import {createDietPlanSchema} from "../../../../utils/valadition/validationSchemas.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {Apple, Soup} from "lucide-react";

export default function CreateDietFormFull({ onSuccess }) {
    const { mealOptions, loading: mealsLoading, error: mealsError } = useFetchMeals();

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createDietPlanSchema),
        defaultValues: {
            name: "",
            dietDescription: "",
            dietDays: [
                {
                    dayLabel: "",
                    dietDayDescription: ""
                },
            ],
        }
    });

    const { fields: dietDaysFields, append, remove } = useFieldArray({
        control,
        name: "dietDays",
    });

    const {
        days,
        loading,
        renderDialogs,
        handleChangeMealId,
        addDay,
        removeDay,
        addMealId,
        removeMeal,
        onSubmit
    } = useCreateDiet(onSuccess, append, remove);

    if (mealsLoading) {
        return (
            <CustomBox className="text-center py-4">
                <CustomTypography>Loading meals...</CustomTypography>
            </CustomBox>
        );
    }
    if (mealsError) {
        return (
            <ErrorDialog
                open
                onClose={() => {}}
                message={mealsError}
                type="error"
            />
        );
    }

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            // Keep the form constrained and centered
            className="w-full max-w-[720px] mx-auto self-center pb-16 px-2 flex flex-col gap-2 mb-4"
        >
            {/* Form header: icon + title */}
            <CustomBox className="flex flex-col items-center gap-3 mb-2">
                <Soup className="w-16 h-16 sm:w-24 sm:h-24 text-primary" aria-hidden="true" />
                <CustomTypography as="h2" variant="h1" className="text-center">
                    Create New Diet Plan
                </CustomTypography>
            </CustomBox>

            <CustomTextField
                label="Diet Name"
                name="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="Enter the diet name"
                required
            />

            <CustomTextField
                label="Description"
                name="dietDescription"
                {...register("dietDescription")}
                error={!!errors.dietDescription}
                helperText={errors.dietDescription?.message}
                placeholder="Description of the diet"
                multiline
            />


            {dietDaysFields.map((day, dayIndex) => (
                <CustomBox key={day.id} className="border p-4 rounded-lg space-y-2 bg-muted">
                    <CustomTypography variant="h4" bold>Day {dayIndex + 1}</CustomTypography>

                    <CustomTextField
                        label="Day Name"
                        {...register(`dietDays.${dayIndex}.dayLabel`)}
                        error={errors?.dietDays?.[dayIndex]?.dayLabel}
                        helperText={errors?.dietDays?.[dayIndex]?.dayLabel?.message}
                        placeholder="(optional)"
                    />

                    <CustomTextField
                        label="Day Description"
                        multiline
                        {...register(`dietDays.${dayIndex}.dietDayDescription`)}
                        error={errors?.dietDays?.[dayIndex]?.dietDayDescription}
                        helperText={errors?.dietDays?.[dayIndex]?.dietDayDescription?.message}
                        placeholder="(optional)"
                    />

                    {days[dayIndex].mealIds.map((id, mealIndex) => (
                        <CustomBox key={`${dayIndex}-${mealIndex}`} className="flex items-center gap-2">
                            <CustomFloatingSelect
                                label={`Meal ${mealIndex + 1}`}
                                placeholder={mealIndex < 2
                                    ? "Search and select at least 2 meals"
                                    : "Search and select meal"
                                }
                                options={mealOptions}
                                value={mealOptions.find(m => m.value === id) || { value: "", label: "" }}
                                onChange={sel => handleChangeMealId(dayIndex, mealIndex, sel?.value || "")}
                            />
                            {days[dayIndex].mealIds.length > 1 && (
                                <CustomButton type="button" onClick={() => removeMeal(dayIndex, mealIndex)}>
                                    <CustomTypography
                                        className="text-error hover:underline hover:text-primary cursor-pointer"
                                        as="span"
                                    >
                                        Remove
                                    </CustomTypography>
                                </CustomButton>
                            )}
                        </CustomBox>
                    ))}

                    {days[dayIndex].mealIds.filter(id => id.trim() !== "").length < 2 && (
                        <CustomTypography variant="xsmallCard" className="text-error italic">
                            {days[dayIndex].mealIds.filter(id => id.trim() !== "").length === 0
                                ? "Add meals for this day."
                                : "Select one more meal to continue."
                            }
                        </CustomTypography>
                    )}

                    <CustomButton
                        type="button"
                        onClick={() => addMealId(dayIndex)}
                        disabled={days[dayIndex].mealIds.some(id => id.trim() === "")}
                        className="group p-2"
                    >
                        <CustomTypography className="group-hover:text-primary group-hover:underline cursor-pointer">
                            + Add Meal
                        </CustomTypography>
                    </CustomButton>
                </CustomBox>
            ))}


            <CustomBox className="flex gap-2 items-center">
                <CustomButton type="button" onClick={addDay} className="group p-2">
                    <CustomTypography className="group-hover:text-primary group-hover:underline cursor-pointer">
                        + Add Day
                    </CustomTypography>
                </CustomButton>
                {days.length > 1 && (
                    <CustomButton type="button" onClick={removeDay} className="group p-2">
                        <CustomTypography
                            className="text-error group-hover:text-primary group-hover:underline cursor-pointer">
                            Remove Day
                        </CustomTypography>
                    </CustomButton>
                )}
            </CustomBox>

            {renderDialogs()}

            <CustomButton type="submit" disabled={loading} className="group p-2">
                {loading ? "Creating..." : "Create Diet"}
            </CustomButton>
        </CustomBox>

    );
}

CreateDietFormFull.propTypes = {
    onSuccess: PropTypes.func,
};
