import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import useLogin from "../../../../hooks/useLogin.js";

import CustomAppBar from "../../../../components/layout/CustomAppBar.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import Logo from "../../../../components/logo/Logo.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import DesktopMenu from "../desktopMenu/DesktopMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";
import clsx from "clsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const { errorMessage } = useLogin();
    const navigate = useNavigate();

    const [showError, setShowError] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024) return; // alleen vanaf lg
            const currentY = window.scrollY;

            if (currentY > lastScrollY && currentY > 80) {
                setIsVisible(false); // scroll naar beneden
            } else if (currentY < lastScrollY) {
                setIsVisible(true); // scroll omhoog
            }

            setLastScrollY(currentY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    useEffect(() => {
        if (errorMessage) setShowError(true);
    }, [errorMessage]);

    return (
        <CustomAppBar
            className={clsx(
                "fixed bottom-0 lg:sticky lg:top-0 lg:bottom-auto z-50 transition-transform duration-300",
                !isVisible && "lg:-translate-y-full",
                isVisible && "lg:translate-y-0"
            )}
            bgColor="bg-appBarColor"
        >

        {/* Mobile layout */}
            <CustomBox className="flex md:hidden items-center justify-between px-4 py-2 w-full">
                <CustomBox className="flex items-center gap-4">
                    <MealsMenu />
                    <DietsMenu />
                    <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => navigate("/login")}
                        onRegisterClick={() => navigate("/register")}
                        text="Profile"
                    />
                </CustomBox>
                <CustomBox className="relative">
                    <HamburgerMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => navigate("/login")}
                        onRegisterClick={() => navigate("/register")}
                        iconColor="text.light"
                    />
                </CustomBox>
            </CustomBox>

            {/* Desktop layout */}
            <CustomBox className="hidden md:flex items-center justify-between px-4 py-2 w-full">
                <CustomBox className="flex items-center gap-6">
                    <Logo size={40} className="text-white" to="/" />
                    <MealsMenu />
                    <DietsMenu />
                    <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => navigate("/login")}
                        onRegisterClick={() => navigate("/register")}
                        text="Profile"
                    />
                </CustomBox>
                <CustomBox className="flex items-center gap-4">
                    <DesktopMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => navigate("/login")}
                        onRegisterClick={() => navigate("/register")}
                    />
                    <DarkModeSwitch />
                </CustomBox>
            </CustomBox>

            {errorMessage && (
                <ErrorDialog
                    open={showError}
                    onClose={() => setShowError(false)}
                    message={errorMessage}
                    type="error"
                />
            )}
        </CustomAppBar>
    );
};

NavBar.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
