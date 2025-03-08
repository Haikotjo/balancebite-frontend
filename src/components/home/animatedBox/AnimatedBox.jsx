import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * AnimatedBox component: Provides a flexible container with animation effects.
 * It supports directional animations, padding, and margin customization.
 */
const AnimatedBox = ({ children, className = '', animation = 'slideIn', direction = 'right', padding = 2, marginBottom = 5 }) => {
    /**
     * Determines the starting transformation based on the animation direction.
     * @returns {string} - CSS transform property value.
     */
    const getTransform = () => {
        switch (direction) {
            case 'left':
                return 'translateX(-100%)';
            case 'right':
                return 'translateX(100%)';
            case 'up':
                return 'translateY(-100%)';
            case 'down':
                return 'translateY(100%)';
            default:
                return 'translateX(0)'; // Default: no movement
        }
    };

    // Generate a dynamic keyframe name based on the animation and direction
    const keyframesName = `${animation}-${direction}`;

    return (
        <Box
            className={`animated-box ${className}`}
            sx={{
                maxWidth: 800, // Maximum width constraint
                marginBottom, // Apply bottom margin
                padding, // Apply padding
                animation: `${keyframesName} 1.5s ease-in-out`, // Animation settings
                [`@keyframes ${keyframesName}`]: {
                    '0%': { transform: getTransform(), opacity: 0 }, // Start state
                    '100%': { transform: 'translateX(0)', opacity: 1 }, // End state
                },
            }}
        >
            {children}
        </Box>
    );
};

AnimatedBox.propTypes = {
    /**
     * Content to be wrapped by the AnimatedBox.
     */
    children: PropTypes.node.isRequired,

    className: PropTypes.string,

    /**
     * Name of the animation effect (default: "slideIn").
     */
    animation: PropTypes.string,

    /**
     * Direction of the animation. Accepted values: 'left', 'right', 'up', 'down'.
     */
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),

    /**
     * Padding applied to the container. Accepts numeric or string values.
     */
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * Bottom margin applied to the container. Accepts numeric or string values.
     */
    marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AnimatedBox;
