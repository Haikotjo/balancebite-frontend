import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../../utils/valadition/personalInfoSchema.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useUpdateUserInfo from "../../utils/hooks/useUpdateUserInfo.js";
import useFetchProfile from "../../utils/hooks/useFetchProfile.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import { ShieldCheck, Save, X, Loader2 } from "lucide-react";

const PersonalInfoForm = ({ onCancel, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(personalInfoSchema),
        mode: "onBlur",
    });


    const { initialValues, setInitialValues, isLoading } = useFetchProfile(token, reset);


    const {
        updateUserInfo,
        updateError,
        updateSuccess,
        setUpdateError,
        setUpdateSuccess,
    } = useUpdateUserInfo();

    /**
     * Handles personal information update.
     */
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await updateUserInfo(data, initialValues, setInitialValues, reset, () => {});

            setTimeout(() => {
                onSuccess();
            }, 1000);
        } catch (error) {
            console.error("Personal info update failed:", error);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <CustomBox className="flex justify-center items-center p-8">
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
                            if (updateError) setIsSubmitting(false);
                        }}
                        message={updateError || updateSuccess}
                        type={updateError ? "error" : "success"}
                    />
                )}

                <CustomTextField
                    label="Username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    variant="outlined"
                    disabled={isSubmitting}
                />

                <CustomTextField
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="outlined"
                    disabled={isSubmitting}
                />

                <CustomBox className="flex gap-3 mt-6 justify-end border-t pt-4">
                    <CustomButton
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        color="error"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 transition-colors"
                    >
                        <X size={18} />
                        Cancel
                    </CustomButton>

                    <CustomButton
                        type="submit"
                        variant="solid"
                        color="primary"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 min-w-[120px] justify-center shadow-md active:scale-95 transition-transform"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </CustomButton>
                </CustomBox>
            </CustomBox>
        </CustomCard>
    );
};

PersonalInfoForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default PersonalInfoForm;