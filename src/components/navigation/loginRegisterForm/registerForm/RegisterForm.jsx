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
import CustomSelect from "../../../layout/CustomSelect.jsx";
import {useState} from "react";

const RegisterForm = ({ onClose, onSwitchToLogin, showRoles = false, isAdminContext = false }) => {
    const { handleRegistration, errorMessage, successMessage, setErrorMessage, setSuccessMessage } = useRegister();


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            roles: ["USER"],
        },
    });

    const [selectedRole, setSelectedRole] = useState("");


    return (
        <>
            <ErrorDialog
                open={!!errorMessage || !!successMessage}
                onClose={() => {
                    if (errorMessage) setErrorMessage("");
                    if (successMessage) setSuccessMessage("");
                }}
                message={errorMessage || successMessage}
                type={successMessage ? "success" : "error"}
            />

            <CustomBox
                className={clsx(
                    "w-full max-w-md p-6 rounded-lg shadow-md border border-primary",
                    !onClose && "mt-10"
                )}
            >
                <form onSubmit={handleSubmit((data) => handleRegistration(data, onClose, isAdminContext))} className="flex flex-col
                    gap-4">
                    <CustomTypography
                        as="h2"
                        variant="h1"
                        className="text-center"
                    >
                        Register
                    </CustomTypography>

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

                    {showRoles && (
                        <CustomSelect
                            name="roles"
                            label="Role"
                            register={null}
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setValue("roles", [e.target.value]);
                            }}
                            error={!!errors.roles}
                            helperText={errors.roles?.message}
                            options={[
                                { value: "USER", label: "USER" },
                                { value: "ADMIN", label: "ADMIN" },
                                { value: "CHEF", label: "CHEF" },
                            ]}
                        />
                    )}

                    <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white py-2 mt-2 self-stretch"
                    >
                        Register
                    </CustomButton>

                    {!isAdminContext && (
                        <CustomButton
                            onClick={onSwitchToLogin}
                            className="text-primary hover:underline self-start bg-transparent px-0 py-0"
                        >
                            Already have an account? Login
                        </CustomButton>
                    )}

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
    onSwitchToLogin: PropTypes.func,
    showRoles: PropTypes.bool,
    isAdminContext: PropTypes.bool,
};

export default RegisterForm;
