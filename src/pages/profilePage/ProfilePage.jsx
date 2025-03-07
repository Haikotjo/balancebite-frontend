import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import UserDetailsForm from "../../components/userForm/userDetailsForm/UserDetailsForm.jsx";
import PersonalInfoForm from "../../components/userForm/personalInfoSchema/PersonalInfoForm.jsx";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";

const ProfilePage = () => {
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
            {/* Personal Info & User Details Section */}
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ flex: "1 1 auto", marginTop: 2 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Daily Nutrition Overview
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>

                        <RecommendedNutritionDisplay />
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <RecommendedNutritionDisplay useBaseRDI={true} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ProfilePage;
