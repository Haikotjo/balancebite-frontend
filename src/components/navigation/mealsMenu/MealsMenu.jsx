import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx";
import CustomBox from "../../layout/CustomBox.jsx";
import { ChevronDown, Soup } from "lucide-react";
import CustomDropdownWeb from "../../layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../layout/ErrorDialog.jsx";

/**
 * Dropdown menu for accessing meal-related pages.
 * Shows different options like "All Meals", "My Meals", "Created Meals", and "Create Meal".
 * Some options are disabled if the user is not logged in.
 *
 * Displays an error dialog if an unauthenticated user clicks on a restricted item.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.text] - Text to show next to the trigger icon.
 * @param {Function} [props.onClose] - Optional callback to close a parent menu (e.g., hamburger menu).
 * @returns {JSX.Element}
 */
const MealsMenu = ({ text, onClose }) => {
    const [, setAnchorEl] = useState(null); // Unused state, kept for API consistency
    const [authMessage, setAuthMessage] = useState(null); // Controls error dialog visibility
    const { user } = useContext(AuthContext); // Auth context: contains current user info
    const { setActiveOption } = useContext(UserMealsContext); // Updates the selected meal filter
    const navigate = useNavigate(); // Programmatic navigation

    /**
     * Handles opening the dropdown menu.
     * @param {React.MouseEvent} event
     */
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Handles closing the dropdown and optional parent menu.
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
        if (onClose) onClose();
    };

    /**
     * Triggers the error dialog with a message if user is not authenticated.
     * @param {string} label - The label of the restricted menu item.
     */
    const showAuthMessage = (label) => {
        setAuthMessage(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMessage(null), 3000); // Auto-dismiss after 3 seconds
    };

    return (
        <>
            {/* Dropdown menu */}
            <CustomDropdownWeb
                className="mt-2 left-0 w-full sm:left-auto sm:right-0 sm:w-56"
                trigger={
                    <CustomBox
                        onClick={handleMenuOpen}
                        className="flex items-center cursor-pointer text-white"
                    >
                        <Soup fill="white" />
                        <ChevronDown size={16} className="ml-0.5 mr-2" />
                        {text && <span className="ml-2">{text}</span>}
                    </CustomBox>
                }
                items={[
                    {
                        label: "All Meals",
                        icon: MenuBookRoundedIcon,
                        onClick: () => {
                            handleMenuClose();
                            setActiveOption("All Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "My Meals",
                        icon: FoodBankRoundedIcon,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuthMessage("My Meals");
                            handleMenuClose();
                            setActiveOption("My Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Created Meals",
                        icon: AccountBoxRoundedIcon,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuthMessage("Created Meals");
                            handleMenuClose();
                            setActiveOption("Created Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Create Meal",
                        icon: CreateRoundedIcon,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuthMessage("Create Meal");
                            handleMenuClose();
                            navigate("/create-meal");
                        },
                    },
                ]}
            />

            {/* Error dialog shown if user is not logged in */}
            <ErrorDialog
                open={!!authMessage}
                onClose={() => setAuthMessage(null)}
                message={authMessage || ""}
                actionLabel="Login or Register"
                onAction={() => {
                    setAuthMessage(null);
                    navigate("/login");
                }}
            />
        </>
    );
};

MealsMenu.propTypes = {
    text: PropTypes.string,
    onClose: PropTypes.func,
};

export default MealsMenu;
