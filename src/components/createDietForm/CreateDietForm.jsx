// src/components/createDietForm/CreateDietFormFull.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createDietPlanApi, fetchMeals } from "../../services/apiService.js";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomTextField from "../layout/CustomTextField.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import CustomFloatingSelect from "../layout/CustomFloatingSelect.jsx";
import PropTypes from "prop-types";
import {createDietPlanSchema} from "../../utils/valadition/validationSchemas.js";

export default function CreateDietFormFull({ onSuccess }) {
    const [days, setDays] = useState([
        { label: "", description: "", mealIds: [""] },
    ]);
    const [mealOptions, setMealOptions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // alleen HF voor name + description
    const { register, handleSubmit } = useForm({
        defaultValues: { name: "", dietDescription: "" },
    });

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchMeals("/meals");
                if (data.content && Array.isArray(data.content)) {
                    setMealOptions(
                        data.content.map((m) => ({
                            value: m.id.toString(),
                            label: m.name,
                        }))
                    );
                }
            } catch (e) {
                console.error("Failed to load meals", e);
            }
        })();
    }, []);

    const handleChangeMealId = (dayIndex, mealIndex, value) => {
        setDays((prev) =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day;
                const mealIds = [...day.mealIds];
                mealIds[mealIndex] = value;
                if (mealIndex === 0 && prev[i].mealIds.length === 1 && value) {
                    mealIds.push("");
                }
                return { ...day, mealIds };
            })
        );
    };

    const addDay = () =>
        setDays((prev) => [...prev, { label: "", description: "", mealIds: [""] }]);
    const addMealId = (dayIndex) => {
        const copy = [...days];
        copy[dayIndex].mealIds.push("");
        setDays(copy);
    };

    const removeDay = () => setDays((prev) => prev.slice(0, -1));

    const removeMeal = (dayIndex, mealIndex) => {
        const copy = [...days];
        copy[dayIndex].mealIds.splice(mealIndex, 1);
        setDays(copy);
    };

    const onSubmit = async ({ name, dietDescription }) => {
        setError(null);
        setLoading(true);

        const payload = {
            name,
            dietDescription,
            dietDays: days.map(d => ({
                dayLabel: d.label,
                dietDayDescription: d.description,
                mealIds: d.mealIds.filter(id => id.trim() !== ""),
            })),
        };

        try {
            await createDietPlanSchema.validate(payload, { abortEarly: false });
            const newDiet = await createDietPlanApi({ ...payload, diets: [] });
            onSuccess?.(newDiet);
        } catch (err) {
            if (err.name === "ValidationError") {
                const messages = err.inner.map(e => e.message).join("\n");
                setError(messages);
            } else {
                setError(err?.response?.data?.error || "Failed to create diet plan.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CustomBox className="space-y-4 max-w-3xl mx-auto">
                <CustomTypography variant="h2" bold>
                    Create New Diet
                </CustomTypography>

                {/* Hook Form only voor deze twee */}
                <CustomTextField
                    label="Diet Name"
                    name="name"
                    register={register}
                    required
                />
                <CustomTextField
                    label="Description"
                    name="dietDescription"
                    register={register}
                    multiline
                    rows={4}
                />

                {days.map((day, dayIndex) => (
                    <CustomBox
                        key={dayIndex}
                        className="border p-4 rounded-lg space-y-2 bg-muted"
                    >
                        <CustomTypography variant="h4" bold>
                            Day {dayIndex + 1}
                        </CustomTypography>

                        <CustomTextField
                            label="Day Name"
                            name={`dayLabel-${dayIndex}`}
                            value={day.label}
                            onChange={(e) => {
                                const copy = [...days];
                                copy[dayIndex].label = e.target.value;
                                setDays(copy);
                            }}
                        />
                        <CustomTextField
                            label="Day Description"
                            name={`dayDesc-${dayIndex}`}
                            value={day.description}
                            multiline
                            onChange={(e) => {
                                const copy = [...days];
                                copy[dayIndex].description = e.target.value;
                                setDays(copy);
                            }}
                        />

                        {day.mealIds.map((id, mealIndex) => (
                            <div key={mealIndex} className="flex items-center gap-2">
                                <CustomFloatingSelect
                                    label={`Meal ${mealIndex + 1}`}
                                    placeholder="Search and select meal"
                                    options={mealOptions}
                                    value={
                                        mealOptions.find((m) => m.value === id) || { value: "", label: "" }
                                    }
                                    onChange={(sel) =>
                                        handleChangeMealId(dayIndex, mealIndex, sel?.value || "")
                                    }
                                />
                                {day.mealIds.length > 1 && (
                                    <CustomButton
                                        type="button"
                                        variant="danger"
                                        onClick={() => removeMeal(dayIndex, mealIndex)}
                                    >
                                        Remove
                                    </CustomButton>
                                )}
                            </div>
                        ))}
                        {day.mealIds.length < 2 && (
                            <CustomTypography
                                variant="xsmallCard"
                                className="text-error italic"
                            >
                                Add at least 2 meals for this day.
                            </CustomTypography>
                        )}
                        <CustomButton
                            type="button"
                            onClick={() => addMealId(dayIndex)}
                            className="group p-2"
                        >
                            + Add Meal
                        </CustomButton>
                    </CustomBox>
                ))}

                <div className="flex gap-2 items-center">
                    <CustomButton type="button" onClick={addDay} className="group p-2">
                        + Add Day
                    </CustomButton>
                    {days.length > 1 && (
                        <CustomButton
                            type="button"
                            onClick={removeDay}
                            className="group p-2"
                        >
                            – Remove Day
                        </CustomButton>
                    )}
                </div>

                {error && (
                    <CustomTypography className="text-error">{error}</CustomTypography>
                )}

                <CustomButton type="submit" disabled={loading} className="group p-2">
                    {loading ? "Creating..." : "Create Diet"}
                </CustomButton>
            </CustomBox>
        </form>
    );
}

CreateDietFormFull.propTypes = {
    onSuccess: PropTypes.func,
};
