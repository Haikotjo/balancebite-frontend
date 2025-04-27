import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../../context/RecommendedNutritionContext.jsx";
import { fetchUserProfile, updateUserDetails } from "../../../services/apiService.js";
import { decodeToken } from "./userDetailsHelpers.js";
import { useFetchUserProfileData } from "../../../hooks/useFetchUserProfileData.js";
import { useUserDetailsForm } from "../../../hooks/useUserDetailsForm.js";
import { buildUserDetailsData } from "../../../utils/helpers/buildUserDetailsData.js";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomButton from "../../layout/CustomButton.jsx";
import ErrorDialog from "../../layout/ErrorDialog.jsx";
import UserDetailsFields from "./userDetailsFields/UserDetailsFields.jsx";
import Spinner from "../../layout/Spinner.jsx";

/**
 * Renders the user details form.
 * Allows viewing and editing body metrics like height, weight, age, etc.
 * Uses custom components and hooks for a clean structure.
 *
 * @returns {JSX.Element} The rendered form component.
 */
const UserDetailsForm = () => {
    const { token } = useContext(AuthContext);
    const { fetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const [isEditable, setIsEditable] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [initialValues, setInitialValues] = useState(null);

    const userProfile = useFetchUserProfileData(token, decodeToken, fetchUserProfile);
    const { register, handleSubmit, reset, watch, errors } = useUserDetailsForm(userProfile);

    /**
     * Enables form fields for editing.
     */
    const handleEdit = () => setIsEditable(true);

    /**
     * Resets the form to initial values and disables editing.
     */
    const handleCancel = () => {
        reset(initialValues);
        setIsEditable(false);
    };

    /**
     * Handles form submission.
     * Cleans data, updates user profile, and refreshes recommended nutrition.
     *
     * @param {object} data - The submitted form data.
     */
    const onSubmit = async (data) => {
        try {
            const cleanedData = buildUserDetailsData(data);
            const response = await updateUserDetails(cleanedData, token);
            if (response) {
                await fetchRecommendedNutrition();
                setSuccessMessage("Profile successfully updated!");
                setIsEditable(false);
                setInitialValues(cleanedData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Show spinner while loading user profile
    if (userProfile === undefined) {
        return <Spinner />;
    }

    return (
        <CustomBox as="form" onSubmit={handleSubmit(onSubmit)} className="w-full p-2 flex flex-col gap-4 my-4">
            <CustomTypography as="h2" variant="h1" className="text-left">
                Body Metrics
            </CustomTypography>

            {successMessage && (
                <ErrorDialog
                    open={!!successMessage}
                    onClose={() => setSuccessMessage("")}
                    message={successMessage}
                    type="success"
                />
            )}

            <UserDetailsFields
                watchedFields={watch()}
                register={register}
                errors={errors}
                isEditable={isEditable}
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

export default UserDetailsForm;
