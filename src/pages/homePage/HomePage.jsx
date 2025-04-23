import { Box, Typography, Grid, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FeatureCard from '../../components/home/featureCard/FeatureCard.jsx';
import { Divider } from '@mui/material';
import FoodBankRoundedIcon from '@mui/icons-material/FoodBankRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import IconLink from "../../components/home/iconWrapper/iconLink/IconLink.jsx";
import Logo from "../../components/logo/Logo.jsx";
import IconWrapper from "../../components/home/iconWrapper/IconWrapper.jsx";
import AnimatedBox from "../../components/home/animatedBox/AnimatedBox.jsx";
import PageWrapper from "../../components/pageWrapper/PageWrapper.jsx";
import FeatureSection from "../../featureSection/FeatureSection.jsx";
import FeatureList from "../../components/home/featureList/FeatureList.jsx";

/**
 * HomePage Component
 * Renders the main landing page with various sections including a logo, icon links, informative text, and feature cards.
 */
function HomePage() {
    const theme = useTheme(); // Access the theme to dynamically style components

    // Define the items to be displayed in the IconWrapper
    const iconItems = [
        {
            to: "/meals",
            IconComponent: FoodBankRoundedIcon,
            color: theme.palette.primary.main,
            hoverColor: theme.palette.primary.light,
            rotation: -10,
            IconLinkComponent: IconLink,
        },
        {
            to: "/profile",
            IconComponent: MonitorHeartRoundedIcon,
            color: theme.palette.secondary.main,
            hoverColor: theme.palette.secondary.light,
            rotation: 5,
            IconLinkComponent: IconLink,
        },
        {
            to: "/profile",
            IconComponent: BarChartRoundedIcon,
            color: theme.palette.error.main,
            hoverColor: theme.palette.error.light,
            rotation: 15,
            IconLinkComponent: IconLink,
        },
    ];

    // Define the features to be displayed in the FeatureSection
    const features = [
        {
            to: '/profile',
            tooltip: 'Go to your profile page',
            IconComponent: BarChartRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.error.main,
            hoverColor: theme.palette.error.light,
            rotation: 15,
            title: 'Personalized Recommendations',
            description: 'Get daily and weekly tailored suggestions based on your body type and health goals.',
            colorKey: 'error',
        },
        {
            to: '/meals/:userId?',
            tooltip: 'Go to meals page',
            IconComponent: FoodBankRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.primary.main,
            hoverColor: theme.palette.primary.light,
            rotation: -10,
            title: 'Meal Tracking Made Easy',
            description: 'Add, save, and track your meals. See how each meal impacts your daily nutrition goals.',
            colorKey: 'primary',
        },
        {
            to: '/profile',
            tooltip: 'Go to your profile page',
            IconComponent: MonitorHeartRoundedIcon,
            CardComponent: FeatureCard,
            color: theme.palette.secondary.main,
            hoverColor: theme.palette.secondary.light,
            rotation: 5,
            title: 'Vitamins & Minerals Insights',
            description: 'Track your intake of essential vitamins and minerals (coming soon!).',
            colorKey: 'secondary',
        },
    ];

    return (
        <PageWrapper>
            {/* Header Section */}
            <AnimatedBox
                className="animated-logo"
                animation="fadeIn"
                direction="down"
                padding={2}
                marginBottom={2}
            >
                <Logo
                    size={100}
                    color={theme.palette.text.primary}
                />
            </AnimatedBox>

            {/* Icon Links Section */}
            <IconWrapper
                items={iconItems}
                animation="slideIn"
                direction="up"
            />

            <Divider sx={{ width: "100%", my: 6, borderColor: theme.palette.primary.main  }} />

            {/* Informative Text Section */}
            <AnimatedBox
                className="app-info-section"
                animation="slideIn"
                direction="right"
                marginBottom={0}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    maxWidth: 800,
                    marginX: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: "bold",
                        marginBottom: 2,
                    }}
                >
                    Your Personal Nutrition Tracker
                </Typography>

                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        color: theme.palette.text.primary,
                        lineHeight: 1.6,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        maxWidth: 800,
                        marginBottom: 3,
                        fontSize: {
                            xs: "0.9rem",
                            sm: "1rem",
                            md: "1.1rem",
                            lg: "1.2rem",
                        }
                    }}
                >
                    Stay on top of your nutrition goals with our intuitive meal tracking app.
                    Whether you want to gain muscle, lose weight, or simply eat healthier,
                    our app makes it easy to <strong><em>track your meals, balance your macros, and stay in control</em></strong>.
                    Enter your meals, monitor your <strong><em>Recommended Daily Intake (RDI)</em></strong>,
                    and see how each meal affects your daily nutrition.
                </Typography>

                <FeatureList />
            </AnimatedBox>

            <Divider sx={{ width: "100%", my: 4, mb:6, borderColor: theme.palette.primary.main }} />

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
            <Box sx={{ marginTop: 4, marginBottom: 4 }}>
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
        </PageWrapper>
    );
}

export default HomePage;
