import UserDetailsForm from "../../components/userForm/userDetailsForm/UserDetailsForm.jsx";
import PersonalInfoForm from "../../components/userForm/personalInfoSchema/PersonalInfoForm.jsx";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";

/**
 * ProfilePage component
 *
 * Displays the user's personal information, user details, and recommended nutrition overview.
 * Designed with Tailwind and custom components to allow easier future migration to React Native.
 *
 * @returns {JSX.Element} The rendered profile page.
 */
const ProfilePage = () => {
    /**
     * Handles submission of user details form.
     *
     * @param {Object} data - Submitted user details.
     */
    const handleUserDetailsSubmit = (data) => {
        console.log("User Details Submitted:", data);
    };

    /**
     * Handles submission of personal information form.
     *
     * @param {Object} data - Submitted personal information.
     */
    const handlePersonalInfoSubmit = (data) => {
        console.log("Personal Info Submitted:", data);
    };

    return (
        <CustomBox className="flex flex-col gap-5 p-5">
            {/* Personal Info & User Details Section */}
            <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Personal Information Form */}
                <CustomBox className="bg-cardLight dark:bg-cardDark rounded shadow p-4">
                    <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
                </CustomBox>

                {/* User Details Form */}
                <CustomBox className="bg-cardLight dark:bg-cardDark rounded shadow p-4">
                    <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
                </CustomBox>
            </CustomBox>

            {/* Recommended Nutrition Section */}
            <CustomBox className="flex flex-col flex-1 mt-2">
                <CustomTypography variant="h3" className="text-center mb-4">
                    Daily Nutrition Overview
                </CustomTypography>

                {/* Displaying both user-specific and base recommended nutrition */}
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <CustomBox>
                        <RecommendedNutritionDisplay />
                    </CustomBox>
                    <CustomBox>
                        <RecommendedNutritionDisplay useBaseRDI={true} />
                    </CustomBox>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

export default ProfilePage;
