import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerSchema from "../../../../utils/helpers/registerSchema.js";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import useRegister from "../../../../hooks/useRegister.js";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import clsx from "clsx";
import { useState, useEffect } from "react";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import { getMappedFoodSources } from "../../../../services/apiService.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

/**
 * RegisterForm handles user creation.
 * Optimized with overflow-visible and manual field registration for foodSource.
 */
const RegisterForm = ({ onClose, onSwitchToLogin, showRoles = false, isAdminContext = false }) => {
    const { handleRegistration, errorMessage, successMessage, setErrorMessage, setSuccessMessage } = useRegister();
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedFoodSource, setSelectedFoodSource] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            roles: ["USER"],
            foodSource: null,
        },
    });

    /**
     * Manually register the foodSource field since it's managed by a custom select component.
     */
    useEffect(() => {
        register("foodSource");
    }, [register]);

    /**
     * Fetch available food sources if role selection is enabled.
     */
    useEffect(() => {
        if (showRoles) {
            const fetchSources = async () => {
                try {
                    const sources = await getMappedFoodSources();
                    setFoodSourceOptions(sources);
                } catch (e) {
                    console.error("Failed to fetch food sources", e);
                }
            };
            fetchSources();
        }
    }, [showRoles]);

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
                    "w-full max-w-md p-6 border border-primary overflow-visible",
                    !onClose && "mt-12"
                )}
            >
                <form
                    onSubmit={handleSubmit((data) => {
                        handleRegistration(data, onClose, isAdminContext);
                    })}
                    className="flex flex-col gap-4 overflow-visible"
                >
                    <CustomTypography as="h2" variant="h1" className="text-center">
                        Register
                    </CustomTypography>

                    <CustomTextField
                        label="Username"
                        name="userName"
                        {...register("userName")}
                        error={!!errors.userName}
                        helperText={errors.userName?.message}
                    />

                    <CustomTextField
                        label="Email"
                        name="email"
                        type="email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <CustomTextField
                        label="Password"
                        name="password"
                        type="password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <CustomTextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />

                    {showRoles && (
                        <CustomBox className="flex flex-col gap-4 z-20">
                            {/* Role Selection */}
                            <CustomFloatingSelect
                                label="Role"
                                value={selectedRole ? {value: selectedRole, label: selectedRole} : null}
                                options={[
                                    {value: "USER", label: "USER"},
                                    {value: "ADMIN", label: "ADMIN"},
                                    {value: "CHEF", label: "CHEF"},
                                    {value: "SUPERMARKET", label: "SUPERMARKET"},
                                    {value: "RESTAURANT", label: "RESTAURANT"},
                                    {value: "DIETITIAN", label: "DIETITIAN"},
                                ]}
                                onChange={(val) => {
                                    const roleVal = val?.value || "";
                                    setSelectedRole(roleVal);
                                    setValue("roles", [roleVal]);

                                    // Reset foodSource if the role is no longer SUPERMARKET
                                    if (roleVal !== "SUPERMARKET") {
                                        setValue("foodSource", null);
                                        setSelectedFoodSource(null);
                                    }
                                }}
                                placeholder="Select a role"
                            />
                            {errors.roles && (
                                <p className="text-red-500 text-xs mt-1">{errors.roles.message}</p>
                            )}

                            {/* Supermarket Source Selection - Only shown if role is SUPERMARKET */}
                            {selectedRole === "SUPERMARKET" && (
                                <CustomBox className="relative z-30">
                                    <CustomFloatingSelect
                                        label="Select Supermarket Source"
                                        options={foodSourceOptions}
                                        value={selectedFoodSource}
                                        onChange={(val) => {
                                            setSelectedFoodSource(val);
                                            // Force the value into the form state with validation trigger
                                            setValue("foodSource", val?.value || null, {
                                                shouldValidate: true,
                                                shouldDirty: true
                                            });
                                        }}
                                        placeholder="Select predefined food source"
                                    />
                                    {errors.foodSource && (
                                        <p className="text-red-500 text-xs mt-1">{errors.foodSource.message}</p>
                                    )}
                                </CustomBox>
                            )}
                        </CustomBox>
                    )}

                    <CustomButton
                        type="submit"
                        className="bg-primary hover:bg-primary-light text-white py-2 mt-2 self-stretch"
                        disabled={selectedRole === "SUPERMARKET" && !selectedFoodSource}
                    >
                        <CustomTypography variant="paragraph" weight="bold" as="span" inheritColor
                                          className="text-center w-full">
                            Register
                        </CustomTypography>
                    </CustomButton>

                    {!isAdminContext && (
                        <CustomTypography
                            as="button"
                            type="button"
                            onClick={onSwitchToLogin}
                            variant="small"
                            className="text-primary self-start bg-transparent"
                        >
                            Already have an account? <span className="underline font-bold italic">Login</span>
                        </CustomTypography>
                    )}

                    {onClose && (
                        <CustomButton variant="outline" color="error" type="button" onClick={onClose}
                                      className="self-end w-auto text-sm">
                            <CustomTypography variant="small" as="span" inheritColor>Close</CustomTypography>
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