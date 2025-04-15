// src/components/layout/CustomDivider.jsx
import PropTypes from "prop-types";

const CustomDivider = ({ className = "my-4" }) => {
    return <div className={`w-full h-px bg-borderLight dark:bg-borderDark ${className}`} />;
};

CustomDivider.propTypes = {
    className: PropTypes.string,
};

export default CustomDivider;
