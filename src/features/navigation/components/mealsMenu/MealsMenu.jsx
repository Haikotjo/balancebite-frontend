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
import ChevronToggle from "../../../../components/chevronToggle/ChevronToggle.jsx";
import clsx from "clsx";
import { getActiveSection } from "../../utils/helpers/navSectionHelpers.js";

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

    // Trigger voor dropdown (sm + md)
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
                    Meals
                </CustomTypography>
            )}

            <Soup className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            <ChevronToggle open={open} />
        </CustomBox>
    );

    const compactTrigger = (
        <CustomBox
            onClick={() => setOpen(!open)}
            className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all hover:bg-white/10",
                isMealsSectionActive && "bg-white/25"
            )}
        >
            <Soup className="w-6 h-6 text-white" />
            <ChevronToggle
                open={open}
                mobileSize={14}
                desktopSize={16}
                className="ml-1"
            />
        </CustomBox>
    );


    // ---------- COMPACT: lg+ vaste lijst, sm/md dropdown ----------
    if (compact) {
        return (
            <>
                {/* sm + md: werkt als dropdown, menu opent op md rechts (md:left-full) */}
                <CustomBox className="block lg:hidden w-full">
                    <CustomDropdownWeb
                        open={open}
                        onOpenChange={setOpen}
                        className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                        trigger={compactTrigger}
                        items={[
                            {
                                label: "Explore Meals",
                                icon: BookOpen,
                                onClick: () => {
                                    setOpen(false);
                                    handleExploreMeals();
                                },
                            },
                            {
                                label: "My Meals",
                                icon: Soup,
                                disabled: !user,
                                onClick: () => {
                                    setOpen(false);
                                    handleMyMeals();
                                },
                            },
                            {
                                label: "Created Meals",
                                icon: UserPen,
                                disabled: !user,
                                onClick: () => {
                                    setOpen(false);
                                    handleCreatedMeals();
                                },
                            },
                            {
                                label: "Create Meal",
                                icon: Pencil,
                                disabled: !user,
                                onClick: () => {
                                    setOpen(false);
                                    handleCreateMeal();
                                },
                            },
                        ]}
                    />
                </CustomBox>

                {/* lg+: vaste lijst zoals je nu wilde voor de brede navbar */}
                <CustomBox className="hidden lg:block w-full text-white">
                    <CustomBox
                        className={clsx(
                            "flex items-center gap-2 px-3 py-2 rounded-md",
                            isMealsSectionActive && "bg-white/25"
                        )}
                    >
                        <Soup className="w-5 h-5" fill="currentColor" />
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
                        <button
                            type="button"
                            onClick={handleExploreMeals}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10 text-left"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Explore Meals</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleMyMeals}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10 text-left"
                        >
                            <Soup className="w-4 h-4" />
                            <span>My Meals</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCreatedMeals}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10 text-left"
                        >
                            <UserPen className="w-4 h-4" />
                            <span>Created Meals</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleCreateMeal}
                            className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/10 text-left"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Create Meal</span>
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

    // ---------- NIET-COMPACT: mobiel / andere plekken (ongewijzigd gedrag) ----------
    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                trigger={trigger}
                items={[
                    {
                        label: "Explore Meals",
                        icon: BookOpen,
                        onClick: () => {
                            setOpen(false);
                            handleExploreMeals();
                        },
                    },
                    {
                        label: "My Meals",
                        icon: Soup,
                        disabled: !user,
                        onClick: () => {
                            setOpen(false);
                            handleMyMeals();
                        },
                    },
                    {
                        label: "Created Meals",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            setOpen(false);
                            handleCreatedMeals();
                        },
                    },
                    {
                        label: "Create Meal",
                        icon: Pencil,
                        disabled: !user,
                        onClick: () => {
                            setOpen(false);
                            handleCreateMeal();
                        },
                    },
                ]}
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
