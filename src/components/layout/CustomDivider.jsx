// src/components/layout/CustomDivider.jsx
import PropTypes from "prop-types";

const CustomDivider = () => {
    return <div className="w-full h-px bg-borderLight dark:bg-borderDark my-4"/>
};

CustomDivider.propTypes = {
    className: PropTypes.string,
};

export default CustomDivider;
