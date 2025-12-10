import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import loginSchema from "./LoginForm.js";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";

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

            <CustomCard
                className={clsx(
                    "w-full max-w-md p-6 border border-primary",
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
                        className="bg-primary hover:bg-primary-dark text-white mt-2 self-stretch"
                    >
                        <CustomTypography
                            variant="paragraph"
                            weight="bold"
                            as="span"
                            inheritColor
                            className="text-center w-full"
                        >
                            Login
                        </CustomTypography>
                    </CustomButton>


                    <CustomTypography
                        as="button"
                        onClick={onSwitchToRegister}
                        variant="paragraph"
                        weight="normal"
                        inheritColor={true}
                        className="text-primary bg-transparent self-start"
                    >
                        Don't have an account?{" "}

                        <CustomTypography
                            as="span"
                            variant="paragraph"
                            inheritColor={true}
                            weight="bold"

                            className="underline"
                        >
                            Register
                        </CustomTypography>
                    </CustomTypography>


                    {onClose && (
                        <CustomButton
                            variant="outline"
                            color="error"
                            type="button"
                            onClick={onClose}
                            className="self-end w-auto text-sm"
                        >
                            <CustomTypography
                                variant="small"
                                weight="bold"
                                as="span"
                                inheritColor
                            >
                                Close
                            </CustomTypography>
                        </CustomButton>

                    )}
                </form>
            </CustomCard>
        </>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
