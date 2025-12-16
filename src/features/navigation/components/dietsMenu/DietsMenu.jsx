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
import ChevronToggle from "../../../../components/chevronToggle/ChevronToggle.jsx";
import clsx from "clsx";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";

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
        <CustomBox
            onClick={() => setOpen(!open)}
            className="w-full flex items-center cursor-pointer text-white justify-between md:justify-start md:gap-1"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {showLabel && (
                <CustomTypography
                    bold
                    font="sans"
                    className="hidden sm:inline md:hidden lg:inline text-xs sm:text-sm text-white mr-2"
                >
                    Diets
                </CustomTypography>
            )}
            <CookingPot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <ChevronToggle open={open} />
        </CustomBox>
    );

    // ---------- COMPACT TRIGGER (lg+) ----------
    const compactTrigger = (
        <CustomBox
            onClick={() => setOpen(!open)}
            className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all hover:bg-white/10",
                isDietSectionActive && "bg-white/25"
            )}
        >
            <CookingPot className="w-6 h-6 text-white" />
            <ChevronToggle
                open={open}
                mobileSize={14}
                desktopSize={16}
                className="ml-1"
            />
        </CustomBox>
    );

    const dropdownItems = [
        {
            label: "Explore Diets",
            icon: BookOpen,
            onClick: () => {
                setOpen(false);
                handleExploreDiets();
            },
        },
        {
            label: "My Diets",
            icon: UserCheck,
            disabled: !user,
            onClick: () => {
                setOpen(false);
                handleMyDiets();
            },
        },
        {
            label: "Created Diets",
            icon: UserPen,
            disabled: !user,
            onClick: () => {
                setOpen(false);
                handleCreatedDiets();
            },
        },
        {
            label: "Create Diet",
            icon: Pencil,
            disabled: !user,
            onClick: () => {
                setOpen(false);
                handleCreateDiet();
            },
        },
    ];

    // ---------- COMPACT MODE ----------
    if (compact) {
        return (
            <>
                <CustomBox className="block lg:hidden w-full">
                    <CustomDropdownWeb
                        open={open}
                        onOpenChange={setOpen}
                        className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                        trigger={compactTrigger}
                        items={dropdownItems}
                    />
                </CustomBox>

                <CustomBox className="hidden lg:block w-full text-white">
                    <CustomBox
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md",
                            isDietSectionActive && "bg-white/25"
                        )}
                    >
                        <CookingPot className="w-5 h-5" />
                        <CustomTypography bold font="sans" className="text-sm">
                            Diets
                        </CustomTypography>
                    </CustomBox>

                    <CustomBox className="mt-1 ml-7 flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={handleExploreDiets}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Explore Diets</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleMyDiets}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>My Diets</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCreatedDiets}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            <UserPen className="w-4 h-4" />
                            <span>Created Diets</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCreateDiet}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Create Diet</span>
                        </button>
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
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
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
