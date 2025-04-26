// src/components/layout/CustomDivider.jsx
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const CustomDivider = ({ className = "my-4" }) => {
    return <CustomBox className={`w-full h-px bg-borderLight dark:bg-borderDark ${className}`} />;
};

CustomDivider.propTypes = {
    className: PropTypes.string,
};

export default CustomDivider;
