import { useContext, useState } from "react";
import PropTypes from "prop-types"; // Added for prop validation
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { fetchUserProfile, updateUserDetails } from "../../../../services/apiService.js";
import { decodeToken } from "../../utils/helpers/userDetailsHelpers.js";
import { useFetchUserProfileData } from "../../utils/hooks/useFetchUserProfileData.js";
import { useUserDetailsForm } from "../../utils/hooks/useUserDetailsForm.js";
import { buildUserDetailsData } from "../../utils/helpers/buildUserDetailsData.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import UserDetailsFields from "../userDetailsFields/UserDetailsFields.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import {Scale} from "lucide-react";

const UserDetailsForm = ({ onCancel, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const { fetchRecommendedNutrition } = useContext(RecommendedNutritionContext);

    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch initial user profile data for the form
    const userProfile = useFetchUserProfileData(token, decodeToken, fetchUserProfile);

    // Initialize form logic via custom hook
    const { register, handleSubmit, watch, errors, setValue } = useUserDetailsForm(userProfile);

    /**
     * Form submission handler
     * Processes body metrics data and updates the user profile.
     */
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const cleanedData = buildUserDetailsData(data);
            const response = await updateUserDetails(cleanedData, token);

            if (response) {
                // Refresh global nutrition context based on new metrics
                await fetchRecommendedNutrition();
                setSuccessMessage("Profile successfully updated!");

                // Briefly display success message before returning to view mode
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            }
        } catch (error) {
            console.error("Update failed:", error);
            setIsSubmitting(false); // Re-enable buttons if update fails
        }
    };

    if (userProfile === undefined) {
        return <Spinner />;
    }

    return (
        <CustomCard className="w-full max-w-xl mx-auto my-4" hasBorder>
            <CustomBox
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                className="w-full p-4 sm:p-6 flex flex-col gap-4"
            >
                <CustomTypography variant="h2" className="flex items-center gap-2">
                    <Scale size={24} className="text-primary" />
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
                    setValue={setValue}
                    errors={errors}
                    isEditable={true}
                />

                <CustomBox className="flex gap-2">
                    <CustomButton
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-400 text-white"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </CustomButton>
                    <CustomButton
                        type="submit"
                        className="bg-primary text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </CustomButton>
                </CustomBox>
            </CustomBox>
        </CustomCard>
    );
};

// Define prop types for better development debugging and documentation
UserDetailsForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default UserDetailsForm;