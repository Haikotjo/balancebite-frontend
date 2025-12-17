// src/components/layout/SidebarActionButton.jsx
import PropTypes from "prop-types";
import clsx from "clsx";
import CustomButton from "./CustomButton.jsx";
import CustomTypography from "./CustomTypography.jsx";

const SidebarActionButton = ({ icon: Icon, label, onClick, disabled = false }) => {
    return (
        <CustomButton
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <CustomTypography as="span" inheritColor>
                {label}
            </CustomTypography>
        </CustomButton>
    );
};

SidebarActionButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

export default SidebarActionButton;
