import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Logo from "../../components/logo/Logo.jsx";
import FeatureSection from "../../featureSection/FeatureSection.jsx";
import FoodBankRoundedIcon from '@mui/icons-material/FoodBankRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PropTypes from "prop-types";
import FeatureCard from "../../components/home/featureCard/FeatureCard.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx"
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet, Soup } from "lucide-react";;

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
        <CustomBox className="flex flex-col items-center justify-center min-h-screen w-full text-center px-2">
            {/* Header Section */}
            <CustomAnimatedBox animation="slideInDown" className="p-2 my-2">
                <Logo size={90} className="text-primary" />
            </CustomAnimatedBox>

            {/* Introduction */}

                <CustomTypography
                    as="h1"
                    variant="h2"
                    bold
                    className="text-center mb-2"
                >
                    About BalanceBite
                </CustomTypography>

                <CustomTypography
                    as="p"
                    variant="h5"
                    className="text-center leading-relaxed max-w-[700px] mx-4 sm:px-6 sm:mx-auto italic"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
                >
                    BalanceBite is designed for anyone who wants to take control of their eating habits—whether you're trying to lose weight,
                    maintain a healthy lifestyle, or just enjoy creating meals. Our app provides insights into your daily intake and helps
                    you understand what your body needs based on your weight, activity level, and goals.
                </CustomTypography>


            {/* Why I Created This App */}
            <CustomAnimatedBox animation="slideInLeft" className="my-4">
                <CustomTypography
                    as="p"
                    variant="h5"
                    italic
                    className="text-center max-w-[700px] sm:px-6 mx-4 sm:mx-auto"
                >
                    "I built BalanceBite out of personal interest. I wanted to eat healthier and lose weight, but I quickly realized that simply cutting calories wasn’t enough. I needed a tool that could help me balance my meals and get the right nutrients, and so BalanceBite was born."
                </CustomTypography>
            </CustomAnimatedBox>

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
            <CustomBox className="mt-4 pb-16 sm:pb-8 md:pb-6">
                <CustomBox className="flex justify-center gap-4">
                    <Link to="/contact" className="text-primary hover:underline text-center">
                        Contact Us
                    </Link>
                    <Link to="/meals" className="text-primary hover:underline text-center">
                        Explore Meals
                    </Link>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
}

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
