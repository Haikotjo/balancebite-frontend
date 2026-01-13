import * as yup from "yup";

export const userDetailsSchema = yup.object().shape({
    gender: yup
        .string()
        .oneOf(["MALE", "FEMALE", "OTHER"], "Please select a valid gender.")
        .required("Gender is required."),
    activityLevel: yup
        .string()
        .oneOf(
            ["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"],
            "Please select a valid activity level."
        )
        .required("Activity level is required."),
    goal: yup
        .string()
        .oneOf(
            [
                "WEIGHT_LOSS",
                "WEIGHT_LOSS_WITH_MUSCLE_MAINTENANCE",
                "MAINTENANCE",
                "MAINTENANCE_WITH_MUSCLE_FOCUS",
                "WEIGHT_GAIN",
                "WEIGHT_GAIN_WITH_MUSCLE_FOCUS",
            ],
            "Please select a valid goal."
        )
        .required("Goal is required."),
    height: yup
        .number()
        .typeError("Height must be a number.")
        .required("Height is required.")
        .min(50, "Height must be at least 50 cm.")
        .max(250, "Height must not exceed 250 cm."),
    weight: yup
        .number()
        .typeError("Weight must be a number.")
        .required("Weight is required.")
        .min(20, "Weight must be at least 20 kg.")
        .max(300, "Weight must not exceed 300 kg."),
    // VOEG DIT STUKJE TOE:
    targetWeight: yup
        .number()
        .typeError("Target weight must be a number.")
        .required("Target weight is required.")
        .min(20, "Target weight must be at least 20 kg.")
        .max(300, "Target weight must not exceed 300 kg."),
    age: yup
        .number()
        .typeError("Age must be a number.")
        .required("Age is required.")
        .min(1, "Age must be at least 1.")
        .max(100, "Age must not exceed 100."),
});