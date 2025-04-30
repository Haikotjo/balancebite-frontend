import PropTypes from 'prop-types';
import FeatureCardWrapper from "./FeatureCardWrapper.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomAnimatedBox from "../layout/CustomAnimatedBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomDivider from "../layout/CustomDivider.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";

/**
 * FeatureSection Component
 * Renders a section title and a list of features with animation and custom layout.
 */
const FeatureSection = ({ title, features, animation = 'slideIn', direction = 'down', boxProps }) => {
    return (
        <CustomBox className="flex flex-col justify-center items-center w-full max-w-[1200px]" {...boxProps}>
            {/* Section Title */}
            <CustomAnimatedBox animation="slideInLeft" className="mb-2">
                <CustomTypography
                    as="h2"
                    variant="h2"
                    font="display"
                    className="text-primary relative text-center pb-1"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                >
                    {title}
                    <CustomDivider className="absolute left-1/2 bottom-0 translate-x-[-50%] w-full h-[1px]" />
                </CustomTypography>
            </CustomAnimatedBox>

            {/* Features List (with animation) */}
            <CustomAnimatedBox animation={animation} className="flex flex-wrap justify-center gap-6 mt-4">
                {features.map((feature, index) => (
                    <FeatureCardWrapper key={index} tooltip={feature.tooltip}>
                        <CustomIconButton
                            icon={
                                <feature.IconComponent
                                    className={`${feature.color} transition-colors duration-300`}
                                    style={{
                                        transform: `rotate(${feature.rotation}deg)`,
                                        fontSize: 48,
                                    }}
                                />
                            }
                            onClick={() => window.location.href = feature.to}
                        />
                        <feature.CardComponent
                            title={feature.title}
                            description={feature.description}
                            colorKey={feature.colorKey}
                            to={feature.to}
                        />
                    </FeatureCardWrapper>
                ))}
            </CustomAnimatedBox>
        </CustomBox>
    );
};

FeatureSection.propTypes = {
    title: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(
        PropTypes.shape({
            to: PropTypes.string.isRequired,
            tooltip: PropTypes.string,
            IconComponent: PropTypes.elementType.isRequired,
            CardComponent: PropTypes.elementType.isRequired,
            color: PropTypes.string.isRequired,
            hoverColor: PropTypes.string.isRequired,
            rotation: PropTypes.number,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            colorKey: PropTypes.string.isRequired,
        })
    ).isRequired,
    animation: PropTypes.string,
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
    boxProps: PropTypes.object,
};

export default FeatureSection;
