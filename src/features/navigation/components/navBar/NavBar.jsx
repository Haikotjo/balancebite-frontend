import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import CustomAppBar from "../../../../components/layout/CustomAppBar.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DesktopMenu from "../desktopMenu/DesktopMenu.jsx";
import clsx from "clsx";
import {useLocation} from "react-router-dom";
import LoginRegisterForm from "../authLoginRegisterForm/LoginRegisterForm.jsx";
import MobileNavBar from "../mobileNavBar/MobileNavBar.jsx";
import DesktopMenuMd from "../desktopMenuMd/DesktopMenuMd.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [startInRegisterMode, setStartInRegisterMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();


    const handleLoginClick = () => {
        setStartInRegisterMode(false);
        setShowLoginForm(true);
    };

    const handleRegisterClick = () => {
        setStartInRegisterMode(true);
        setShowLoginForm(true);
    };

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

    return (
        <CustomAppBar
            className={clsx(
                "fixed bottom-0 w-full z-50",
                "md:top-0 md:left-0 md:bottom-auto md:h-screen md:max-w-none bg-appBarColor",
                "md:w-20 lg:w-44"
            )}
            bgColor="bg-appBarColor"
        >

        {/* Mobile layout */}
            <MobileNavBar
                user={user}
                onLogout={handleLogout}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
            />

            {/* MD layout */}
            <DesktopMenuMd
                user={user}
                onLogout={handleLogout}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
            />

            {/* Desktop layout */}
            <CustomBox className="hidden lg:flex lg:h-full">
                <CustomBox className="h-full w-full">
                    <DesktopMenu
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={handleLoginClick}
                        onRegisterClick={handleRegisterClick}
                    />
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
