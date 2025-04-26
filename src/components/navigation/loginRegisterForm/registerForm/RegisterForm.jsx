// src/components/RegisterForm.jsx
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerSchema from "../../../../utils/helpers/registerSchema.js";
import CustomBox from "../../../layout/CustomBox.jsx";
import CustomButton from "../../../layout/CustomButton.jsx";
import ErrorDialog from "../../../layout/ErrorDialog.jsx";
import useRegister from "../../../../hooks/useRegister.js";
import CustomTextField from "../../../layout/CustomTextField.jsx";
import CustomTypography from "../../../layout/CustomTypography.jsx";
import clsx from "clsx";

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
                className={clsx(
                    "w-full max-w-md p-6 rounded-lg shadow-md border border-primary",
                    !onClose && "mt-10"
                )}
            >
            <form onSubmit={handleSubmit((data) => handleRegistration(data, onClose))} className="flex flex-col
                    gap-4">
                <CustomTypography
                    as="h2"
                    variant="h1"
                    className="text-center"
                >
                    Register
                </CustomTypography>


                {successMessage && (
                        <CustomBox className="text-sm p-2 rounded text-green-700 bg-green-100">
                            {successMessage}
                        </CustomBox>
                    )}

                <CustomTextField
                    label="Username"
                    name="userName"
                    register={register}
                    error={errors.userName}
                    helperText={errors.userName?.message}
                />

                <CustomTextField
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    helperText={errors.email?.message}
                />

                <CustomTextField
                    label="Password"
                    name="password"
                    type="password"
                    register={register}
                    error={errors.password}
                    helperText={errors.password?.message}
                />

                <CustomTextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    register={register}
                    error={errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />

                <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white py-2 mt-2 self-stretch"
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
                            className=" hover:underline self-end bg-transparent px-0 py-0text-lightText dark:text-darkText"
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
