import * as yup from "yup";

export const personalInfoSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is required.")
        .max(25, "Username must not exceed 25 characters."),
    email: yup
        .string()
        .email("Invalid email format.") // ✅ Standaard Yup e-mail validatie
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Invalid email format. Must be a valid email address."
        )
        .required("Email is required.")
        .max(100, "Email must not exceed 100 characters."),
});
