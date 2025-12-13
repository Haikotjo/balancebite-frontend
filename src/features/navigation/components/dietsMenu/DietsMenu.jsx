import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { ChevronDown, ChevronUp, CookingPot , Pencil, UserCheck, BookOpen, UserPen } from "lucide-react";

const DietsMenu = ({ compact = false, showLabel = true  }) => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { setActiveOption } = useContext(UserDietsContext);

    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 3000);
    };

    // Build trigger UI depending on compact mode
    const trigger = compact ? (
        // Icon-only trigger (desktop look): CookingPot  + chevron, same size as other icons
        <CustomBox
            onClick={() => setOpen(!open)}
            className="relative p-2 pr-8 rounded-md hover:bg-white/10 cursor-pointer text-white"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            <CookingPot  className="w-8 h-8 mx-auto" fill="currentColor" />
            {open ? (
                <>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:hidden pointer-events-none" />
                    <ChevronUp   className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 hidden md:block pointer-events-none" />
                </>
            ) : (
                <>
                    <ChevronUp   className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 md:hidden pointer-events-none" />
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 hidden md:block pointer-events-none" />
                </>
            )}
        </CustomBox>
    ) : (
        // Default trigger with text (mobile/elsewhere)
        <CustomBox
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center cursor-pointer text-white"
        >
            {showLabel && (
                <CustomTypography bold font="sans" className="text-xs sm:text-sm text-white mr-2 md:inline">
                    Diets
                </CustomTypography>
            )}
            <CookingPot  className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            {open ? (
                <>
                    <ChevronDown className="text-white w-5 h-5 mr-2 md:hidden" />
                    <ChevronUp className="text-white w-5 h-5 mr-2 hidden md:block" />
                </>
            ) : (
                <>
                    <ChevronUp className="text-white w-5 h-5 mr-2 md:hidden" />
                    <ChevronDown className="text-white w-5 h-5 mr-2 hidden md:block" />
                </>
            )}
        </CustomBox>
    );

    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                trigger={trigger}
                items={[
                    {
                        label: "Explore Diets",
                        icon: BookOpen,
                        onClick: () => {
                            setActiveOption("All Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "My Diets",
                        icon: UserCheck,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("My Diets");
                            setActiveOption("My Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "Created Diets",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Created Diets");
                            setActiveOption("Created Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "Create Diet",
                        icon: Pencil,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Create Diet");
                            setOpen(false);
                            navigate("/create-diet");
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

DietsMenu.propTypes = {
    /** Compact icon-only variant for DesktopMenu */
    compact: PropTypes.bool,
};

export default DietsMenu;
