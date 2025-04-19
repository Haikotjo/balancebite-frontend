import { useContext } from "react";
import {useTheme, useMediaQuery, MenuItem} from "@mui/material";
import HamburgerMenu from "./hamburgerMenu/HamburgerMenu";
import DesktopMenu from "./desktopMenu/DesktopMenu";
import ErrorAlert from "../errorAlert/ErrorAlert";
import useLogout from "../../hooks/useLogout.js";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext.jsx";
import Logo from "../logo/Logo.jsx";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./profileMenu/ProfileMenu.jsx";
import MealsMenu from "./mealsMenu/MealsMenu.jsx";
import PropTypes from "prop-types";
import DarkModeSwitch from "./darkModeSwitch/DarkModeSwitch.jsx";
import { useThemeMode } from "../../themes/ThemeProvider.jsx";
import VerticalDivider from "../verticalDivider/VerticalDivider.jsx";
import CustomAppBar from "../layout/CustomAppBar.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx"; // Import the CustomAppBar

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const { mode } = useThemeMode();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleLogout = useLogout();
    const { handleLogin, errorMessage } = useLogin();
    const navigate = useNavigate();

    return (
        <CustomAppBar
            position="sticky"
            bgColor="bg-primary"
        >
            <CustomBox className="w-full flex justify-between items-center px-4 py-1">
                {/* Logo */}
                <CustomBox className="flex-shrink-0 p-2">
                    <Logo size={40} color={theme.palette.text.light} to="/" />
                </CustomBox>

                {/* Menu */}
                <CustomBox className="flex items-center">
                    {/* Meals Menu */}
                    <CustomBox className="flex items-center">
                        <CustomButton
                            onClick={(e) => e.currentTarget.nextSibling.click()}
                            className="cursor-pointer hover:bg-white/20 dark:hover:bg-white/20 transition-all hidden sm:block"
                        >
                            Meals
                        </CustomButton>
                        <MealsMenu user={user} />
                    </CustomBox>



                    {/* Profile Menu */}
                    <CustomBox className="flex items-center">
                        <CustomButton
                            onClick={(e) => e.currentTarget.nextSibling.click()}
                            className="cursor-pointer hover:bg-white/20 dark:hover:bg-white/20 transition-all hidden sm:block"
                        >
                            Profile
                        </CustomButton>
                        <ProfileMenu
                            user={user}
                            onLogout={handleLogout}
                            onLoginClick={() => navigate("/login")}
                            onRegisterClick={() => navigate("/register")}
                            iconColor={theme.palette.text.light}
                            onClose={() => {}}
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
