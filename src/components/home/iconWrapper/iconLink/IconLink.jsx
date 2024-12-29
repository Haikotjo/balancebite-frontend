import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * IconLink Component
 * Renders an icon with hover effects, rotation, and navigation functionality.
 *
 * Props:
 * - `IconComponent`: The icon to render (e.g., Material-UI icons).
 * - `to`: The route to navigate to when the icon is clicked.
 * - `color`: The default color of the icon.
 * - `hoverColor`: The color when the icon is hovered.
 * - `rotation`: The rotation angle of the icon in degrees.
 */
function IconLink({ to, IconComponent, color, hoverColor, rotation }) {
    return (
        <RouterLink to={to} style={{ textDecoration: 'none' }}>
            <Box
                component={IconComponent} // Render the provided icon component
                sx={{
                    fontSize: 48, // Set the size of the icon
                    color: color, // Apply the default color
                    transition: 'transform 0.3s ease, color 0.3s ease', // Smooth transition for hover effects
                    transform: `rotate(${rotation}deg)`, // Apply rotation to the icon
                    '&:hover': {
                        transform: 'scale(1.2)', // Slightly enlarge the icon on hover
                        color: hoverColor, // Change color on hover
                    },
                    cursor: 'pointer', // Change cursor to pointer to indicate interactivity
                }}
            />
        </RouterLink>
    );
}

IconLink.propTypes = {
    to: PropTypes.string.isRequired, // The route to navigate to
    IconComponent: PropTypes.elementType.isRequired, // The icon component to render (e.g., Material-UI icons)
    color: PropTypes.string.isRequired, // Default color of the icon
    hoverColor: PropTypes.string.isRequired, // Color of the icon when hovered
    rotation: PropTypes.number, // Rotation angle of the icon (in degrees)
};

export default IconLink;
