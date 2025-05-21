import { useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFetchMeals } from "../../../../hooks/useFetchMeals.js";
import { getUserDietPlanByIdApi } from "../../../../services/apiService.js";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { createDietPlanSchema } from "../../../../utils/valadition/validationSchemas.js";

export default function UpdateDietForm({ onSubmit }) {
    const { dietId } = useParams();
    const [days, setDays] = useState([]);
    const [loadingDiet, setLoadingDiet] = useState(true);
    const [errorDiet, setErrorDiet] = useState("");

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createDietPlanSchema),
        defaultValues: {
            name: "",
            dietDescription: "",
            dietDays: [],
        },
    });

    const { fields: dietDaysFields, append, remove } = useFieldArray({
        control,
        name: "dietDays",
    });

    const { mealOptions, loading: mealsLoading, error: mealsError } = useFetchMeals();

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const data = await getUserDietPlanByIdApi(dietId);
                reset({
                    name: data.name || "",
                    dietDescription: data.dietDescription || "",
                    dietDays: data.dietDays.map(day => ({
                        dayLabel: day.dayLabel || "",
                        dietDayDescription: day.dietDayDescription || "",
                    })),
                });
                setDays(
                    data.dietDays.map(day => ({
                        mealIds: (day.meals || []).map(meal => meal.id.toString()),
                    }))
                );
            } catch (err) {
                console.error("Fout bij ophalen dieet:", err);
                setErrorDiet("Failed to fetch diet.");
            } finally {
                setLoadingDiet(false);
            }
        };

        if (dietId) fetchDiet();
    }, [dietId, reset]);

    const handleChangeMealId = (dayIndex, mealIndex, newValue) => {
        setDays(prev => {
            const copy = [...prev];
            copy[dayIndex].mealIds[mealIndex] = newValue;
            return copy;
        });
    };

    const addMealId = (dayIndex) => {
        setDays(prev => {
            const copy = [...prev];
            copy[dayIndex].mealIds.push("");
            return copy;
        });
    };

    const removeMeal = (dayIndex, mealIndex) => {
        setDays(prev => {
            const copy = [...prev];
            copy[dayIndex].mealIds.splice(mealIndex, 1);
            return copy;
        });
    };

    const addDay = () => {
        append({ dayLabel: "", dietDayDescription: "" });
        setDays(prev => [...prev, { mealIds: ["", ""] }]);
    };

    const removeDay = () => {
        remove(dietDaysFields.length - 1);
        setDays(prev => prev.slice(0, -1));
    };

    const handleFormSubmit = (formData) => {
        const merged = {
            ...formData,
            dietDays: formData.dietDays.map((day, index) => ({
                ...day,
                mealIds: (days[index]?.mealIds || []).filter(id => id?.toString().trim() !== ""),
            })),
        };
        onSubmit?.(merged);
    };

    if (loadingDiet || mealsLoading) {
        return (
            <CustomBox className="text-center py-4">
                <CustomTypography>Loading...</CustomTypography>
            </CustomBox>
        );
    }

    if (errorDiet || mealsError) {
        return (
            <ErrorDialog open onClose={() => {}} message={errorDiet || mealsError} type="error" />
        );
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <CustomBox className="space-y-4 max-w-3xl mx-auto">
                <CustomTypography as="h2" variant="h1">
                    Update Diet (ID: {dietId})
                </CustomTypography>

                <CustomTextField
                    label="Diet Name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Enter the diet name"
                    required
                />

                <CustomTextField
                    label="Description"
                    {...register("dietDescription")}
                    error={!!errors.dietDescription}
                    helperText={errors.dietDescription?.message}
                    placeholder="Description of the diet"
                    multiline
                />

                {dietDaysFields.map((day, dayIndex) => (
                    <CustomBox key={day.id} className="border p-4 rounded-lg space-y-2 bg-muted">
                        <CustomTypography variant="h4" bold>
                            Day {dayIndex + 1}
                        </CustomTypography>

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

                        {(days[dayIndex]?.mealIds || []).map((id, mealIndex) => (
                            <CustomBox key={`${dayIndex}-${mealIndex}`} className="flex items-center gap-2">
                                <CustomFloatingSelect
                                    label={`Meal ${mealIndex + 1}`}
                                    placeholder={mealIndex < 2
                                        ? "Search and select at least 2 meals"
                                        : "Search and select meal"}
                                    options={mealOptions}
                                    value={mealOptions.find(m => m.value === id) || { value: "", label: "" }}
                                    onChange={sel => handleChangeMealId(dayIndex, mealIndex, sel?.value || "")}
                                />
                                {(days[dayIndex]?.mealIds.length ?? 0) > 1 && (
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

                        {(days[dayIndex]?.mealIds || []).filter(id => id?.toString().trim() !== "").length < 2 && (
                            <CustomTypography variant="xsmallCard" className="text-error italic">
                                {(days[dayIndex]?.mealIds || []).filter(id => id?.toString().trim() !== "").length === 0
                                    ? "Add meals for this day."
                                    : "Select one more meal to continue."}
                            </CustomTypography>
                        )}

                        <CustomButton
                            type="button"
                            onClick={() => addMealId(dayIndex)}
                            disabled={(days[dayIndex]?.mealIds || []).some(id => id?.toString().trim() === "")}
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
                            <CustomTypography className="text-error group-hover:text-primary group-hover:underline cursor-pointer">
                                Remove Day
                            </CustomTypography>
                        </CustomButton>
                    )}
                </CustomBox>

                <CustomButton type="submit" className="group p-2" disabled={!isValid}>
                    Update Diet
                </CustomButton>
            </CustomBox>
        </form>
    );
}

UpdateDietForm.propTypes = {
    onSubmit: PropTypes.func,
};
