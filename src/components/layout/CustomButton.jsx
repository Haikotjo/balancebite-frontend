// src/components/layout/CustomButton.jsx
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * General-purpose button with Tailwind styling.
 *
 * @param {React.ReactNode} children - Content of the button (text, icon, etc).
 * @param {Function} onClick - Function to call on click.
 * @param {string} className - Extra Tailwind classes.
 * @returns {JSX.Element}
 */
const CustomButton = ({ children, onClick, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "text-sm px-2 py-1 rounded-md transition-all",
                "hover:bg-accent hover:text-white",
                className
            )}
        >
            {children}
        </button>
    );
};

CustomButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default CustomButton;
