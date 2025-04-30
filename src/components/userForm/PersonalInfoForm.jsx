import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../utils/valadition/personalInfoSchema.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import useUpdateUserInfo from "../../hooks/useUpdateUserInfo.js";
import useUserInitialValues from "../../hooks/useUserInitialValues.js";

import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import CustomTextField from "../layout/CustomTextField.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

/**
 * Form for viewing and editing personal information.
 * Mirrors the structure of CreateMealForm to prepare for easier React Native migration.
 *
 * @returns {JSX.Element} Rendered personal info form.
 */
const PersonalInfoForm = () => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useUserInitialValues(token);

    const { updateUserInfo, updateError, updateSuccess, setUpdateError, setUpdateSuccess } = useUpdateUserInfo();

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

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    const handleEdit = () => setIsEditable(true);

    const handleCancel = () => {
        reset(initialValues);
        setIsEditable(false);
    };

    const onSubmit = async (data) => {
        await updateUserInfo(data, initialValues, setInitialValues, reset, setIsEditable);
    };

    if (!initialValues) {
        return (
            <CustomBox className="flex justify-center items-center p-4">
                <CustomTypography variant="paragraph">Loading...</CustomTypography>
            </CustomBox>
        );
    }

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full p-2 flex flex-col gap-4 my-4"
        >
            <CustomTypography as="h2" variant="h1" className="text-left">
                Personal Information
            </CustomTypography>

            {/* Error or success messages */}
            {(updateError || updateSuccess) && (
                <ErrorDialog
                    open={!!(updateError || updateSuccess)}
                    onClose={() => {
                        setUpdateError("");
                        setUpdateSuccess("");
                    }}
                    message={updateError || updateSuccess}
                    type={updateError ? "error" : "success"}
                />
            )}

            {/* Username input field */}
            <CustomTextField
                label="Username"
                name="username"
                register={register}
                error={errors.username}
                helperText={errors.username?.message}
                disabled={!isEditable}
                className={!isEditable ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            />

            {/* Email input field */}
            <CustomTextField
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                helperText={errors.email?.message}
                disabled={!isEditable}
            />

            {/* Action buttons */}
            {isEditable ? (
                <CustomBox className="flex gap-2">
                    <CustomButton type="button" onClick={handleCancel} className="bg-gray-400 text-white">
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="bg-primary text-white">
                        Save
                    </CustomButton>
                </CustomBox>
            ) : (
                <CustomButton type="button" onClick={handleEdit} className="bg-primary text-white self-start">
                    Edit
                </CustomButton>
            )}
        </CustomBox>
    );
};

export default PersonalInfoForm;
