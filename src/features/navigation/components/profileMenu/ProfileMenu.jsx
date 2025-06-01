import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import {UserCog, LogIn, LogOut, UserPlus, UserCircle, ChevronDown, ChevronUp} from "lucide-react";
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
                     }) => {
    const [open, setOpen] = useState(false);

    return (
        <CustomDropdownWeb
            open={open}
            onOpenChange={setOpen}
            className="absolute bottom-full left-0 min-w-[10rem] max-w-[40vw] md:left-full md:top-0 md:bottom-auto"

            /* ── trigger element ─────────────────────────────────────────── */
            trigger={
                <CustomBox
                    onClick={() => setOpen(!open)}
                    className="w-full flex justify-between items-center cursor-pointer text-white"
                >
                    <CustomTypography className="text-xs sm:text-sm text-white mr-2 md:inline">
                        Profile
                    </CustomTypography>
                    {/* Always-visible user icon */}
                    <UserCog  className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    {/* Chevron indicator */}
                    {open ? (
                        <>
                            <ChevronDown className="text-white w-5 h-5 mr-2 md:hidden" />
                            <ChevronUp className="text-white w-5 h-5 mr-2 hidden lg:block" />
                        </>
                    ) : (
                        <>
                            <ChevronUp className="text-white w-5 h-5 mr-2 md:hidden" />
                            <ChevronDown className="text-white w-5 h-5 mr-2 hidden lg:block" />
                        </>
                    )}

                </CustomBox>
            }
            /* ── dropdown items ──────────────────────────────────────────── */
            items={[
                user && {
                    label: "Profile",
                    icon: UserCircle,
                    onClick: () => {
                        setOpen(false);
                        // route to profile page; adapt if needed
                        window.location.href = "/profile";
                    },
                },
                !user && {
                    label: "Login",
                    icon: LogIn,
                    onClick: () => {
                        setOpen(false);
                        onLoginClick();
                    },
                },
                !user && {
                    label: "Register",
                    icon: UserPlus,
                    onClick: () => {
                        setOpen(false);
                        onRegisterClick();
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
            ].filter(Boolean)} // remove null entries
        />
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    iconColor: PropTypes.string,
    text: PropTypes.string,
};

export default ProfileMenu;
