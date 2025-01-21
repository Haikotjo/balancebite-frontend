import { Box, Typography, Grid, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";
import AnimatedBox from "../../components/home/animatedBox/AnimatedBox.jsx";
import Logo from "../../components/logo/Logo.jsx";
import FeatureSection from "../../components/home/featureSection/FeatureSection.jsx";
import FoodBankRoundedIcon from '@mui/icons-material/FoodBankRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PropTypes from "prop-types";
import FeatureCard from "../../components/home/featureCard/FeatureCard.jsx";

/**
 * AboutPage Component
 * Provides an overview of the app's purpose, inspiration, and features.
 */
function AboutPage() {
    const theme = useTheme();

    // Define the core values of the app
    const features = [
        {
            to: '/meals/:userId?',
            tooltip: 'Go to meals page',
            IconComponent: FoodBankRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.primary.main,
            hoverColor: theme.palette.primary.light,
            title: "Healthy & Balanced Eating",
            description: "BalanceBite helps you maintain a healthy eating pattern by tracking your meals and ensuring you get the right nutrients.",
            colorKey: 'primary',
        },
        {
            to: '/profile',
            tooltip: 'Go to your profile page',
            IconComponent: MonitorHeartRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.secondary.main,
            hoverColor: theme.palette.secondary.light,
            title: "Personalized Nutrition",
            description: "Set your weight, activity level, and goals to receive tailored recommendations that match your lifestyle.",
            colorKey: 'error',
        },
        {
            to: '/profile',
            tooltip: 'Go to your profile page',
            IconComponent: BarChartRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.error.main,
            hoverColor: theme.palette.error.light,
            title: "Smart Meal Tracking",
            description: "Easily add and monitor meals, track your daily intake, and get insights into how different foods affect your diet.",
            colorKey: 'secondary',
        },
    ];

    return (
        <PageWrapper>
            {/* Header Section */}
            <AnimatedBox animation="fadeIn" direction="down" padding={2} marginBottom={2}>
                <Logo size={90} color={theme.palette.text.primary} />
            </AnimatedBox>

            {/* Introduction */}
            <AnimatedBox animation="slideIn" direction="right">
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 2,
                    }}
                >
                    About BalanceBite
                </Typography>

                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        lineHeight: 1.6,
                        maxWidth: 700,
                        margin: "auto",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                    }}
                >
                    BalanceBite is designed for anyone who wants to take control of their eating habits—whether you're trying to lose weight,
                    maintain a healthy lifestyle, or just enjoy creating meals. Our app provides insights into your daily intake and helps
                    you understand what your body needs based on your weight, activity level, and goals.
                </Typography>
            </AnimatedBox>

            {/* Why I Created This App */}
            <AnimatedBox animation="slideIn" direction="left" marginTop={4}>
                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        fontStyle: 'italic',
                        maxWidth: 700,
                        margin: "auto",
                    }}
                >
                    "I built BalanceBite out of personal interest. I wanted to eat healthier and lose weight, but I quickly realized that simply cutting calories
                    wasn’t enough. I needed a tool that could help me balance my meals and get the right nutrients, and so BalanceBite was born."
                </Typography>
            </AnimatedBox>

            {/* Features Section */}
            <FeatureSection
                title="Why Choose BalanceBite?"
                features={features}
                animation="slideIn"
                direction="down"
                gridProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 673,
                        paddingX: 0,
                        paddingY: 0,
                        margin: '0 auto',
                    },
                }}
            />

            {/* Footer Links Section */}
            <Box sx={{ marginTop: 4 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Link href="/contact" underline="hover">
                            Contact Us
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/meals" underline="hover">
                            Explore Meals
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </PageWrapper>
    );
}

// ✅ PropTypes toegevoegd om fouten te voorkomen
AboutPage.propTypes = {
    features: PropTypes.arrayOf(
        PropTypes.shape({
            IconComponent: PropTypes.elementType.isRequired,
            color: PropTypes.string.isRequired,
            hoverColor: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        })
    ),
};

export default AboutPage;
