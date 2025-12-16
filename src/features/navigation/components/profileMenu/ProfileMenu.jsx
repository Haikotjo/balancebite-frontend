import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import {
    UserCog,
    LogIn,
    LogOut,
    UserPlus,
    UserCircle,
    ShieldUser,
    Gauge,
} from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import ChevronToggle from "../../../../components/chevronToggle/ChevronToggle.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";

const ProfileMenu = ({
                         user,
                         onLogout,
                         onLoginClick,
                         onRegisterClick,
                         compact = false,
                         showLabel = true,
                     }) => {
    const [open, setOpen] = useState(false);
    const isAdmin = !!user && user.roles?.includes("ADMIN");
    const location = useLocation();
    const navigate = useNavigate();

    const section = getActiveSection(location.pathname);
    const isProfileSectionActive =
        section === "profile" || section === "dashboard";

    const handleProfile = () => navigate("/profile");
    const handleDashboard = () => navigate("/dashboard");
    const handleAdmin = () => navigate("/admin");

    // ---------- NORMAL TRIGGER (sm + md) ----------
    const trigger = (
        <CustomBox
            onClick={() => setOpen(!open)}
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
                    Profile
                </CustomTypography>
            )}
            <UserCog className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <ChevronToggle open={open} />
        </CustomBox>
    );

    // ---------- COMPACT TRIGGER (lg+) ----------
    const compactTrigger = (
        <CustomBox
            onClick={() => setOpen(!open)}
            className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all hover:bg-white/10",
                isProfileSectionActive && "bg-white/25"
            )}
        >
            <UserCog className="w-6 h-6 text-white" />
            <ChevronToggle
                open={open}
                mobileSize={14}
                desktopSize={16}
                className="ml-1"
            />
        </CustomBox>
    );

    const dropdownItems = [
        user && {
            label: "Profile",
            icon: UserCircle,
            onClick: () => {
                setOpen(false);
                handleProfile();
            }
        },
        user && {
            label: "Dashboard",
            icon: Gauge,
            onClick: () => {
                setOpen(false);
                handleDashboard();
            }
        },
        isAdmin && {
            label: "Admin",
            icon: ShieldUser,
            onClick: () => {
                setOpen(false);
                handleAdmin();
            }
        },
        !user && {
            label: "Login",
            icon: LogIn,
            onClick: () => {
                setOpen(false);
                onLoginClick(false);
            }
        },
        !user && {
            label: "Register",
            icon: UserPlus,
            onClick: () => {
                setOpen(false);
                onRegisterClick(true);
            }
        },
        user && {
            label: "Logout",
            icon: LogOut,
            onClick: () => {
                setOpen(false);
                onLogout(() => {});
            }
        }
    ].filter(Boolean);

    // ---------- COMPACT MODE ----------
    if (compact) {
        return (
            <>
                {/* sm + md dropdown */}
                <CustomBox className="block lg:hidden w-full">
                    <CustomDropdownWeb
                        open={open}
                        onOpenChange={setOpen}
                        trigger={compactTrigger}
                        className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                        items={dropdownItems}
                    />
                </CustomBox>

                {/* lg sidebar lijst */}
                <CustomBox className="hidden lg:block w-full text-white">
                    <CustomBox
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md",
                            isProfileSectionActive && "bg-white/25"
                        )}
                    >
                        <UserCog className="w-5 h-5" />
                        <CustomTypography bold font="sans" className="text-sm">
                            Profile
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1 ml-7 flex flex-col gap-1">
                        {dropdownItems.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={item.onClick}
                                className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </CustomBox>
                </CustomBox>
            </>
        );
    }

    // ---------- NORMAL MODE ----------
    return (
        <CustomDropdownWeb
            open={open}
            onOpenChange={setOpen}
            trigger={trigger}
            className="absolute bottom-full left-0 min-w-[10rem] max-w-[40vw] md:left-full md:top-0"
            items={dropdownItems}
        />
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default ProfileMenu;
