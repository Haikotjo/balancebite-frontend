import { Box, Button, ButtonGroup } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx"; // Import UserMealsContext
import { AuthContext } from "../../../context/AuthContext.jsx"; // Import AuthContext
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SuggestionIcon from "@mui/icons-material/EmojiObjectsRounded"; // Suggested meals icon

/**
 * SubMenu component renders a group of buttons with icons based on the user's context and actions.
 * Each button updates the current endpoint in the UserMealsContext and adjusts active buttons dynamically.
 *
 * @component
 */
function SubMenu() {
    const { user } = useContext(AuthContext); // Access authenticated user context
    const { updateEndpoint, availableEndpoints } = useContext(UserMealsContext); // Access UserMealsContext
    const [activeOption, setActiveOption] = useState(null); // Track the currently active button

    // Define options based on user's authentication status
    const options = user
        ? [
            { label: "All My Meals", icon: MenuBookRoundedIcon },
            { label: "My Created Meals", icon: AccountBoxRoundedIcon },
            { label: "Suggested Meals", icon: SuggestionIcon },
        ]
        : [{ label: "All Meals", icon: MenuBookRoundedIcon }];

    /**
     * Handle button click and update the endpoint in the context.
     * @param {string} option - The label of the clicked button.
     */
    const handleButtonClick = (option) => {
        console.log("SubMenu button clicked:", option);

        let newEndpoint;

        switch (option) {
            case "All My Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`;
                break;
            case "My Created Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATED_MEALS_ENDPOINT}`;
                break;
            case "Suggested Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals/suggestions`;
                break;
            default:
                newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`;
                break;
        }

        // Update the endpoint only if it is available
        if (availableEndpoints.includes(newEndpoint)) {
            updateEndpoint(newEndpoint);
            setActiveOption(option); // Set the clicked button as active
        } else {
            console.warn("Attempted to set an unavailable endpoint:", newEndpoint);
        }
    };

    return (
        <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "center" }}>
            <ButtonGroup variant="contained" color="primary" aria-label="submenu">
                {options.map((option, index) => {
                    // Hide the currently active button and replace it with "All Meals" if applicable
                    if (option.label === activeOption) {
                        return (
                            <Button
                                key={index}
                                onClick={() => handleButtonClick("All Meals")}
                                startIcon={<MenuBookRoundedIcon />}
                            >
                                All Meals
                            </Button>
                        );
                    }
                    return (
                        <Button
                            key={index}
                            onClick={() => handleButtonClick(option.label)}
                            startIcon={<option.icon />}
                        >
                            {option.label}
                        </Button>
                    );
                })}
            </ButtonGroup>
        </Box>
    );
}

SubMenu.propTypes = {};

export default SubMenu;
