import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerSchema from "../../../../utils/helpers/registerSchema.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import useRegister from "../../../../hooks/useRegister.js";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";
import CustomSelect from "../../../../components/layout/CustomSelect.jsx";
import {useState} from "react";
import CustomCard from "../../../../components/layout/CustomCard.jsx";

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

            <CustomCard
                className={clsx(
                    "w-full max-w-md p-6 border border-primary",
                    !onClose && "mt-12"
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
                        variant="outlined"
                        {...register("userName")}
                        error={!!errors.userName}
                        helperText={errors.userName?.message}
                    />

                    <CustomTextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <CustomTextField
                        label="Password"
                        name="password"
                        variant="outlined"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <CustomTextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        variant="outlined"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
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
                        <CustomTypography
                            as="button"
                            onClick={onSwitchToLogin}
                            variant="paragraph"
                            weight="normal"
                            className="text-primary self-start bg-transparent"
                            inheritColor={true}
                        >
                            Already have an account?{" "}

                            <CustomTypography
                                as="span"
                                variant="paragraph"
                                inheritColor={true}
                                weight="bold"
                                italic
                                className="underline"
                            >
                                Login
                            </CustomTypography>
                        </CustomTypography>
                    )}

                    {onClose && (
                        <CustomButton
                            onClick={onClose}
                            className=" hover:underline self-end bg-transparent px-0 py-0 text-lightText dark:text-darkText"
                        >
                            Close
                        </CustomButton>
                    )}
                </form>
            </CustomCard>
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
