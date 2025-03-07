import * as yup from "yup";

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .matches(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format. A valid email looks like 'example@domain.com'.")
        .email("Please provide a valid email address.")
        .required("Email is required."),
    password: yup
        .string()
        .min(5, "Password must be at least 5 characters long.")
        .required("Password is required."),
});

export default loginSchema;
