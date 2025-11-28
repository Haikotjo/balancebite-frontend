import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import loginSchema from "./LoginForm.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";

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
            await handleLogin(data.email.toLowerCase(), data.password, async () => {
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

            <CustomBox
                className={clsx(
                    "w-full max-w-md p-6 rounded-lg shadow-md border border-primary",
                    !onClose && "mt-12"
                )}
            >

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <CustomTypography
                        as="h2"
                        variant="h1"
                        className="text-center"
                    >
                        Login
                    </CustomTypography>

                <CustomTextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <CustomTextField
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />



                <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white py-2 mt-2  self-stretch"
                    >
                        Login
                    </CustomButton>

                <CustomTypography
                    as="button"
                    onClick={onSwitchToRegister}
                    variant="paragraph"
                    weight="bold"
                    className="text-primary self-start bg-transparent"
                    inheritColor={true}
                >
                    Don't have an account? <span className="underline">Register</span>
                </CustomTypography>

                {onClose && (
                        <CustomButton
                            type="button"
                            onClick={onClose}
                            className="hover:underline bg-transparent mt-2 self-end text-lightText dark:text-darkText"
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
