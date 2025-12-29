// src/components/layout/CustomDivider.jsx
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import clsx from "clsx";

const CustomDivider = ({ className = "my-4" }) => {
    return (
        <CustomBox
            className={clsx(
                "w-full h-px",
                !className.includes("bg-") && "bg-borderDark dark:bg-borderLight",
                className
            )}
        />
    );
};
CustomDivider.propTypes = {
    className: PropTypes.string,
};

export default CustomDivider;
