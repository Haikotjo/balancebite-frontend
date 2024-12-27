import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Grid, Link, Tooltip  } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FeatureCard from '../../components/home/featureCard/FeatureCard.jsx';
import FoodBankRoundedIcon from '@mui/icons-material/FoodBankRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';


function HomePage() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                textAlign: 'center',
            }}
        >
            {/* Header Section */}
            <Box>

                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        animation: 'fadeIn 1s ease-in-out',
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0 },
                            '100%': { opacity: 1 },
                        },
                    }}
                >
                    Welcome to BalanceBite
                </Typography>
            </Box>


            {/* Icons Directly Below the Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    maxWidth: '300px',
                    marginBottom: 3,
                    flexWrap: 'wrap',
                }}
            >
                {/* FoodBank Icon */}
                <RouterLink to="/meals" style={{ textDecoration: 'none' }}>
                    <FoodBankRoundedIcon
                        sx={{
                            fontSize: 48,
                            color: theme.palette.primary.main,
                            transition: 'transform 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.2)',
                                color: theme.palette.primary.light,
                            },
                            cursor: 'pointer',
                            transform: 'rotate(-10deg)',
                        }}
                    />
                </RouterLink>

                {/* MonitorHeart Icon */}
                <RouterLink to="/profile" style={{ textDecoration: 'none' }}>
                    <MonitorHeartRoundedIcon
                        sx={{
                            fontSize: 48,
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                transform: 'scale(1.2)',
                                color: theme.palette.secondary.light,
                            },
                            cursor: 'pointer',
                            transform: 'rotate(5deg)',
                        }}
                    />
                </RouterLink>

                {/* BarChart Icon */}
                <RouterLink to="/profile" style={{ textDecoration: 'none' }}>
                    <BarChartRoundedIcon
                        sx={{
                            fontSize: 48,
                            color: theme.palette.error.main,
                            transition: 'transform 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.2)',
                                color: theme.palette.error.light,
                            },
                            cursor: 'pointer',
                            transform: 'rotate(15deg)',
                        }}
                    />
                </RouterLink>
            </Box>


            <Typography
                variant="h6"
                component="p"
                sx={{
                    maxWidth: 600,
                    marginBottom: 3,
                    color: theme.palette.text.primary,
                    textAlign: 'center',
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                    animation: 'fadeIn 1.5s ease-in-out',
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
                    width: '100%',
                    maxWidth: 1200,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontFamily: "'Pacifico', cursive",
                        marginBottom: 2,
                        position: 'relative', // Nodig voor het positioneren van de pseudo-elementen
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            bottom: '-6px',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            height: '2px',
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 2,
                        },
                    }}
                >
                    Why Choose BalanceBite?
                </Typography>


                <Grid
                    container
                    // spacing={3}
                    justifyContent="center"
                    sx={{

                        width: '100%',
                        maxWidth: 673,
                        paddingX: 0,
                        paddingY: 0,
                        margin: '0 auto',
                    }}
                >

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              margin: 'auto',
                              padding: '15px',
                          }}
                    >
                        <Tooltip title="Go to your profile page" arrow>
                        <RouterLink to="/profile" style={{ textDecoration: 'none' }}>
                        <FeatureCard
                            title="Personalized Recommendations"
                            description="Get daily and weekly tailored suggestions based on your body type and health goals."
                            colorKey="error"
                        />
                        </RouterLink>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              padding: '15px',
                          }}
                    >
                        <Tooltip title="Go to meals page" arrow>
                        <RouterLink to="/meals/:userId?" style={{ textDecoration: 'none' }}>
                        <FeatureCard
                            title="Meal Tracking Made Easy"
                            description="Add, save, and track your meals. See how each meal impacts your daily nutrition goals."
                            colorKey="primary"
                        />
                        </RouterLink>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}
                          sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              padding: '15px',
                          }}
                    >
                        <Tooltip title="Go to your profile page" arrow>
                        <RouterLink to="/profile" style={{ textDecoration: 'none' }}>
                        <FeatureCard
                            title="Vitamins & Minerals Insights"
                            description="Track your intake of essential vitamins and minerals (coming soon!)."
                            colorKey="secondary"
                        />
                        </RouterLink>
                        </Tooltip>
                    </Grid>

                </Grid>
            </Box>

            {/* Footer Links */}
            <Box sx={{ marginTop: 4 }}>
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
