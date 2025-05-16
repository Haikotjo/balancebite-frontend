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
import {fetchUserProfile} from "../../../../services/apiService.js";

const PersonalInfoForm = () => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const [initialValues, setInitialValues] = useState(null);

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
        const fetchInitialValues = async () => {
            try {
                const result = await fetchUserProfile(token);
                setInitialValues({
                    username: result.userName,
                    email: result.email,
                });
                reset({
                    username: result.userName,
                    email: result.email,
                });
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
                error={errors.username}
                helperText={errors.username?.message}
                disabled={!isEditable}
                className={!isEditable ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            />

            <CustomTextField
                label="Email"
                name="email"
                type="email"
                {...register("email")}
                error={errors.email}
                helperText={errors.email?.message}
                disabled={!isEditable}
            />

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
