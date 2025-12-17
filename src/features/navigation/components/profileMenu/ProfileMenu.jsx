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
import SidebarSectionTrigger from "../../../../components/layout/SidebarSectionTrigger.jsx";
import {buildSidebarItems} from "../../../../utils/helpers/buildSidebarItems.js";
import SidebarActionButton from "../../../../components/layout/SidebarActionButton.jsx";

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
        <SidebarSectionTrigger
            label="Profile"
            Icon={UserCog}
            open={open}
            onToggle={() => setOpen(!open)}
            compact={false}
            active={isProfileSectionActive}
            showLabel={showLabel}
        />
    );

// ---------- COMPACT TRIGGER (lg+) ----------
    const compactTrigger = (
        <SidebarSectionTrigger
            label="Profile"
            Icon={UserCog}
            open={open}
            onToggle={() => setOpen(!open)}
            compact
            active={isProfileSectionActive}
            showLabel={false}
        />
    );


    // bovenin je ProfileMenu-component
    const dropdownItems = buildSidebarItems({
        user,
        close: () => setOpen(false),
        items: [
            user && {
                label: "Profile",
                icon: UserCircle,
                onClick: handleProfile,
                requiresAuth: true,
            },
            user && {
                label: "Dashboard",
                icon: Gauge,
                onClick: handleDashboard,
                requiresAuth: true,
            },
            isAdmin && {
                label: "Admin",
                icon: ShieldUser,
                onClick: handleAdmin,
                requiresAuth: true,
            },
            !user && {
                label: "Login",
                icon: LogIn,
                onClick: () => onLoginClick(false),
            },
            !user && {
                label: "Register",
                icon: UserPlus,
                onClick: () => onRegisterClick(true),
            },
            user && {
                label: "Logout",
                icon: LogOut,
                onClick: () => onLogout(() => {}),
                requiresAuth: true,
            },
        ].filter(Boolean),
    });


    // ---------- COMPACT MODE ----------
    if (compact) {
        return (
            <>
                {/* sm + md dropdown */}
                <CustomBox className="block lg:hidden w-full">
                    <CustomDropdownWeb
                        open={open}
                        onOpenChange={setOpen}
                        className="
                                    absolute z-50
                                    bottom-full left-0 mb-2
                                    md:bottom-auto md:top-0
                                    md:left-full md:ml-5
                        "
                        trigger={compactTrigger}
                        items={dropdownItems}
                    />
                </CustomBox>

                <CustomBox className="hidden lg:block w-full text-white mb-2">
                    <CustomBox
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md",
                            isProfileSectionActive && "bg-white/25"
                        )}
                    >
                        <UserCog className="w-5 h-5" />
                        <CustomTypography
                            bold
                            font="sans"
                            className="text-sm"
                            color="white"
                        >
                            Profile
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1 ml-7 flex flex-col gap-1">
                        {dropdownItems.map(item => (
                            <SidebarActionButton
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                onClick={item.onClick}
                                disabled={item.disabled}
                            />
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
            className="absolute bottom-full mb-4 min-w-[10rem] max-w-[90vw]"
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
