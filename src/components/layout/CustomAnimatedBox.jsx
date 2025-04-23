import { motion } from "framer-motion";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * CustomAnimatedBox component
 * A reusable animated container supporting multiple entrance animations using Framer Motion.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to animate.
 * @param {string} props.animation - The animation type (e.g. 'fadeIn', 'slideInLeft').
 * @param {string} [props.className] - Additional Tailwind or custom classes.
 */
const CustomAnimatedBox = ({ children, animation = "fadeIn", className = "" }) => {
    const animations = {
        fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
        slideInDown: { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
        slideInUp: { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
        slideInLeft: { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
        slideInRight: { initial: { x: 20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
        scaleIn: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
        zoomIn: { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
    };

    const config = animations[animation] || animations.fadeIn;

    return (
        <motion.div
            initial={config.initial}
            animate={config.animate}
            transition={{ duration: 0.6 }}
            className={clsx(className)}
        >
            {children}
        </motion.div>
    );
};

CustomAnimatedBox.propTypes = {
    children: PropTypes.node.isRequired,
    animation: PropTypes.oneOf([
        "fadeIn",
        "slideInDown",
        "slideInUp",
        "slideInLeft",
        "slideInRight",
        "scaleIn",
        "zoomIn",
    ]),
    className: PropTypes.string,
};

export default CustomAnimatedBox;
