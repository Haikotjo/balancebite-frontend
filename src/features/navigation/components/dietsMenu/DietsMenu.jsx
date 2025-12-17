import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { CookingPot, Pencil, UserCheck, BookOpen, UserPen } from "lucide-react";
import clsx from "clsx";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";
import SidebarActionButton from "../../../../components/layout/SidebarActionButton.jsx";
import SidebarSectionTrigger from "../../../../components/layout/SidebarSectionTrigger.jsx";
import {buildSidebarItems} from "../../../../utils/helpers/buildSidebarItems.js";

const DietsMenu = ({ compact = false, showLabel = true }) => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const { setActiveOption } = useContext(UserDietsContext);
    const navigate = useNavigate();
    const location = useLocation();

    const section = getActiveSection(location.pathname);
    const isDietSectionActive = section === "diets";

    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 2500);
    };

    const handleExploreDiets = () => {
        setActiveOption("All Diets");
        navigate("/diets");
    };

    const handleMyDiets = () => {
        if (!user) return showAuth("My Diets");
        setActiveOption("My Diets");
        navigate("/diets");
    };

    const handleCreatedDiets = () => {
        if (!user) return showAuth("Created Diets");
        setActiveOption("Created Diets");
        navigate("/diets");
    };

    const handleCreateDiet = () => {
        if (!user) return showAuth("Create Diet");
        navigate("/create-diet");
    };

    // ---------- NORMAL TRIGGER (sm + md) ----------
    const trigger = (
        <SidebarSectionTrigger
            label="Diets"
            Icon={CookingPot}
            open={open}
            onToggle={() => setOpen(!open)}
            compact={false}
            active={isDietSectionActive}
            showLabel={showLabel}
        />
    );

// ---------- COMPACT TRIGGER (lg+) ----------
    const compactTrigger = (
        <SidebarSectionTrigger
            label="Diets"
            Icon={CookingPot}
            open={open}
            onToggle={() => setOpen(!open)}
            compact
            active={isDietSectionActive}
            showLabel={false}
        />
    );

    const dropdownItems = buildSidebarItems({
        user,
        close: () => setOpen(false),
        items: [
            { label: "Explore Diets", icon: BookOpen, onClick: handleExploreDiets },
            { label: "My Diets", icon: CookingPot, onClick: handleMyDiets, requiresAuth: true },
            { label: "Created Diets", icon: UserPen, onClick: handleCreatedDiets, requiresAuth: true },
            { label: "Create Diet", icon: Pencil, onClick: handleCreateDiet, requiresAuth: true },
        ]
    });

    // ---------- COMPACT MODE ----------
    if (compact) {
        return (
            <>
                <CustomBox className="relative block lg:hidden w-full">
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
                            isDietSectionActive && "bg-white/25"
                        )}
                    >
                        <CookingPot className="w-5 h-5" />
                        <CustomTypography
                            bold
                            font="sans"
                            className="text-sm"
                            color="white"
                        >
                            Diets
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

    // ---------- NORMAL MODE ----------
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

DietsMenu.propTypes = {
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default DietsMenu;
