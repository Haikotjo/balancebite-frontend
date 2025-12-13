import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import {UserCog, LogIn, LogOut, UserPlus, UserCircle, ChevronDown, ChevronUp, Gauge } from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * ProfileMenu shows a dropdown with “Profile”, “Login / Register” or “Logout”
 * options, depending on authentication state.
 *
 * @component
 * @param {object} props
 * @param {?object} props.user          Current user object (null if not logged in)
 * @param {function} props.onLogout     Callback when user chooses “Logout”
 * @param {function} props.onLoginClick Callback to show login page/modal
 * @param {function} props.onRegisterClick Callback to show register page/modal
 * @returns {JSX.Element}
 */
const ProfileMenu = ({
                         user,
                         onLogout,
                         onLoginClick,
                         onRegisterClick,
                         compact = false,
                         showLabel = true
                     }) => {
    const [open, setOpen] = useState(false);

    const trigger = compact ? (
        // Icon-only trigger for DesktopMenu: user + chevron
        <CustomBox
            onClick={() => setOpen(!open)}
            className="relative p-2 pr-8 rounded-md hover:bg-white/10 cursor-pointer text-white"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            <UserCog className="w-8 h-8 mx-auto" />
            {open ? (
                <>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:hidden pointer-events-none" />
                    <ChevronUp   className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 hidden md:block pointer-events-none" />
                </>
            ) : (
                <>
                    <ChevronUp   className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:hidden pointer-events-none" />
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 hidden md:block pointer-events-none" />
                </>
            )}
        </CustomBox>
    ) : (
        // Default trigger with text (mobile/overal)
        <CustomBox
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center cursor-pointer text-white"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {showLabel && (
                <CustomTypography bold font="sans" className="text-xs sm:text-sm text-white mr-2 md:inline">
                    Profile
                </CustomTypography>
            )}
            <UserCog className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            {open ? (
                <>
                    <ChevronDown className="text-white w-5 h-5 mr-2 md:hidden" />
                    <ChevronUp className="text-white w-5 h-5 mr-2 hidden md:block" />
                </>
            ) : (
                <>
                    <ChevronUp className="text-white w-5 h-5 mr-2 md:hidden" />
                    <ChevronDown className="text-white w-5 h-5 mr-2 hidden md:block" />
                </>
            )}
        </CustomBox>
    );

    return (
        <CustomDropdownWeb
            open={open}
            onOpenChange={setOpen}
            className="absolute bottom-full left-0 min-w-[10rem] max-w-[40vw] md:left-full md:top-0 md:bottom-auto"
            trigger={trigger}
            items={[
                user && {
                    label: "Profile",
                    icon: UserCircle,
                    onClick: () => {
                        setOpen(false);
                        window.location.href = "/profile"; // keep current behavior
                    },
                },
                user && {
                    label: "Dashboard",
                    icon: Gauge,
                    onClick: () => {
                        setOpen(false);
                        window.location.href = "/dashboard";
                    },
                },
                !user && {
                    label: "Login",
                    icon: LogIn,
                    onClick: () => {
                        setOpen(false);
                        onLoginClick(false);
                    },
                },
                !user && {
                    label: "Register",
                    icon: UserPlus,
                    onClick: () => {
                        setOpen(false);
                        onRegisterClick(true);
                    },
                },
                user && {
                    label: "Logout",
                    icon: LogOut,
                    onClick: () => {
                        setOpen(false);
                        onLogout(() => {});
                    },
                },
            ].filter(Boolean)}
        />
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    compact: PropTypes.bool,
};

export default ProfileMenu;
