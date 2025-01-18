import { useContext, useState } from "react";
import {Typography, CircularProgress, Box} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userDetailsSchema } from "../../../utils/valadition/userDetailsSchema.js";
import UserButton from "../userButton/UserButton";
import { AuthContext } from "../../../context/AuthContext";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import { fetchUserProfile, updateUserDetails } from "../../../services/apiService.js";
import { useFetchUserProfileData } from "../../../hooks/useFetchUserProfileData.js";
import { decodeToken, handleCancel, handleConfirm, handleEdit } from "./userDetailsHelpers.js";
import { useTheme } from "@mui/material/styles";
import PersonalInfoBox from "../personalInfoSchema/userInputField/personalInfoBox/PersonalInfoBox.jsx";
import UserDetailsFields from "./userDetailsFields/UserDetailsFields.jsx";
import SnackbarComponent from "../../snackbarComponent/SnackbarComponent.jsx";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SectionHeader from "./sectionHeader/SectionHeader.jsx";

const UserDetailsForm = () => {
    const { token } = useContext(AuthContext);
    const [isEditable, setIsEditable] = useState(false);
    const { fetchRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const theme = useTheme();

    const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        <PersonalInfoBox onSubmit={handleSubmit((data) =>
            handleConfirm(data, updateUserDetails, fetchRecommendedNutrition, setIsEditable)
        )}>
            <SectionHeader icon={BarChartRoundedIcon} title="Body Metrics" theme={theme} />

            <UserDetailsFields
                watchedFields={watchedFields}
                register={register}
                errors={errors}
                isEditable={isEditable}
                theme={theme}
            />
            <UserButton
                isEditable={isEditable}
                onEdit={() => handleEdit(setIsEditable)}
                onCancel={() => handleCancel(userProfile, reset, setIsEditable)}
                onConfirm={handleSubmit((data) =>
                    handleConfirm(data, updateUserDetails, fetchRecommendedNutrition, setIsEditable, setSnackbarOpen)
                )}
            />

            <SnackbarComponent
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message="Profile successfully updated!"
                severity="success"
            />
        </PersonalInfoBox>
    );
};

export default UserDetailsForm;
