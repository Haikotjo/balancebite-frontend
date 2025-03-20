import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Divider } from "@mui/material";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import MenuItemComponent from "./menuItemComponent/MenuItemComponent.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx"; // Import UserMealsContext

/**
 * A dropdown menu for accessing meal-related pages.
 * Displays menu options such as "All Meals," "My Meals," "My Created Meals," and "Create Meal."
 * The visibility of menu options depends on the user's authentication status.
 * If no user is logged in, the buttons will show a warning.
 *
 * This component also updates the active option in the UserMealsContext
 * to ensure UI synchronization with the SubMenu component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.iconColor] - The color of the menu trigger icon.
 * @param {string} [props.text] - Text displayed next to the menu trigger icon.
 * @param {Function} [props.onClose] - Callback function to close the parent menu, such as a HamburgerMenu.
 * @returns {JSX.Element} The rendered MealsMenu component.
 */
const MealsMenu = ({ iconColor, text, onClose }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Tracks whether the menu is open
    const { user } = useContext(AuthContext); // Access user authentication status
    const { setActiveOption  } = useContext(UserMealsContext);// Access meal-related endpoints and active option
    const navigate = useNavigate(); // Hook for programmatic navigation


    /**
     * Opens the dropdown menu.
     * @param {Event} event - The triggering event.
     */
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the dropdown menu.
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Menu trigger button */}
            <div
                onClick={handleMenuOpen}
                style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: iconColor,
                }}
            >
                <FoodBankRoundedIcon />
                <KeyboardArrowDownIcon sx={{ fontSize: "16px", ml: 0.05, mr: 0.5 }} />
                {text && <span style={{ marginLeft: "8px" }}>{text}</span>}
            </div>

            {/* Dropdown menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItemComponent
                    icon={MenuBookRoundedIcon}
                    label="All Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        setActiveOption("All Meals");
                        navigate("/meals");
                    }}
                    requiresAuth={false}
                />
                <Divider sx={{ height: "1px", margin: 0 }} />

                <MenuItemComponent
                    icon={FoodBankRoundedIcon}
                    label="My Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        if (user) {
                            setActiveOption("My Meals");
                            navigate("/meals");
                        }
                    }}
                    requiresAuth={true}
                />
                <Divider sx={{ height: "1px", margin: 0 }} />

                <MenuItemComponent
                    icon={AccountBoxRoundedIcon}
                    label="Created Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        if (user) {
                            setActiveOption("Created Meals");
                            navigate("/meals");
                        }
                    }}
                    requiresAuth={true}
                />
                <Divider sx={{ height: "1px", margin: 0 }} />

                <MenuItemComponent
                    icon={CreateRoundedIcon}
                    label="Create Meal"
                    path="/create-meal"
                    onClose={() => {
                        handleMenuClose();
                        if (user) navigate("/create-meal");
                    }}
                    requiresAuth={true}
                />
            </Menu>
        </>
    );
};

MealsMenu.propTypes = {
    /**
     * The color of the menu trigger icon.
     */
    iconColor: PropTypes.string,
    /**
     * Text displayed next to the menu trigger icon.
     */
    text: PropTypes.string,
    /**
     * Callback function to close the parent menu, such as a HamburgerMenu.
     */
    onClose: PropTypes.func,
};

export default MealsMenu;
