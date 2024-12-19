import { Box, Typography, Card, CardContent } from "@mui/material";
import UserDetailsForm from "../../components/userForm/userDetailsForm/UserDetailsForm.jsx";
import PersonalInfoForm from "../../components/userForm/personalInfoSchema/PersonalInfoForm.jsx";

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
                flexDirection: "row",
                gap: "20px",
                flexWrap: "wrap",
            }}
        >
            {/* User Details Section */}
            <Box sx={{ flex: "1 1 45%" }}>
                <Card>
                    <CardContent>
                        <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
                    </CardContent>
                </Card>
            </Box>

            {/* Personal Info Section */}
            <Box sx={{ flex: "1 1 45%" }}>
                <Card>
                    <CardContent>
                        <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ProfilePage;
