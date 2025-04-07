import * as yup from "yup";

const registerSchema = yup.object().shape({
    userName: yup
        .string()
        .min(2, "Username must be at least 2 characters.")
        .max(20, "Username cannot exceed 20 characters.")
        .required("Username is required."),
    email: yup
        .string()
        .matches(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid email format. A valid email looks like 'example@domain.com'.")
        .email("Please provide a valid email address.")
        .required("Email is required."),
    password: yup
        .string()
        .min(5, "Password must be at least 5 characters long.")
        .matches(/[A-Z]/, "Password must include an uppercase letter.")
        .matches(/[a-z]/, "Password must include a lowercase letter.")
        .matches(/\d/, "Password must include a number.")
        .matches(/[!@#$%^&*()_+=-]/, "Password must include a special character.")
        .required("Password is required."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match.")
        .required("Please confirm your password."),
});

export default registerSchema;
