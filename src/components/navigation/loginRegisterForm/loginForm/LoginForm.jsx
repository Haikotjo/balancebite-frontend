import { useContext } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Alert, useTheme, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import loginSchema from "./LoginForm.js";


const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const theme = useTheme();
    const { handleLogin, errorMessage } = useLogin();
    const { resetUserMeals, fetchUserMealsData } = useContext(UserMealsContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const onSubmit = async (data) => {
        localStorage.clear();
        sessionStorage.clear();
        resetUserMeals();
        await handleLogin(data.email, data.password, async () => {
            await fetchUserMealsData();
            if (onClose) onClose();
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
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
                onSubmit={handleSubmit(onSubmit)}
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
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        marginBottom: 1,
                        fontWeight: 700,
                    }}
                >
                    Login
                </Typography>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <TextField
                    label="Email"
                    type="email"
                    size="small"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                />

                <TextField
                    label="Password"
                    type="password"
                    size="small"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    sx={{
                        color: theme.palette.text.light,
                    }}
                >
                    Login
                </Button>

                <Button
                    variant="text"
                    size="small"
                    onClick={onSwitchToRegister}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Don&#39;t have an account? Register
                </Button>
                {onClose && (
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

LoginForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
