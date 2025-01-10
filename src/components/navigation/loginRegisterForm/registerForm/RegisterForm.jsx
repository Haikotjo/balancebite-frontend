import { Box, TextField, Button, Alert, Collapse, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import {registerUserApi} from "../../../../services/apiService.js"; // Importeer de UserMealsContext

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
        .matches(/[!@#$%^&*()_+=-]/, "Password must include a special character.")
        .required("Password is required."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords do not match.")
        .required("Please confirm your password."),
});

const RegisterForm = ({ onClose }) => {
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { handleLogin } = useLogin();
    const { resetUserMeals, fetchUserMealsData } = useContext(UserMealsContext); // Haal functies uit de context

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
            localStorage.clear();
            sessionStorage.clear();
            resetUserMeals();

            const responseData = await registerUserApi(data);
            const { accessToken, refreshToken } = responseData;

            if (!accessToken || !refreshToken) {
                throw new Error("Invalid response from server.");
            }

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            await handleLogin(data.email, data.password, async () => {
                await fetchUserMealsData();
                onClose();
                navigate("/meals");
            });
        } catch (error) {
            console.error("Registration failed:", error);
            setSuccessMessage("Registration failed. Please try again.");
        }
    };

    return (
        <Collapse in={true}>
            <Box
                component="form"
                onSubmit={handleSubmit(handleRegistration)}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 10,
                    position: "absolute",
                    top: "100%", // Direct onder de navbar
                    right: 16,    // Aan de rechterkant uitgelijnd
                    width: {
                        xs: "90vw", // 90% van schermbreedte voor mobiel
                        sm: 300,    // Standaardbreedte voor tablets en groter
                        md: 400,    // Grotere breedte voor desktops
                    },
                    maxWidth: 400, // Maximale breedte beperken
                    transition: "all 0.3s ease-in-out", // Zachte overgang bij grootte-aanpassingen
                }}
            >
                <Typography variant="h5" component="h2" align="center">
                    Register
                </Typography>

                {successMessage && (
                    <Alert severity={successMessage.includes("failed") ? "error" : "success"}>
                        {successMessage}
                    </Alert>
                )}

                <TextField
                    label="Username"
                    {...register("userName")}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    required
                />

                <TextField
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                />

                <TextField
                    label="Password"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    required
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
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
        </Collapse>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default RegisterForm;
