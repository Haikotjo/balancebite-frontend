// src/components/layout/BulletText.jsx
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";

/**
 * Displays a bullet point followed by custom text.
 * Tailwind styling is handled directly here (no variant).
 */
const BulletText = ({ children, as = "div", showBullet = true }) => {
    return (
        <CustomBox as={as} className="flex items-center gap-2">
            {showBullet && (
                <CustomTypography as="span" className="text-primary text-[1rem]">•</CustomTypography>
            )}
            <CustomTypography as="span" className="text-[0.8rem] md:text-base italic">
                {children}
            </CustomTypography>
        </CustomBox>
    );
};

BulletText.propTypes = {
    children: PropTypes.node.isRequired,
    as: PropTypes.elementType,
    showBullet: PropTypes.bool,
};

export default BulletText;
