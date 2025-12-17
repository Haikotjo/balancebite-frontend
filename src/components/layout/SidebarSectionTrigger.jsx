// src/components/layout/SidebarSectionTrigger.jsx
import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import ChevronToggle from "../chevronToggle/ChevronToggle.jsx";

const SidebarSectionTrigger = ({
                                   label,
                                   Icon,
                                   open,
                                   onToggle,
                                   active = false,
                                   compact = false,
                                   showLabel = true,
                               }) => {
    if (compact) {
        // lg+ compact icoon + chevron
        return (
            <CustomBox
                onClick={onToggle}
                className={clsx(
                    "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all hover:bg-white/10",
                    active && "bg-white/25"
                )}
            >
                <Icon className="w-6 h-6 text-white" />
                <ChevronToggle
                    open={open}
                    mobileSize={14}
                    desktopSize={16}
                    className="ml-1"
                />
            </CustomBox>
        );
    }

    // sm + md “normale” trigger
    return (
        <CustomBox
            onClick={onToggle}
            className="w-full flex items-center cursor-pointer text-white justify-between md:justify-start md:gap-1"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {showLabel && (
                <CustomTypography
                    bold
                    font="sans"
                    className="hidden sm:inline md:hidden lg:inline text-xs sm:text-sm text-white mr-2"
                >
                    {label}
                </CustomTypography>
            )}
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <ChevronToggle open={open} />
        </CustomBox>
    );
};

SidebarSectionTrigger.propTypes = {
    label: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    active: PropTypes.bool,
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default SidebarSectionTrigger;
