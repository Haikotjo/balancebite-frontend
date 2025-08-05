import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import { ChevronDown, Soup, ChevronUp, Pencil, UserPen, BookOpen } from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * MealsMenu component renders a dropdown trigger and menu for navigating
 * between meal-related pages: All Meals, My Meals, Created Meals, and Create Meal.
 * Disabled items prompt login if the user is unauthenticated.
 *
 * @component
 * @returns {JSX.Element}
 */
const MealsMenu = () => {
    // State for dropdown open/closed
    const [open, setOpen] = useState(false);
    // State for any authentication warning message
    const [authMsg, setAuthMsg] = useState(null);
    // Authenticated user object (null if not logged in)
    const { user } = useContext(AuthContext);
    // Context function to set which meal filter is active
    const { setActiveOption } = useContext(UserMealsContext);
    // Navigation helper from react-router
    const navigate = useNavigate();

    /**
     * Show authentication warning for protected items.
     * @param {string} label - Name of the menu item that requires login.
     */
    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        // Auto-dismiss after 3 seconds
        setTimeout(() => setAuthMsg(null), 3000);
    };

    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                trigger={
                    <CustomBox
                        onClick={() => setOpen(!open)}
                        className="w-full flex justify-between items-center cursor-pointer text-white"
                    >
                        {/* Button label shown on sm+ screens */}
                        <CustomTypography className="text-xs sm:text-sm text-white mr-2 md:inline">
                            Meals
                        </CustomTypography>

                        {/* Always-visible soup icon */}
                        <Soup fill="white" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        {/* Chevron indicator */}
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
                }
                items={[
                    {
                        label: "Explore Meals",
                        icon: BookOpen,
                        /** Navigate to /meals showing all options */
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
                        /** If not logged in, show auth warning */
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

export default MealsMenu;
