import { useContext, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";
import UserButton from "../userButton/UserButton";
import { AuthContext } from "../../../context/AuthContext";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import { fetchUserProfile, updateUserDetails } from "../../../services/apiService.js";
import { useFetchUserProfileData } from "../../../hooks/useFetchUserProfileData.js";
import { renderTextField } from "./renderTextField.jsx";
import { genderOptions, activityLevelOptions, goalOptions } from "./dropdownOptions.js";
import { decodeToken, handleCancel, handleConfirm, handleEdit } from "./userDetailsHelpers.js";

const UserDetailsForm = () => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const { fetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(userDetailsSchema),
        mode: "onBlur",
    });

    const userProfile = useFetchUserProfileData(token, decodeToken, fetchUserProfile, reset);
    const watchedFields = watch();


    if (userProfile === null) {
        return (
            <Typography variant="h6" align="center">
                No profile data found. Please complete your profile to get started.
            </Typography>
        );
    }

    if (!userProfile) {
        return <CircularProgress />;
    }

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit((data) =>
                handleConfirm(data, updateUserDetails, fetchRecommendedNutrition, setIsEditable)
            )}
        >
            <Typography variant="h4" align="left">
                Body Metrics
            </Typography>

            {renderTextField("Gender", "gender", watchedFields, register, errors, isEditable, "text", true, genderOptions)}

            {renderTextField(
                "Activity Level",
                "activityLevel",
                watchedFields,
                register,
                errors,
                isEditable,
                "text",
                true,
                activityLevelOptions
            )}

            {renderTextField("Goal", "goal", watchedFields, register, errors, isEditable, "text", true, goalOptions)}

            {renderTextField("Height (cm)", "height", watchedFields, register, errors, isEditable, "number")}

            {renderTextField("Weight (kg)", "weight", watchedFields, register, errors, isEditable, "number")}

            {renderTextField("Age", "age", watchedFields, register, errors, isEditable, "number")}

            <UserButton
                isEditable={isEditable}
                onEdit={() => handleEdit(setIsEditable)}
                onCancel={() => handleCancel(userProfile, reset, setIsEditable)}
                onConfirm={handleSubmit((data) =>
                    handleConfirm(data, updateUserDetails, fetchRecommendedNutrition, setIsEditable)
                )}
            />
        </Box>
    );
};

export default UserDetailsForm;
