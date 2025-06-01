import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import useLogin from "../../../../hooks/useLogin.js";

import CustomAppBar from "../../../../components/layout/CustomAppBar.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Logo from "../../../../components/logo/Logo.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import DesktopMenu from "../desktopMenu/DesktopMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";
import clsx from "clsx";
import RequireAuthUI from "../../../../components/layout/RequireAuthUI.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const { errorMessage } = useLogin();
    const navigate = useNavigate();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showError, setShowError] = useState(false);
    const [startInRegisterMode, setStartInRegisterMode] = useState(false);

    useEffect(() => {
        if (errorMessage) setShowError(true);
    }, [errorMessage]);

    return (
        <CustomAppBar
            className={clsx(
                // Mobiel/medium: fixed onderaan
                "fixed bottom-0 w-full z-50",
                // Desktop (>=lg): vastgezet links, volledige hoogte
                "md:top-0 md:left-0 md:bottom-auto md:h-screen md:w-auto md:max-w-max bg-appBarColor"
            )}
            bgColor="bg-appBarColor"
        >

            {/* Mobile layout */}
            <CustomBox className="flex md:hidden items-center justify-between px-4 py-2 w-full">
                <CustomBox className="flex items-center gap-2">
                    <MealsMenu />
                    <DietsMenu />
                    <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => {
                            setStartInRegisterMode(false);
                            setShowLoginForm(true);
                        }}
                        onRegisterClick={() => {
                            setStartInRegisterMode(true);
                            setShowLoginForm(true);
                        }}
                        text="Profile"
                    />
                </CustomBox>
                <CustomBox className="relative">
                    <HamburgerMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => {
                            setStartInRegisterMode(false);
                            setShowLoginForm(true);
                        }}
                        onRegisterClick={() => {
                            setStartInRegisterMode(true);
                            setShowLoginForm(true);
                        }}
                        iconColor="text.light"
                    />
                </CustomBox>
            </CustomBox>

            {/* Desktop layout */}
            <CustomBox className="hidden md:flex md:flex-col md:justify-between md:h-full">
                <CustomBox className="flex flex-col space-y-6 px-4 py-4">
                    <Logo size={40} className="hidden lg:block text-white" to="/" />
                    <CustomDivider className="hidden lg:block  mx-0 bg-gray-200 dark:bg-gray-600" />
                    <MealsMenu />
                    <CustomDivider className="mx-0 bg-gray-200 dark:bg-gray-600" />
                    <DietsMenu />
                    <CustomDivider className="mx-0 bg-gray-200 dark:bg-gray-600" />
                    <ProfileMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => {
                            setStartInRegisterMode(false);
                            setShowLoginForm(true);
                        }}
                        onRegisterClick={() => {
                            setStartInRegisterMode(true);
                            setShowLoginForm(true);
                        }}
                        text="Profile"
                    />
                    <CustomDivider className="mx-0 bg-gray-200 dark:bg-gray-600" />
                </CustomBox>

                <CustomBox className="flex flex-col space-y-4 px-4 pb-4">
                    <DesktopMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => setShowLoginForm(true)}
                        onRegisterClick={() => setShowLoginForm(true)}
                    />
                    <DarkModeSwitch />
                </CustomBox>
            </CustomBox>

            <RequireAuthUI
                dialogOpen={false}
                onClose={() => setShowLoginForm(false)}
                message=""
                showLoginForm={showLoginForm}
                onLoginClose={() => setShowLoginForm(false)}
                onLoginSuccess={() => setShowLoginForm(false)}
                onLoginRedirect={() => setShowLoginForm(true)}
                startInRegisterMode={startInRegisterMode}
            />

        </CustomAppBar>
    );
};

NavBar.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
