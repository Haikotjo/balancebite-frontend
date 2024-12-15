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
