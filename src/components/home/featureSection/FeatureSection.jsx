import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import AnimatedGrid from "../animatedGrid/AnimatedGrid.jsx";
import FeatureCardWrapper from "../featureCard/FeatureCardWrapper.jsx";
import IconLink from "../iconWrapper/iconLink/IconLink.jsx";

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
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                maxWidth: 1200,
                ...boxProps, // Spread additional styling if provided
            }}
        >
            {/* Section Title */}
            <AnimatedGrid
                animation="slideIn"
                direction="left"
                sx={{
                    marginBottom: 1,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        fontFamily: "'Pacifico', cursive",
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            bottom: '-6px',
                            transform: 'translateX(-50%)',
                            width: '100%',
                            height: '1px',
                            backgroundColor: 'text.primary',
                            borderRadius: 2,
                        },
                    }}
                >
                    {title}
                </Typography>
            </AnimatedGrid>

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
        </Box>
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
