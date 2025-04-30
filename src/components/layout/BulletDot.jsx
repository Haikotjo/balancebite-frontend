// src/components/layout/BulletDot.jsx
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

/**
 * Visual bullet
 */
const BulletDot = ({ className = "" }) => {
    return (
        <CustomBox
            as="span"
            className={`inline-block w-2 h-2 rounded-full bg-primary flex-shrink-0 ${className}`}
        />
    );
};

BulletDot.propTypes = {
    className: PropTypes.string,
};

export default BulletDot;
