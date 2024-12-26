import { Box, Typography, Button, Grid, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FeatureCard from '../../components/home/featureCard/FeatureCard.jsx';

function HomePage() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: 2,
                textAlign: 'center',
            }}
        >
            {/* Header Section */}
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    marginBottom: 3,
                    color: theme.palette.primary.main,
                }}
            >
                Welcome to BalanceBite
            </Typography>
            <Typography
                variant="h6"
                component="p"
                sx={{
                    maxWidth: 600,
                    marginBottom: 3,
                    color: theme.palette.text.primary,
                }}
            >
                Balance your nutrition and achieve your health goals with ease. Get personalized recommendations, track meals, and gain insights into your daily and weekly nutrition.
            </Typography>

            {/* Features Section */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingY: 4,
                    width: '100%',
                    maxWidth: 1200, // Limiteer de breedte
                    color: theme.palette.primary.main,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontFamily: "'Pacifico', cursive",
                        marginBottom: 5,
                    }}
                >
                    Why Choose BalanceBite?
                </Typography>

                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    sx={{
                        width: '100%',
                        maxWidth: 1200, // Limiteer breedte voor consistentie
                        paddingX: 2,
                    }}
                >
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FeatureCard
                            title="Personalized Recommendations"
                            description="Get daily and weekly tailored suggestions based on your body type and health goals."
                            colorKey="error"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FeatureCard
                            title="Meal Tracking Made Easy"
                            description="Add, save, and track your meals. See how each meal impacts your daily nutrition goals."
                            colorKey="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <FeatureCard
                            title="Vitamins & Minerals Insights"
                            description="Track your intake of essential vitamins and minerals (coming soon!)."
                            colorKey="success"
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Footer Links */}
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="body2" component="p" sx={{ marginBottom: 1 }}>
                    Learn more about:
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Link href="/about" underline="hover">
                            About BalanceBite
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/contact" underline="hover">
                            Contact Us
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default HomePage;
