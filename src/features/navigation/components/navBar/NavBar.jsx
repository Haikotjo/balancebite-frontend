import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import { Menu, Apple, Gauge } from "lucide-react";
import CustomAppBar from "../../../../components/layout/CustomAppBar.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import DesktopMenu from "../desktopMenu/DesktopMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";
import clsx from "clsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import LoginRegisterForm from "../authLoginRegisterForm/LoginRegisterForm.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import Logo from "../../../../components/logo/Logo.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [startInRegisterMode, setStartInRegisterMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

    return (
        <CustomAppBar
            className={clsx(
                "fixed bottom-0 w-full z-50",
                "md:top-0 md:left-0 md:bottom-auto md:h-screen md:w-[72px] md:max-w-none bg-appBarColor"
            )}
            bgColor="bg-appBarColor"
        >

            {/* Mobile layout */}
            <CustomBox className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300">
                {/* Menu-button */}
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
                            <CustomBox className="flex items-center gap-4">


                                <Logo size={30} className=" text-white mr-1" to="/" />


                                <MealsMenu showLabel={false}/>
                                <DietsMenu showLabel={false}/>
                                <CustomIconButton
                                    icon={<Apple className="text-white" />}
                                    onClick={() => navigate("/ingredients")}
                                    bgColor="bg-transparent"
                                    size={32}
                                    className="mr-2"
                                />
                                <CustomIconButton
                                    icon={<Gauge className="text-white" />}
                                    onClick={() => navigate("/dashboard")}
                                    bgColor="bg-transparent"
                                    size={32}
                                    className="mr-2"
                                />
                                <ProfileMenu
                                    showLabel={false}
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
                                />
                            </CustomBox>
                        </CustomBox>
                    </CustomBox>
                )}
            </CustomBox>



            {/* Desktop layout */}
            <CustomBox className="hidden md:flex md:h-full">
                <CustomBox className="h-full w-full">
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
