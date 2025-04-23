// src/components/layout/AnimatedBox.jsx
import PropTypes from "prop-types";
import CustomBox from "../../layout/CustomBox.jsx";


/**
 * AnimatedBox component — provides basic entrance animations via transform/opacity.
 * Useful for simple directional animations with Tailwind-compatible output.
 *
 * Props:
 * - children: React content
 * - animation: string (default: 'slideIn')
 * - direction: 'left' | 'right' | 'up' | 'down'
 * - className: additional Tailwind classes
 * - duration: animation duration in ms (default: 600)
 */
const AnimatedBox = ({
                         children,
                         className = "",
                         animation = "slideIn",
                         direction = "right",
                         duration = 600,
                     }) => {
    const getInitialTransform = () => {
        switch (direction) {
            case "left":
                return "translateX(-100%)";
            case "right":
                return "translateX(100%)";
            case "up":
                return "translateY(-100%)";
            case "down":
                return "translateY(100%)";
            default:
                return "translateX(0)";
        }
    };

    const animationStyle = {
        opacity: 0,
        transform: getInitialTransform(),
        animation: `fadeSlide-${direction} ${duration}ms ease-in-out forwards`,
    };

    return (
        <CustomBox className={className} style={animationStyle}>
            {children}
        </CustomBox>
    );
};

AnimatedBox.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    animation: PropTypes.string,
    direction: PropTypes.oneOf(["left", "right", "up", "down"]),
    duration: PropTypes.number,
};

export default AnimatedBox;
