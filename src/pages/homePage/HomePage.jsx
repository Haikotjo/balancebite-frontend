import { useNavigate } from "react-router-dom";

import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../components/layout/CustomDivider.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import CustomIconButton from "../../components/layout/CustomIconButton.jsx";

import FeatureCard from "../../components/home/FeatureCard.jsx";
import Logo from "../../components/logo/Logo.jsx";
import FeatureSection from "../../components/home/FeatureSection.jsx";
import FeatureList from "../../components/home/FeatureList.jsx";

/**
 * HomePage
 */
function HomePage() {
    const navigate = useNavigate();

    const iconItems = [
        {
            to: "/meals",
            icon: "🍽",
            color: "text-primary",
            rotation: -10,
        },
        {
            to: "/profile",
            icon: "❤️",
            color: "text-secondary",
            rotation: 5,
        },
        {
            to: "/profile",
            icon: "📊",
            color: "text-error",
            rotation: 15,
        },
    ];

    const features = [
        {
            to: "/profile",
            tooltip: "Go to your profile page",
            IconComponent: () => <span className="text-error">📊</span>,
            CardComponent: FeatureCard,
            color: "text-error",
            hoverColor: "hover:text-error-light",
            rotation: 15,
            title: "Personalized Recommendations",
            description: "Get daily and weekly tailored suggestions based on your body type and health goals.",
            colorKey: "error",
        },
        {
            to: "/meals/:userId?",
            tooltip: "Go to meals page",
            IconComponent: () => <span className="text-primary">🍽</span>,
            CardComponent: FeatureCard,
            color: "text-primary",
            hoverColor: "hover:text-primary-light",
            rotation: -10,
            title: "Meal Tracking Made Easy",
            description: "Add, save, and track your meals. See how each meal impacts your daily nutrition goals.",
            colorKey: "primary",
        },
        {
            to: "/profile",
            tooltip: "Go to your profile page",
            IconComponent: () => <span className="text-secondary">❤️</span>,
            CardComponent: FeatureCard,
            color: "text-secondary",
            hoverColor: "hover:text-secondary-light",
            rotation: 5,
            title: "Vitamins & Minerals Insights",
            description: "Track your intake of essential vitamins and minerals (coming soon!).",
            colorKey: "secondary",
        },
    ];

    return (
        <CustomBox
            className="
                flex
                flex-col
                items-center
                justify-center
                min-h-screen
                w-full
                max-w-full
                mx-auto
                px-2
                text-center
            "
        >
            {/* Header logo */}
            <CustomAnimatedBox animation="fadeIn" className="animated-logo p-2 mb-2 mt-6">
                <Logo size={100} />
            </CustomAnimatedBox>

            {/* Icon buttons */}
            <CustomAnimatedBox animation="slideInUp" className="flex gap-4 my-4">
                {iconItems.map((item, index) => (
                    <CustomIconButton
                        key={index}
                        icon={
                            <span
                                className={`${item.color} text-[2.5rem]`}
                                style={{ transform: `rotate(${item.rotation}deg)` }}
                            >
                                {item.icon}
                            </span>
                        }
                        onClick={() => navigate(item.to)}
                        size={56}
                        className="transition-transform duration-300"
                    />
                ))}
            </CustomAnimatedBox>

            <CustomDivider className="my-6 border-primary" />

            {/* Info text */}
            <CustomAnimatedBox animation="slideInRight" className="app-info-section">
                <CustomBox className="flex flex-col items-center text-center max-w-[800px] mx-auto">
                    <CustomTypography variant="h2" as="h1" className="mb-2">
                        Your Personal Nutrition Tracker
                    </CustomTypography>

                    <CustomTypography
                        variant="paragraph"
                        className="leading-relaxed mb-3 text-base sm:text-lg md:text-xl"
                    >
                        Stay on top of your nutrition goals with our intuitive meal tracking app.
                        Whether you want to gain muscle, lose weight, or simply eat healthier,
                        our app makes it easy to <strong><em>track your meals, balance your macros, and stay in control</em></strong>.
                        Enter your meals, monitor your <strong><em>Recommended Daily Intake (RDI)</em></strong>,
                        and see how each meal affects your daily nutrition.
                    </CustomTypography>

                    <FeatureList />
                </CustomBox>
            </CustomAnimatedBox>

            <CustomDivider className="my-6 border-primary" />

            {/* Features */}
            <FeatureSection
                title="Why Choose BalanceBite?"
                features={features}
                animation="slideIn"
                direction="down"
                gridProps={{
                    className: "w-full max-w-[673px] px-0 py-0 mx-auto",
                }}
            />

            {/* Footer links */}
            <CustomBox className="mt-4 mb-4">
                <CustomBox className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                    <a href="/about" className="underline hover:text-primary">
                        About BalanceBite
                    </a>
                    <a href="/contact" className="underline hover:text-primary">
                        Contact Us
                    </a>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
}

export default HomePage;
