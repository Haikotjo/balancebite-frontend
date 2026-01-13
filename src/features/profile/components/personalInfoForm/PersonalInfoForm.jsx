import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../../utils/valadition/personalInfoSchema.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useUpdateUserInfo from "../../utils/hooks/useUpdateUserInfo.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import { fetchUserProfile } from "../../../../services/apiService.js";
import Spinner from "../../../../components/layout/Spinner.jsx";
import {ShieldCheck} from "lucide-react";

const PersonalInfoForm = ({ onCancel, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [initialValues, setInitialValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        updateUserInfo,
        updateError,
        updateSuccess,
        setUpdateError,
        setUpdateSuccess,
    } = useUpdateUserInfo();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
        defaultValues: initialValues || {},
        mode: "onBlur",
    });

    // Fetch account details on component mount
    useEffect(() => {
        const fetchInitialValues = async () => {
            try {
                const result = await fetchUserProfile(token);
                const values = {
                    username: result.userName,
                    email: result.email,
                };
                setInitialValues(values);
                reset(values);
            } catch (err) {
                console.error("Failed to fetch user details:", err);
            }
        };

        if (token) fetchInitialValues();
    }, [token, reset]);

    /**
     * Handles personal information update.
     * Disables UI during submission and triggers success callback on completion.
     */
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Update user info via custom hook
            await updateUserInfo(data, initialValues, setInitialValues, reset, () => {});

            // Allow user to see success feedback before closing the form
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Personal info update failed:", error);
            setIsSubmitting(false);
        }
    };

    if (!initialValues) {
        return (
            <CustomBox className="flex justify-center items-center p-4">
                <Spinner />
            </CustomBox>
        );
    }

    return (
        <CustomCard className="w-full max-w-xl mx-auto my-4" hasBorder>
            <CustomBox
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                className="w-full p-4 sm:p-6 flex flex-col gap-4"
            >
                <CustomTypography variant="h2" className="flex items-center gap-2">
                    <ShieldCheck size={24} className="text-primary" />
                    Account Details
                </CustomTypography>

                {(updateError || updateSuccess) && (
                    <ErrorDialog
                        open={!!(updateError || updateSuccess)}
                        onClose={() => {
                            setUpdateError("");
                            setUpdateSuccess("");
                            // Re-enable form interactions if an error occurs
                            if (updateError) setIsSubmitting(false);
                        }}
                        message={updateError || updateSuccess}
                        type={updateError ? "error" : "success"}
                    />
                )}

                <CustomTextField
                    label="Username"
                    name="username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    variant="outlined"
                    disabled={isSubmitting}
                />

                <CustomTextField
                    label="Email"
                    name="email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                    disabled={isSubmitting}
                />

                <CustomBox className="flex gap-2">
                    <CustomButton
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        color="neutral"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton
                        type="submit"
                        variant="solid"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </CustomButton>
                </CustomBox>
            </CustomBox>
        </CustomCard>
    );
};

// Prop validation
PersonalInfoForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default PersonalInfoForm;