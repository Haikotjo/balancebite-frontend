import {useContext, useEffect, useState} from "react";
import HamburgerMenu from "./hamburgerMenu/HamburgerMenu";
import DesktopMenu from "./desktopMenu/DesktopMenu";
import useLogout from "../../hooks/useLogout.js";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../logo/Logo.jsx";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import PropTypes from "prop-types";
import DarkModeSwitch from "./darkModeSwitch/DarkModeSwitch.jsx";
import CustomAppBar from "../layout/CustomAppBar.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import ErrorDialog from "../layout/ErrorDialog.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const { errorMessage } = useLogin();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (errorMessage) {
            setShowError(true);
        }
    }, [errorMessage]);


    return (
        <CustomAppBar
            position={isMobile ? "fixed" : "sticky"}
            className={isMobile ? "bottom-0 top-auto" : "top-0"}
            bgColor="bg-appBarColor"
        >
            <CustomBox className="w-full flex justify-between items-center px-4 py-1">
                {/* Logo */}
                {!isMobile && (
                    <CustomBox className="flex-shrink-0 p-1">
                        <Logo size={40} className="text-white" to="/" />
                    </CustomBox>
                )}


                {/* Menu */}
                <CustomBox className="flex items-center">
                    {/* Meals Menu */}
                    <CustomBox className="flex items-center">
                        <MealsMenu />
                    </CustomBox>

                    {/* Profile menu */}
                    <CustomBox className="flex items-center mx-4">
                        <ProfileMenu
                            user={user}
                            onLogout={handleLogout}
                            onLoginClick={() => navigate("/login")}
                            onRegisterClick={() => navigate("/register")}
                            text="Profile"
                        />
                    </CustomBox>


                    {/* Hamburger and Desktop Menu */}
                    {isMobile ? (
                        <HamburgerMenu
                            user={user}
                            onLogout={handleLogout}
                            onLoginClick={() => navigate("/login")}
                            onRegisterClick={() => navigate("/register")}
                            iconColor="text.light"
                        />
                    ) : (
                        <DesktopMenu
                            user={user}
                            onLogout={handleLogout}
                            onLoginClick={() => navigate("/login")}
                            onRegisterClick={() => navigate("/register")}
                        />
                    )}
                </CustomBox>

                {/* Dark Mode Switch */}
                <DarkModeSwitch />
            </CustomBox >

            {/* Error Alert */}
            <ErrorDialog
                open={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
                type="error"
            />
        </CustomAppBar>
    );
};

NavBar.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
