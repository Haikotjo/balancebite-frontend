import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import { Menu } from "lucide-react";
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
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { useLocation } from "react-router-dom";
import LoginRegisterForm from "../authLoginRegisterForm/LoginRegisterForm.jsx";


const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [startInRegisterMode, setStartInRegisterMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

    return (
        <CustomAppBar
            className={clsx(
                "fixed bottom-0 w-full z-50",
                "md:top-0 md:left-0 md:bottom-auto md:h-screen md:w-auto md:max-w-max bg-appBarColor"
            )}
            bgColor="bg-appBarColor"
        >

            {/* Mobile layout */}
            <CustomBox className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300">
                {/* Menu-knop */}
                <CustomBox className="relative">
                    <CustomButton
                        onClick={() => setShowMobileMenu((prev) => !prev)}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-t-xl rounded-b-none px-4 pt-1 pb-2 bg-appBarColor text-white text-sm font-bold flex items-center gap-2"
                    >
                        <Menu size={26} />
                    </CustomButton>
                </CustomBox>

                {/* Menu-balk */}
                {showMobileMenu && (
                    <CustomBox className="bg-appBarColor px-4 py-2">
                        <CustomBox className="flex items-center justify-between w-full">
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
                    </CustomBox>
                )}
            </CustomBox>



            {/* Desktop layout */}
            <CustomBox className="hidden md:flex md:flex-col md:justify-between md:h-full">
                <CustomBox className="flex flex-col space-y-6 px-4 py-4">
                    <Logo size={40} className="block text-white" to="/" />
                    <CustomDivider className="block mx-0 bg-white" />
                    <MealsMenu />
                    <CustomDivider className="block mx-0 bg-white" />
                    <DietsMenu />
                    <CustomDivider className="block mx-0 bg-white" />
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
                    <CustomDivider className="hidden lg:block  mx-0 bg-white" />
                </CustomBox>

                <CustomBox className="flex flex-col space-y-4 px-4 pb-4">
                    <DesktopMenu
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
                    />
                    <DarkModeSwitch />
                </CustomBox>
            </CustomBox>

            {showLoginForm && (
                <LoginRegisterForm
                    onClose={() => setShowLoginForm(false)}
                    onLogin={() => setShowLoginForm(false)}
                    onRegister={() => setShowLoginForm(false)}
                    startInRegisterMode={startInRegisterMode}
                />
            )}
        </CustomAppBar>
    );
};

NavBar.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
