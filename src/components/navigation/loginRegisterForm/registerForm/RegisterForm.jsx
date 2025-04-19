// src/components/forms/RegisterForm.jsx
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerSchema from "../../../../utils/helpers/registerSchema.js";
import CustomBox from "../../../layout/CustomBox.jsx";
import CustomButton from "../../../layout/CustomButton.jsx";
import ErrorDialog from "../../../layout/ErrorDialog.jsx";
import useRegister from "../../../../hooks/useRegister.js";

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const { handleRegistration, errorMessage, successMessage, setErrorMessage } = useRegister();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
    });

    return (
        <>
            <ErrorDialog
                open={!!errorMessage}
                onClose={() => setErrorMessage("")}
                message={errorMessage}
            />

            <CustomBox
                className="w-full max-w-md p-6 bg-white dark:bg-darkBackground rounded-lg shadow-md text-black dark:text-white">
                <form onSubmit={handleSubmit((data) => handleRegistration(data, onClose))} className="flex flex-col
                    gap-4">
                    <h2 className="text-2xl font-bold text-center">Register</h2>

                    {successMessage && (
                        <CustomBox className="text-sm p-2 rounded text-green-700 bg-green-100">
                            {successMessage}
                        </CustomBox>
                    )}

                    <CustomBox>
                        <label htmlFor="userName" className="block mb-1 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="userName"
                            {...register("userName")}
                            className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                        />
                        {errors.userName && (
                            <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
                        )}
                    </CustomBox>

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

                    <CustomBox>
                        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register("confirmPassword")}
                            className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </CustomBox>

                    <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 self-stretch"
                    >
                        Register
                    </CustomButton>

                    <CustomButton
                        onClick={onSwitchToLogin}
                        className="text-primary hover:underline self-start bg-transparent px-0 py-0"
                    >
                        Already have an account? Login
                    </CustomButton>

                    {onClose && (
                        <CustomButton
                            onClick={onClose}
                            className="text-gray-600 hover:underline self-end bg-transparent px-0 py-0"
                        >
                            Close
                        </CustomButton>
                    )}
                </form>
            </CustomBox>
        </>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToLogin: PropTypes.func.isRequired,
};

export default RegisterForm;
