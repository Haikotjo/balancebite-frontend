import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { Soup, Pencil, UserPen, BookOpen } from "lucide-react";
import clsx from "clsx";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";
import SidebarActionButton from "../../../../components/layout/SidebarActionButton.jsx";
import SidebarSectionTrigger from "../../../../components/layout/SidebarSectionTrigger.jsx";
import {buildSidebarItems} from "../../../../utils/helpers/buildSidebarItems.js";

const MealsMenu = ({ compact = false, showLabel = true }) => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const { setActiveOption } = useContext(UserMealsContext);
    const navigate = useNavigate();
    const location = useLocation();

    const section = getActiveSection(location.pathname);
    const isMealsSectionActive = section === "meals";

    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 3000);
    };

    const handleExploreMeals = () => {
        setActiveOption("All Meals");
        navigate("/meals");
    };

    const handleMyMeals = () => {
        if (!user) return showAuth("My Meals");
        setActiveOption("My Meals");
        navigate("/meals");
    };

    const handleCreatedMeals = () => {
        if (!user) return showAuth("Created Meals");
        setActiveOption("Created Meals");
        navigate("/meals");
    };

    const handleCreateMeal = () => {
        if (!user) return showAuth("Create Meal");
        navigate("/create-meal");
    };

    const trigger = (
        <SidebarSectionTrigger
            label="Meals"
            Icon={Soup}
            open={open}
            onToggle={() => setOpen(!open)}
            compact={false}
            active={isMealsSectionActive}
            showLabel={showLabel}
        />
    );

    const compactTrigger = (
        <SidebarSectionTrigger
            label="Meals"
            Icon={Soup}
            open={open}
            onToggle={() => setOpen(!open)}
            compact
            active={isMealsSectionActive}
            showLabel={false}
        />
    );

    const dropdownItems = buildSidebarItems({
        user,
        close: () => setOpen(false),
        items: [
            { label: "Explore Meals", icon: BookOpen, onClick: handleExploreMeals },
            { label: "My Meals", icon: Soup, onClick: handleMyMeals, requiresAuth: true },
            { label: "Created Meals", icon: UserPen, onClick: handleCreatedMeals, requiresAuth: true },
            { label: "Create Meal", icon: Pencil, onClick: handleCreateMeal, requiresAuth: true },
        ]
    });

    // ---------- COMPACT MODE ----------
    if (compact) {
        return (
            <>
                {/* sm + md: werkt als dropdown, menu opent op md rechts (md:left-full) */}
                <CustomBox className="block lg:hidden w-full">
                    <CustomDropdownWeb
                        open={open}
                        onOpenChange={setOpen}
                        className="
                                    absolute z-50
                                    bottom-full left-0 mb-2
                                    md:bottom-auto md:top-0
                                    md:left-full md:ml-5
                        "
                        trigger={compactTrigger}
                        items={dropdownItems}
                    />
                </CustomBox>

                <CustomBox className="hidden lg:block w-full text-white mb-2">
                    <CustomBox
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md",
                            isMealsSectionActive && "bg-white/25"
                        )}
                    >
                        <Soup className="w-5 h-5" />
                        <CustomTypography
                            bold
                            font="sans"
                            className="text-sm"
                            color="white"
                        >
                            Meals
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1 ml-7 flex flex-col gap-1">
                        {dropdownItems.map(item => (
                            <SidebarActionButton
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                onClick={item.onClick}
                                disabled={item.disabled}
                            />
                        ))}
                    </CustomBox>

                </CustomBox>

                <ErrorDialog
                    open={!!authMsg}
                    onClose={() => setAuthMsg(null)}
                    message={authMsg || ""}
                    actionLabel="Login or Register"
                    onAction={() => {
                        setAuthMsg(null);
                        navigate("/login");
                    }}
                />
            </>
        );
    }

    // ---------- NIET-COMPACT: mobiel / andere plekken (ongewijzigd gedrag) ----------
    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="absolute bottom-full mb-4 min-w-[10rem] max-w-[90vw]"
                trigger={trigger}
                items={dropdownItems}
            />


            <ErrorDialog
                open={!!authMsg}
                onClose={() => setAuthMsg(null)}
                message={authMsg || ""}
                actionLabel="Login or Register"
                onAction={() => {
                    setAuthMsg(null);
                    navigate("/login");
                }}
            />
        </>
    );
};

MealsMenu.propTypes = {
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default MealsMenu;
