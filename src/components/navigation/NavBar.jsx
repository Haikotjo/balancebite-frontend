import {useContext, useEffect, useState} from "react";
import HamburgerMenu from "./hamburgerMenu/HamburgerMenu";
import DesktopMenu from "./desktopMenu/DesktopMenu";
import ErrorAlert from "../errorAlert/ErrorAlert";
import useLogout from "../../hooks/useLogout.js";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../logo/Logo.jsx";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./profileMenu/ProfileMenu.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import PropTypes from "prop-types";
import DarkModeSwitch from "./darkModeSwitch/DarkModeSwitch.jsx";
import CustomAppBar from "../layout/CustomAppBar.jsx";
import CustomBox from "../layout/CustomBox.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const { errorMessage } = useLogin();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <CustomAppBar
            position={isMobile ? "fixed" : "sticky"}
            className={isMobile ? "bottom-0 top-auto" : "top-0"}
            bgColor="bg-primary"
        >
            <CustomBox className="w-full flex justify-between items-center px-4 py-1">
                {/* Logo */}
                {!isMobile && (
                    <CustomBox className="flex-shrink-0 p-2">
                        <Logo size={40} className="text-white" to="/" />
                    </CustomBox>
                )}


                {/* Menu */}
                <CustomBox className="flex items-center">
                    {/* Meals Menu */}
                    <CustomBox className="flex items-center">
                        <MealsMenu buttonClass="ml-2" />
                    </CustomBox>

                    {/* Profile menu */}
                    <CustomBox className="flex items-center ml-4">
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
            <ErrorAlert message={errorMessage} />
        </CustomAppBar>
    );
};

NavBar.propTypes = {
    onClose: PropTypes.func,
};

export default NavBar;
