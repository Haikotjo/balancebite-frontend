import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { ChevronDown, ChevronUp, Soup, Pencil, UserPen, BookOpen } from "lucide-react";
import ChevronToggle from "../../../../components/chevronToggle/ChevronToggle.jsx";

const MealsMenu = ({ compact = false, showLabel = true }) => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const { setActiveOption } = useContext(UserMealsContext);
    const navigate = useNavigate();

    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 3000);
    };

    // Trigger UI
    const trigger = compact ? (
        // Icon-only trigger for DesktopMenu: soup + chevron, same size as other icons
        <CustomBox
            onClick={() => setOpen(!open)}
            className="relative p-2 pr-8 rounded-md hover:bg-white/10 cursor-pointer text-white"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            <Soup className="w-8 h-8 mx-auto" fill="currentColor" />
            <ChevronToggle open={open} />
        </CustomBox>
    ) : (
        // Default trigger with text (mobile/overal)
        <CustomBox
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center cursor-pointer text-white"
            aria-haspopup="menu"
            aria-expanded={open}
        >
            {showLabel && (
                <CustomTypography bold font="sans" className="text-xs sm:text-sm text-white mr-2 md:inline">
                    Meals
                </CustomTypography>
            )}

            <Soup className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
            <ChevronToggle open={open} />
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
                        label: "Explore Meals",
                        icon: BookOpen,
                        onClick: () => {
                            setOpen(false);
                            setActiveOption("All Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "My Meals",
                        icon: Soup,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("My Meals");
                            setOpen(false);
                            setActiveOption("My Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Created Meals",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Created Meals");
                            setOpen(false);
                            setActiveOption("Created Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Create Meal",
                        icon: Pencil,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Create Meal");
                            setOpen(false);
                            navigate("/create-meal");
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
    /** Compact icon-only variant for DesktopMenu */
    compact: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default MealsMenu;
