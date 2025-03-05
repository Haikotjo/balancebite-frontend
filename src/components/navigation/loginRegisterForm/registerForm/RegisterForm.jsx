import { Box, TextField, Button, Alert, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { registerUserApi } from "../../../../services/apiService.js";

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

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const theme = useTheme();
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { handleLogin } = useLogin();
    const { resetUserMeals, fetchUserMealsData } = useContext(UserMealsContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
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
                if (onClose) onClose(); // Sluit popup als de prop bestaat
                navigate("/meals");
            });
        } catch (error) {
            console.error("Registration failed:", error);
            setSuccessMessage("Registration failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: onClose ? "auto" : "100vh", // Alleen 100vh op de pagina, niet in de popup
                ...(onClose && {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: theme.palette.action.disabledBackground,
                    zIndex: 1300,
                }),
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(handleRegistration)}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "90%",
                    maxWidth: 400,
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
                    type="text"
                    {...register("userName")}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    required
                />

                <TextField
                    label="Email"
                    type="email"
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

                <Button type="submit" variant="contained" size="small"
                        sx={{
                            color: theme.palette.text.light, // Tekst uit theme
                        }}
                >
                    Register
                </Button>

                <Button
                    variant="text"
                    size="small"
                    onClick={onSwitchToLogin}
                    sx={{ display: "block", margin: "10px auto" }}
                >
                    Already have an account? Login
                </Button>

                {onClose && ( // Close button alleen tonen als het een popup is
                    <Button
                        variant="text"
                        size="small"
                        onClick={onClose}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        Close
                    </Button>
                )}
            </Box>
        </Box>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func, // Niet verplicht meer
    onSwitchToLogin: PropTypes.func.isRequired,
};

export default RegisterForm;
