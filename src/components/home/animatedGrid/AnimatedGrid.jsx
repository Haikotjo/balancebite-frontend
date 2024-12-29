import PropTypes from 'prop-types';
import { Grid } from '@mui/material';

/**
 * AnimatedGrid Component
 * A wrapper around the MUI Grid component with built-in animation functionality.
 * It allows elements within the grid to appear with animations originating from a specific direction.
 *
 * Props:
 * - `children`: Content to be rendered inside the Grid.
 * - `animation`: Name of the animation (default is 'slideIn').
 * - `direction`: Direction the animation comes from ('left', 'right', 'up', 'down').
 * - `duration`: Duration of the animation (e.g., '1.5s').
 * - `gridProps`: Additional props for the Grid component (e.g., spacing, container, item, etc.).
 */
const AnimatedGrid = ({ children, animation = 'slideIn', direction = 'right', duration = '1.5s', ...gridProps }) => {
    // Determine the transform value based on the direction of the animation
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
                return 'translateX(0)'; // No movement
        }
    };

    // Generate a dynamic keyframes name based on the animation and direction
    const keyframesName = `${animation}-${direction}`;

    return (
        <Grid
            {...gridProps} // Pass additional Grid props
            sx={{
                animation: `${keyframesName} ${duration} ease-in-out`, // Apply the animation
                [`@keyframes ${keyframesName}`]: {
                    '0%': { transform: getTransform(), opacity: 0 }, // Initial state
                    '100%': { transform: 'translateX(0)', opacity: 1 }, // Final state
                },
                ...gridProps.sx, // Merge with additional styles provided in gridProps
            }}
        >
            {children}
        </Grid>
    );
};

AnimatedGrid.propTypes = {
    children: PropTypes.node.isRequired, // Content to render inside the Grid
    animation: PropTypes.string, // Name of the animation (default: "slideIn")
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']), // Direction of the animation
    duration: PropTypes.string, // Duration of the animation (e.g., '1.5s')
    gridProps: PropTypes.object, // Additional props for the Grid component
};

export default AnimatedGrid;
