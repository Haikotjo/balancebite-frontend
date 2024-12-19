import * as yup from "yup";

export const personalInfoSchema = yup.object().shape({
    username: yup
        .string()
        .required("Username is required.")
        .max(50, "Username must not exceed 25 characters."),
    email: yup
        .string()
        .email("Invalid email format.")
        .required("Email is required.")
        .max(100, "Email must not exceed 100 characters."),
});
