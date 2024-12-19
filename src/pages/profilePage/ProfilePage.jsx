import { Box, Typography, Card, CardContent } from '@mui/material';

const ProfilePage = () => {
    return (
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
            {/* User Details Section */}
            <Box sx={{ flex: '1 1 45%' }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            User Details
                        </Typography>
                        <Typography variant="body2">Form komt hier...</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Personal Info Section */}
            <Box sx={{ flex: '1 1 45%' }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Personal Info
                        </Typography>
                        <Typography variant="body2">Informatie komt hier...</Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ProfilePage;
