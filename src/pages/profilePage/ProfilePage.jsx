import { Box, Card, CardContent } from "@mui/material";
import UserDetailsForm from "../../components/userForm/userDetailsForm/UserDetailsForm.jsx";
import PersonalInfoForm from "../../components/userForm/personalInfoSchema/PersonalInfoForm.jsx";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";

const ProfilePage = () => {
    // Placeholder submit handlers
    const handleUserDetailsSubmit = (data) => {
        console.log("User Details Submitted:", data);
    };

    const handlePersonalInfoSubmit = (data) => {
        console.log("Personal Info Submitted:", data);
    };

    return (
        <Box
            sx={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            {/* Personal Info Section */}
            <Box sx={{ flex: "1 1 auto" }}>
                <Card>
                    <CardContent>
                        <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
                    </CardContent>
                </Card>
            </Box>

            {/* User Details Section */}
            <Box sx={{ flex: "1 1 auto" }}>
                <Card>
                    <CardContent>
                        <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
                    </CardContent>
                </Card>
            </Box>

            {/* Recommended Nutrition Section */}
            <Box sx={{ flex: "1 1 auto" }}>
                <Card>
                    <CardContent>
                        <RecommendedNutritionDisplay />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ProfilePage;
