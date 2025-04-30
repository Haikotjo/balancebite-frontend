import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import BulletDot from "../layout/BulletDot.jsx";

/**
 * FeatureList – eenvoudige bulletlist van kernfeatures
 */
const FeatureList = () => {
    const features = [
        { primary: "Create and save meals", secondary: "Plan your meals based on your goals." },
        { primary: "Add meals from others", secondary: "Discover and use shared meals." },
        { primary: "Monitor your daily intake", secondary: "Track fats, proteins, and carbohydrates easily." },
        { primary: "Get your Recommended Daily Intake (RDI)", secondary: "Personalized intake based on weight, age, and goals." },
        { primary: "Eat meals with a single click", secondary: "See your intake update automatically." },
    ];

    return (
        <ul className="w-full max-w-[800px] text-left space-y-3">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                    {/* Bullet */}
                    <BulletDot className="mt-2" />

                    {/* Text content */}
                    <CustomBox>
                        <CustomTypography as="p" variant="bold" className="text-base">
                            {feature.primary}
                        </CustomTypography>
                        <CustomTypography as="p" variant="small" className="text-muted mt-0.5 italic">
                            {feature.secondary}
                        </CustomTypography>
                    </CustomBox>
                </li>
            ))}
        </ul>
    );
};

export default FeatureList;
