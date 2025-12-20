import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * VisibilityToggle - Icon toggle for public/private.
 * Eye = public, EyeOff = private.
 */
const VisibilityToggle = ({ isPublic, onClick, disabled }) => {
    const Icon = isPublic ? Eye : EyeOff;
    const label = isPublic ? "Set to Private" : "Set to Public";
    const iconClass = isPublic ? "text-success/80" : "text-error";

    return (
        <CustomBox className="flex items-center">
            <CustomIconButton
                onClick={onClick}
                disabled={disabled}
                bgColor="bg-transparent"
                icon={<Icon size={20} className={iconClass} />}
                size={35}
                className="hover:bg-black/5 dark:hover:bg-white/5"
            />
            <CustomTypography variant="xsmallCard">
                {label}
            </CustomTypography>
        </CustomBox>
    );
};

VisibilityToggle.propTypes = {
    isPublic: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default VisibilityToggle;
