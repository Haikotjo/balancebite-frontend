import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { personalInfoSchema } from "../../../../utils/valadition/personalInfoSchema.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useUpdateUserInfo from "../utils/hooks/useUpdateUserInfo.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import { fetchUserProfile } from "../../../../services/apiService.js";
import Spinner from "../../../../components/layout/Spinner.jsx";

const PersonalInfoForm = () => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

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

        if (token) {
            fetchInitialValues();
        }
    }, [token, reset]);

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
                <CustomTypography as="h2" variant="h1" className="text-left">
                    Personal Information
                </CustomTypography>

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

                <CustomTextField
                    label="Username"
                    name="username"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    disabled={!isEditable}
                    variant="outlined"
                />

                <CustomTextField
                    label="Email"
                    name="email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={!isEditable}
                    variant="outlined"
                />

                {isEditable ? (
                    <CustomBox className="flex gap-2">
                        <CustomButton
                            type="button"
                            onClick={handleCancel}
                            variant="outline"
                            color="neutral"
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" variant="solid" color="primary">
                            Save
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <CustomButton
                        type="button"
                        onClick={handleEdit}
                        variant="solid"
                        color="primary"
                        className="self-start"
                    >
                        Edit
                    </CustomButton>
                )}
            </CustomBox>
        </CustomCard>
    );
};

export default PersonalInfoForm;
