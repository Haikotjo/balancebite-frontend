// src/components/forms/LoginForm.jsx
import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import loginSchema from "./LoginForm.js";
import CustomBox from "../../../layout/CustomBox.jsx";
import CustomButton from "../../../layout/CustomButton.jsx";
import ErrorDialog from "../../../layout/ErrorDialog.jsx";
import CustomTextField from "../../../layout/CustomTextField.jsx";

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const { handleLogin } = useLogin();
    const { fetchUserMealsData } = useContext(UserMealsContext);

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
        setErrorMessage("");
        try {
            localStorage.clear();
            sessionStorage.clear();
            await handleLogin(data.email, data.password, async () => {
                await fetchUserMealsData();
                if (onClose) onClose();
            });
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMessage(err.message);
        }
    };

    return (
        <>
            <ErrorDialog
                open={!!errorMessage}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />

            <CustomBox    className="w-full max-w-md p-6 mt-4 rounded-lg shadow-md border border-primary">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    <CustomTextField
                        label="Email"
                        name="email"
                        register={register}
                        error={errors.email}
                    />

                    <CustomTextField
                        label="Password"
                        name="password"
                        type="password"
                        register={register}
                        error={errors.password}
                    />

                    <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white py-2 mt-2  self-stretch"
                    >
                        Login
                    </CustomButton>

                    <CustomButton
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline bg-transparent self-start"
                    >
                        Don't have an account? Register
                    </CustomButton>

                    {onClose && (
                        <CustomButton
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:underline bg-transparent mt-2 self-end"
                        >
                            Close
                        </CustomButton>
                    )}
                </form>
            </CustomBox>
        </>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
