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

            <CustomBox className="w-full max-w-md p-6 bg-white dark:bg-darkBackground rounded-lg shadow-md text-black dark:text-white">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    <CustomBox>
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </CustomBox>

                    <CustomBox>
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </CustomBox>

                    <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 self-stretch"
                    >
                        Login
                    </CustomButton>

                    <CustomButton
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline bg-transparent px-0 py-0 self-start"
                    >
                        Don't have an account? Register
                    </CustomButton>

                    {onClose && (
                        <CustomButton
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:underline bg-transparent px-0 py-0 self-end"
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
