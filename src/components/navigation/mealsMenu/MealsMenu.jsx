import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu } from "@mui/material";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItemComponent from "./menuItemComponent/MenuItemComponent.jsx";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx"; // Import UserMealsContext

/**
 * A dropdown menu for accessing meal-related pages.
 * Displays menu options such as "All Meals," "My Meals," and "Create Meal."
 * The visibility of menu options depends on the user's authentication status.
 * If no user is logged in, the buttons will show a warning.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.iconColor] - The color of the menu trigger icon.
 * @param {string} [props.text] - Text displayed next to the menu trigger icon.
 * @returns {JSX.Element} The rendered MealsMenu component.
 */
const MealsMenu = ({ iconColor, text }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Tracks whether the menu is open
    const { user } = useContext(AuthContext); // Access user authentication status
    const { updateEndpoint, availableEndpoints } = useContext(UserMealsContext); // Access meal-related endpoints
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
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {/* Option: All Meals */}
                <MenuItemComponent
                    icon={MenuBookRoundedIcon}
                    label="All Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        updateEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`);
                        navigate("/meals");
                    }}
                    requiresAuth={false}
                />

                {/* Option: My Meals */}
                <MenuItemComponent
                    icon={FoodBankRoundedIcon}
                    label="My Meals"
                    path="/meals"
                    onClose={() => {
                        handleMenuClose();
                        const userMealsEndpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`;
                        if (user && availableEndpoints.includes(userMealsEndpoint)) {
                            updateEndpoint(userMealsEndpoint);
                            navigate("/meals");
                        }
                    }}
                    requiresAuth={true}
                />

                {/* Option: Create Meal */}
                <MenuItemComponent
                    icon={AddCircleOutlineRoundedIcon}
                    label="Create Meal"
                    path="/create-meal"
                    onClose={() => {
                        handleMenuClose();
                        if (user) {
                            navigate("/create-meal");
                        }
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
};

export default MealsMenu;
