import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    UserCog, UserCircle, Gauge, ShieldUser,
    LogIn, LogOut, UserPlus, ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";

const ProfileMenu = ({ user, onLogout, onLoginClick, onRegisterClick, showLabel = true }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = ["profile", "dashboard"].includes(getActiveSection(location.pathname));
    const isAdmin = user?.roles?.includes("ADMIN");

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => { setOpen(false); }, [location.pathname]);

    const items = [
        user  && { label: "Profile",   icon: UserCircle, onClick: () => navigate("/profile") },
        user  && { label: "Dashboard", icon: Gauge,       onClick: () => navigate("/dashboard") },
        isAdmin && { label: "Admin",   icon: ShieldUser,  onClick: () => navigate("/admin") },
        !user && { label: "Login",     icon: LogIn,       onClick: onLoginClick },
        !user && { label: "Register",  icon: UserPlus,    onClick: onRegisterClick },
        user  && { label: "Logout",    icon: LogOut,      onClick: onLogout },
    ].filter(Boolean);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                className={clsx(
                    "flex items-center gap-1 rounded-md p-2 text-white",
                    "transition-colors hover:bg-white/10",
                    isActive && "bg-white/25"
                )}
            >
                <UserCog className="w-6 h-6 shrink-0" />
                {showLabel && (
                    <span className="hidden lg:inline text-sm font-medium">Profile</span>
                )}
                <ChevronDown className={clsx("w-3 h-3 transition-transform duration-200", open && "rotate-180")} />
            </button>

            {open && (
                <div className={clsx(
                    "absolute z-50 min-w-[160px] py-1",
                    "rounded-xl bg-white dark:bg-gray-800 shadow-lg",
                    "border border-gray-200 dark:border-gray-600",
                    "bottom-full mb-2 right-0",
                    "md:bottom-auto md:top-0 md:right-auto md:left-full md:ml-2 md:mb-0"
                )}>
                    {items.map(({ label, icon: Icon, onClick }) => (
                        <button
                            key={label}
                            onClick={() => { onClick(); setOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl"
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

ProfileMenu.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    showLabel: PropTypes.bool,
};

export default ProfileMenu;
