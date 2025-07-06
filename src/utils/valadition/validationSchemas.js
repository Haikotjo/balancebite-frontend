import * as yup from "yup";
import {transformToNumber} from "./transforms.js";

// Validation schema for Create Meal Form
export const mealSchema  = yup.object().shape({
    name: yup
        .string()
        .required("The name of the meal cannot be blank.")
        .max(100, "The name of the meal must not exceed 100 characters."),
    mealIngredients: yup
        .array()
        .of(
            yup.object().shape({
                foodItemId: yup
                    .number()
                    .required("Food Item ID is required.")
                    .positive("Food Item ID must be greater than zero."),
                quantity: yup
                    .number()
                    .nullable()
                    .typeError("Quantity must be a number.")
                    .min(0, "Quantity must be zero or greater."),
            })
        )
        .min(1, "The meal must contain at least one ingredient."),
    mealDescription: yup
        .string()
        .max(1000, "The meal description must not exceed 1000 characters."),
    preparationTime: yup
        .string()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .nullable()
        .matches(/^PT(\d+H)?(\d+M)?(\d+S)?$/, "Invalid duration format (e.g. PT30M or PT1H30M)")
        .notRequired(),
    image: yup.mixed(),
    imageUrl: yup
        .string()
        .url("Invalid URL format.")
        .max(500, "The image URL must not exceed 500 characters."),
});

export const foodItemSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name must not exceed 100 characters."),

    source: yup
        .string()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .url("Source must be a valid URL")
        .max(100, "Source must not exceed 100 characters.")
        .nullable(),

    portionDescription: yup
        .string()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .max(100, "Portion description must not exceed 200 characters.")
        .nullable(),

    gramWeight: yup
        .number()
        .transform(transformToNumber)
        .typeError("Gram weight must be a number")
        .positive("Gram weight must be greater than 0")
        .nullable(),

    calories: yup
        .number()
        .transform(transformToNumber)
        .typeError("Calories must be a number")
        .min(0, "Calories cannot be negative")
        .required("Calories is required"),

    protein: yup
        .number()
        .transform(transformToNumber)
        .typeError("Protein must be a number")
        .min(0, "Protein cannot be negative")
        .required("Protein is required"),

    carbohydrates: yup
        .number()
        .transform(transformToNumber)
        .typeError("Carbohydrates must be a number")
        .min(0, "Carbohydrates cannot be negative")
        .required("Carbohydrates is required"),

    sugars: yup
        .number()
        .transform(transformToNumber)
        .typeError("Sugars must be a number")
        .min(0, "Sugars cannot be negative")
        .nullable(),

    fat: yup
        .number()
        .transform(transformToNumber)
        .typeError("Fat must be a number")
        .min(0, "Fat cannot be negative")
        .required("Fat is required"),

    saturatedFat: yup
        .number()
        .transform(transformToNumber)
        .typeError("Saturated Fat must be a number")
        .min(0, "Saturated Fat cannot be negative")
        .nullable(),

    unsaturatedFat: yup
        .number()
        .transform(transformToNumber)
        .typeError("Unsaturated Fat must be a number")
        .min(0, "Unsaturated Fat cannot be negative")
        .nullable(),
});

export const fdcIdSchema = yup.object().shape({
    fdcId: yup
        .string()
        .matches(/^\d+$/, "FDC ID must be a number")  // Ensure only digits are allowed
        .required("FDC ID is required"),
});


export const createDietPlanSchema = yup.object().shape({
    name: yup
        .string()
        .required("Diet name is required.")
        .max(100, "Diet name cannot be longer than 100 characters."),

    dietDescription: yup
        .string()
        .max(1000, "Description cannot be longer than 1000 characters.")
        .nullable(),

    dietDays: yup
        .array()
        .of(
            yup.object().shape({
                dayLabel: yup
                    .string()
                    .max(50, "Day label cannot be longer than 50 characters.")
                    .notRequired(),

                dietDayDescription: yup
                    .string()
                    .max(1000, "Day description cannot be longer than 1000 characters.")
                    .nullable(),
            })
        )
        .min(1, "There must be at least one day in the diet.")
        .required("Diet days are required."),
});

