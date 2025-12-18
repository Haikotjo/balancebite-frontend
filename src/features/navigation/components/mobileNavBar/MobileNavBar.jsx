// src/features/navbar/components/mobileNavBar/MobileNavBar.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Apple, Gauge } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import Logo from "../../../../components/logo/Logo.jsx";

import MealsMenu from "../mealsMenu/MealsMenu.jsx";
import DietsMenu from "../dietsMenu/DietsMenu.jsx";
import ProfileMenu from "../profileMenu/ProfileMenu.jsx";
import HamburgerMenu from "../hamburgerMenu/HamburgerMenu.jsx";

import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";

/**
 * MobileNavBar - Bottom navigation for small screens (< md).
 * Note: Keep commented code blocks intact for potential later reuse.
 */
const MobileNavBar = ({
                          user,
                          onLogout,
                          onLoginClick,
                          onRegisterClick,
                          showMobileMenu,
                          setShowMobileMenu,
                      }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const section = getActiveSection(location.pathname);

    const isProfileSectionActive = section === "profile";
    const isMealsSectionActive = section === "meals";
    const isDietSectionActive = section === "diets";
    const isIngredientsActive = section === "ingredients";
    const isDashboardActive = section === "dashboard";
    const isHomeActive = section === "home";

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname, setShowMobileMenu]);

    return (
        <CustomBox className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300">
            {/* Menu-button */}
            {/*<CustomBox className="relative">*/}
            {/*    <CustomButton*/}
            {/*        onClick={() => setShowMobileMenu((prev) => !prev)}*/}
            {/*        className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-t-xl rounded-b-none px-4 pt-1 pb-2 bg-appBarColor text-white"*/}
            {/*    >*/}
            {/*        <Menu size={26} />*/}
            {/*    </CustomButton>*/}
            {/*</CustomBox>*/}

            {/* Menu-balk */}
            {/*{showMobileMenu && (*/}
            <CustomBox className="bg-appBarColor px-2 py-1">
                <CustomBox className="flex items-center w-full justify-between">
                    {/* Left: Home */}
                    <CustomBox className={clsx("rounded-md", isHomeActive && "bg-white/25")}>
                        <Logo size={30} className="block text-white" to="/" />
                    </CustomBox>

                    {/* MIDDLE: all menu’s */}
                    <CustomBox className="flex items-center gap-3">
                        <CustomBox
                            className={clsx("rounded-md", isMealsSectionActive && "bg-white/25 p-2")}
                        >
                            <MealsMenu showLabel={false} />
                        </CustomBox>

                        <CustomBox
                            className={clsx("rounded-md", isDietSectionActive && "bg-white/25 p-2")}
                        >
                            <DietsMenu showLabel={false} />
                        </CustomBox>

                        <CustomBox
                            className={clsx("rounded-md", isProfileSectionActive && "bg-white/25 p-2")}
                        >
                            <ProfileMenu
                                showLabel={false}
                                user={user}
                                onLogout={onLogout}
                                onLoginClick={onLoginClick}
                                onRegisterClick={onRegisterClick}
                            />
                        </CustomBox>

                        <CustomIconButton
                            icon={<Apple className="text-white" />}
                            onClick={() => navigate("/ingredients")}
                            bgColor={isIngredientsActive ? "bg-white/25 p-2" : "bg-transparent"}
                            size={32}
                        />

                        {user && (
                            <CustomIconButton
                                icon={<Gauge className="text-white" />}
                                onClick={() => navigate("/dashboard")}
                                bgColor={isDashboardActive ? "bg-white/25" : "bg-transparent"}
                                size={32}
                            />
                        )}
                    </CustomBox>

                    {/* Right: Hamburger */}
                    <HamburgerMenu
                        user={user}
                        onLogout={onLogout}
                        onLoginClick={onLoginClick}
                        onRegisterClick={onRegisterClick}
                    />
                </CustomBox>
            </CustomBox>
            {/*)}*/}
        </CustomBox>
    );
};

MobileNavBar.propTypes = {
    user: PropTypes.any,
    onLogout: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired,
    showMobileMenu: PropTypes.bool.isRequired,
    setShowMobileMenu: PropTypes.func.isRequired,
};

export default MobileNavBar;
