import { Box, Typography, Button, Link, Card, CardContent, Grid } from '@mui/material';

function HomePage() {
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
                }}
            >
                Balance your nutrition and achieve your health goals with ease. Get personalized recommendations, track meals, and gain insights into your daily and weekly nutrition.
            </Typography>

            {/* Call-to-Action */}
            <Button
                variant="contained"
                size="large"
                sx={{
                    marginBottom: 4,
                    paddingX: 4,
                }}
                href="/signup"
            >
                Start Now
            </Button>

            {/* Features Section */}
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    marginBottom: 2,
                }}
            >
                Why Choose BalanceBite?
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {/* Feature Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: 300,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{
                                    fontFamily: "'Lobster', cursive", // Levendige stijl voor de titel
                                    color: '#4caf50',
                                }}
                            >
                                Personalized Recommendations
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontStyle: 'italic', // Schuine tekst
                                }}
                            >
                                Get daily and weekly tailored suggestions based on your body type and health goals.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: 300,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{
                                    fontFamily: "'Raleway', sans-serif", // Strak en modern lettertype
                                    color: '#3f51b5',
                                }}
                            >
                                Meal Tracking Made Easy
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontStyle: 'italic', // Schuine tekst
                                }}
                            >
                                Add, save, and track your meals. See how each meal impacts your daily nutrition goals.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: 300,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{
                                    fontFamily: "'Pacifico', cursive", // Unieke, speelse stijl
                                    color: '#e91e63',
                                }}
                            >
                                Vitamins & Minerals Insights
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontStyle: 'italic', // Schuine tekst
                                }}
                            >
                                Track your intake of essential vitamins and minerals (coming soon!).
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
