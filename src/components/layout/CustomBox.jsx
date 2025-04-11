// src/components/layout/CustomBox.jsx

import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * A flexible box container with default Tailwind styling.
 * Automatically applies `box-border`, but accepts any additional props and classNames.
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children - Elements to render inside the box.
 * @param {string} [props.className] - Additional Tailwind CSS classes.
 * @returns {JSX.Element}
 */
const CustomBox = ({ children, className = "", ...props }) => {
    return (
        <div className={clsx("box-border", className)} {...props}>
            {children}
        </div>
    );
};

CustomBox.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default CustomBox;
