import * as yup from "yup";

// Validation schema for Create Meal Form
export const createMealSchema = yup.object().shape({
    name: yup
        .string()
        .required("The name of the meal cannot be blank.")
        .max(100, "The name of the meal must not exceed 50 characters."),
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
        .min(2, "The meal must contain at least two ingredients."),
    mealDescription: yup
        .string()
        .max(1000, "The meal description must not exceed 1000 characters."),
    image: yup.mixed(),
    imageUrl: yup
        .string()
        .url("Invalid URL format.")
        .max(500, "The image URL must not exceed 500 characters."),
});

// Validation schema for Create Food Item Form
export const foodItemSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name must not exceed 100 characters."),
    source: yup
        .string()
        .required("Source is required")
        .max(100, "Source must not exceed 100 characters."),
    portionDescription: yup
        .string()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .max(100, "Portion description must not exceed 100 characters.")
        .nullable(),
    gramWeight: yup
        .number()
        .transform((value, originalValue) => originalValue === "" ? null : value)
        .typeError("Gram weight must be a number")
        .positive("Gram weight must be greater than 0")
        .nullable(),
    calories: yup
        .number()
        .typeError("Calories must be a number")
        .min(0, "Calories cannot be negative")
        .required("Calories is required"),
    protein: yup
        .number()
        .typeError("Protein must be a number")
        .min(0, "Protein cannot be negative")
        .required("Protein is required"),
    carbohydrates: yup
        .number()
        .typeError("Carbohydrates must be a number")
        .min(0, "Carbohydrates cannot be negative")
        .required("Carbohydrates is required"),
    fat: yup
        .number()
        .typeError("Fat must be a number")
        .min(0, "Fat cannot be negative")
        .required("Fat is required"),
});
