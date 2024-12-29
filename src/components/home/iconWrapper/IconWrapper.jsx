import PropTypes from 'prop-types';
import AnimatedBox from "../animatedBox/AnimatedBox.jsx";

/**
 * IconWrapper component: Wraps a list of icons with an animation effect.
 * It uses the AnimatedBox component to apply animations to the icon group.
 */
const IconWrapper = ({ items, animation = 'slideIn', direction = 'down' }) => {
    return (
        <AnimatedBox animation={animation} direction={direction} padding={0} marginBottom={0}>
            {/* Render each icon item provided in the items array */}
            {items.map((item, index) => (
                <item.IconLinkComponent
                    key={index} // Unique key for each rendered icon
                    to={item.to} // Destination link for the icon
                    IconComponent={item.IconComponent} // Icon component to render
                    color={item.color} // Base color of the icon
                    hoverColor={item.hoverColor} // Color on hover
                    rotation={item.rotation} // Rotation angle of the icon
                />
            ))}
        </AnimatedBox>
    );
};

IconWrapper.propTypes = {
    /**
     * Array of icon items to display. Each item must follow a specific shape.
     * - `to`: The destination link for the icon.
     * - `IconComponent`: The component used to render the icon.
     * - `color`: Base color of the icon.
     * - `hoverColor`: Color of the icon on hover.
     * - `rotation`: Rotation angle of the icon in degrees.
     * - `IconLinkComponent`: Component used to wrap the icon with link functionality.
     */
    items: PropTypes.arrayOf(
        PropTypes.shape({
            to: PropTypes.string.isRequired, // The URL or path the icon links to
            IconComponent: PropTypes.elementType.isRequired, // Icon component type
            color: PropTypes.string.isRequired, // Default color of the icon
            hoverColor: PropTypes.string.isRequired, // Hover color of the icon
            rotation: PropTypes.number, // Rotation angle in degrees
            IconLinkComponent: PropTypes.elementType.isRequired, // Component wrapping the icon
        })
    ).isRequired,

    /**
     * The type of animation to apply (default: "slideIn").
     */
    animation: PropTypes.string,

    /**
     * The direction from which the animation originates.
     * Accepted values: 'left', 'right', 'up', 'down'.
     */
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
};

export default IconWrapper;
