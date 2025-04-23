import PropTypes from 'prop-types';
import AnimatedGrid from "../components/home/animatedGrid/AnimatedGrid.jsx";
import FeatureCardWrapper from "../components/home/featureCard/FeatureCardWrapper.jsx";
import IconLink from "../components/home/iconWrapper/iconLink/IconLink.jsx";
import CustomBox from "../components/layout/CustomBox.jsx";
import CustomAnimatedBox from "../components/layout/CustomAnimatedBox.jsx";
import CustomTypography from "../components/layout/CustomTypography.jsx";
import CustomDivider from "../components/layout/CustomDivider.jsx";

/**
 * FeatureSection Component
 * A reusable component that renders a section with a title and a list of features.
 * Each feature includes an icon, a card with title and description, and a tooltip.
 *
 * Props:
 * - `title`: The title of the section.
 * - `features`: An array of feature objects containing details about each feature.
 * - `animation`: The animation style applied to the section (default: 'slideIn').
 * - `direction`: The direction of the animation (default: 'down').
 * - `gridProps`: Additional props for the AnimatedGrid component.
 * - `boxProps`: Additional styling for the wrapping Box component.
 */
const FeatureSection = ({ title, features, animation = 'slideIn', direction = 'down', gridProps, boxProps }) => {
    return (
        <CustomBox
            className="flex flex-col justify-center items-center w-full max-w-[1200px]"
        >
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

            {/* Features List */}
            <AnimatedGrid
                container
                justifyContent="center"
                animation={animation}
                direction={direction}
                {...gridProps} // Spread additional grid props if provided
            >
                {features.map((feature, index) => (
                    <FeatureCardWrapper
                        key={index}
                        tooltip={feature.tooltip} // Tooltip text for the feature
                    >
                        {/* IconLink renders the feature's icon and handles navigation */}
                        <IconLink
                            to={feature.to}
                            IconComponent={feature.IconComponent}
                            color={feature.color}
                            hoverColor={feature.hoverColor}
                            rotation={feature.rotation}
                        />
                        {/* FeatureCard displays the title and description */}
                        <feature.CardComponent
                            title={feature.title}
                            description={feature.description}
                            colorKey={feature.colorKey}
                            to={feature.to} // Pass navigation prop to the FeatureCard
                        />
                    </FeatureCardWrapper>
                ))}
            </AnimatedGrid>
        </CustomBox>
    );
};

FeatureSection.propTypes = {
    /**
     * The title of the section.
     */
    title: PropTypes.string.isRequired,

    /**
     * An array of feature objects. Each feature should have the following structure:
     * - `to`: The navigation link for the feature.
     * - `tooltip`: The tooltip text displayed on hover.
     * - `IconComponent`: The icon component to display (e.g., Material-UI icons).
     * - `CardComponent`: The card component to display feature details.
     * - `color`: The default color of the icon.
     * - `hoverColor`: The color of the icon when hovered.
     * - `rotation`: The rotation angle of the icon (in degrees).
     * - `title`: The title displayed on the card.
     * - `description`: The description text displayed on the card.
     * - `colorKey`: The key to determine the color palette for the card.
     */
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

    /**
     * The animation style applied to the section (e.g., 'slideIn').
     */
    animation: PropTypes.string,

    /**
     * The direction of the animation (e.g., 'left', 'right', 'up', 'down').
     */
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),

    /**
     * Additional props for the AnimatedGrid component.
     */
    gridProps: PropTypes.object,

    /**
     * Additional styling for the wrapping Box component.
     */
    boxProps: PropTypes.object,
};

export default FeatureSection;
