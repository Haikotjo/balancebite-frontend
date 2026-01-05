// MealCardJumpLink.jsx
// Purpose: Small link-style button that scrolls to a ref target.

import PropTypes from "prop-types";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardJumpLink = ({ label, onClick, disabled = false }) => {
    if (!onClick) return null;

    return (
        <CustomButton
            variant="link"
            onClick={onClick}
            disabled={disabled}
            className="opacity-80 hover:opacity-100"
        >
            <CustomTypography variant="xsmallCard" className="italic">
                {label}
            </CustomTypography>
        </CustomButton>
    );
};

MealCardJumpLink.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

export default MealCardJumpLink;
