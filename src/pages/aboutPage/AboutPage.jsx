import { Link } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import CustomDivider from "../../components/layout/CustomDivider.jsx";
import CustomIconButton from "../../components/layout/CustomIconButton.jsx";
import FeatureCard from "../../components/home/FeatureCard.jsx";
import FeatureSection from "../../components/home/FeatureSection.jsx";
import FeatureList from "../../components/home/FeatureList.jsx";
import Logo from "../../components/logo/Logo.jsx";

function AboutPage() {
    const features = [
        {
            to: "/meals",
            tooltip: "Go to meals page",
            icon: "🍽",
            rotation: -10,
            color: "text-primary",
            title: "Healthy & Balanced Eating",
            description:
                "BalanceBite helps you maintain a healthy eating pattern by tracking your meals and ensuring you get the right nutrients.",
            colorKey: "primary",
        },
        {
            to: "/profile",
            tooltip: "Go to your profile page",
            icon: "❤️",
            rotation: 5,
            color: "text-secondary",
            title: "Personalized Nutrition",
            description:
                "Set your weight, activity level, and goals to receive tailored recommendations that match your lifestyle.",
            colorKey: "secondary",
        },
        {
            to: "/profile",
            tooltip: "Go to your profile page",
            icon: "📊",
            rotation: 15,
            color: "text-error",
            title: "Smart Meal Tracking",
            description:
                "Easily add and monitor meals, track your daily intake, and get insights into how different foods affect your diet.",
            colorKey: "error",
        },
    ];

    return (
        <CustomBox className="flex flex-col items-center justify-center min-h-screen w-full text-center px-2">
            <CustomAnimatedBox animation="slideInDown" className="p-2 my-2">
                <Logo size={90} className="text-primary" />
            </CustomAnimatedBox>

            <CustomTypography as="h1" variant="h2" bold className="text-center mb-2">
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

            <CustomAnimatedBox animation="slideInLeft" className="my-4">
                <CustomTypography
                    as="p"
                    variant="h5"
                    italic
                    className="text-center max-w-[700px] sm:px-6 mx-4 sm:mx-auto"
                >
                    "I built BalanceBite out of personal interest. I wanted to eat healthier and lose weight, but I quickly realized that
                    simply cutting calories wasn’t enough. I needed a tool that could help me balance my meals and get the right
                    nutrients, and so BalanceBite was born."
                </CustomTypography>
            </CustomAnimatedBox>

            <CustomDivider className="my-6 border-primary" />

            <FeatureSection
                title="Why Choose BalanceBite?"
                features={features.map((f) => ({
                    to: f.to,
                    tooltip: f.tooltip,
                    IconComponent: () => (
                        <span
                            className={`${f.color} text-[2.5rem]`}
                            style={{ transform: `rotate(${f.rotation}deg)` }}
                        >
                            {f.icon}
                        </span>
                    ),
                    CardComponent: FeatureCard,
                    color: f.color,
                    hoverColor: "hover:opacity-80",
                    rotation: f.rotation,
                    title: f.title,
                    description: f.description,
                    colorKey: f.colorKey,
                }))}
            />

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

export default AboutPage;