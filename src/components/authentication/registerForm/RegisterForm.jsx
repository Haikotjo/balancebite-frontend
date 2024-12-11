import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AuthContext } from "../../../context/AuthContext.jsx";
import useLogin from "../../../hooks/useLogin.js";

// Validation schema using yup
const schema = yup.object().shape({
    userName: yup
        .string()
        .min(2, "Username must be at least 2 characters.")
        .max(10, "Username cannot exceed 10 characters.")
        .required("Username is required."),
    email: yup
        .string()
        .email("Please provide a valid email address.")
        .required("Email is required."),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters long.")
        .matches(/[A-Z]/, "Password must include an uppercase letter.")
        .matches(/[a-z]/, "Password must include a lowercase letter.")
        .matches(/\d/, "Password must include a number.")
        .matches(/[!@#$%^&*()_+=\-]/, "Password must include a special character.")
        .required("Password is required."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match.")
        .required("Please confirm your password."),
});

const RegisterForm = ({ onClose }) => {
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { handleLogin } = useLogin(); // Gebruik de login logica

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema), // Yup validation
        mode: "onBlur",
    });

    const handleRegistration = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }

            const responseData = await response.json();
            const { accessToken, refreshToken } = responseData;

            if (!accessToken || !refreshToken) {
                throw new Error("Invalid response from server.");
            }

            // Voer login logica uit om context te updaten
            await handleLogin(data.email, data.password);

            // Display success message and navigate
            setSuccessMessage("Registration successful! Redirecting...");
            setTimeout(() => {
                navigate(`/meals`);
            }, 1000);
        } catch (error) {
            console.error("Registration failed:", error);
            setSuccessMessage("Registration failed. Please try again.");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleRegistration)}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "white",
                padding: 3,
                borderRadius: 1,
                boxShadow: 3,
                zIndex: 10,
                maxWidth: "400px",
                margin: "auto",
                marginTop: "20px",
            }}
        >
            <Typography variant="h5" component="h2" align="center">
                Register
            </Typography>

            {successMessage && (
                <Alert severity={successMessage.includes("failed") ? "error" : "success"} sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <TextField
                label="Username"
                {...register("userName")}
                error={!!errors.userName}
                helperText={errors.userName?.message || "Enter a username (2-10 characters)."}
                required
            />

            <TextField
                label="Email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message || "Enter a valid email address."}
                required
            />

            <TextField
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={
                    errors.password?.message ||
                    "Password must be 6+ chars, include uppercase, lowercase, number, and special character."
                }
                required
            />

            <TextField
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message || "Re-enter your password to confirm."}
                required
            />

            <Button type="submit" variant="contained" color="primary" size="small">
                Register
            </Button>

            <Button
                variant="text"
                size="small"
                onClick={onClose}
                sx={{ alignSelf: "flex-end" }}
            >
                Close
            </Button>
        </Box>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default RegisterForm;
