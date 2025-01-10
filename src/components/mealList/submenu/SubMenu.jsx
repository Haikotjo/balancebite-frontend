import { Box, Button, ButtonGroup, useTheme, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { useContext } from "react";
import { UserMealsContext } from "../../../context/UserMealsContext.jsx"; // Import UserMealsContext
import { AuthContext } from "../../../context/AuthContext.jsx"; // Import AuthContext
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";

/**
 * SubMenu component renders a group of buttons with icons based on the user's context and actions.
 * Each button updates the current endpoint in the UserMealsContext and visually highlights the active button.
 *
 * @component
 */
function SubMenu() {
    const { user } = useContext(AuthContext); // Access authenticated user context
    const { updateEndpoint, availableEndpoints, activeOption, setActiveOption } = useContext(UserMealsContext); // Use context for activeOption
    const theme = useTheme(); // Access the Material-UI theme for consistent styling
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is small

    // Define options based on user's authentication status
    const options = user
        ? [
            { label: "All Meals", smallLabel: "Meals", icon: MenuBookRoundedIcon },
            { label: "My Meals", smallLabel: "My Meals", icon: FoodBankRoundedIcon },
            { label: "Created Meals", smallLabel: "Created", icon: AccountBoxRoundedIcon },
        ]
        : [{ label: "All Meals", smallLabel: "Meals", icon: MenuBookRoundedIcon }];

    /**
     * Handle button click and update the endpoint in the context.
     * @param {string} option - The label of the clicked button.
     */
    const handleButtonClick = (option) => {
        let newEndpoint;

        switch (option) {
            case "All Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`;
                break;
            case "My Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`;
                break;
            case "Created Meals":
                newEndpoint = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATED_MEALS_ENDPOINT}`;
                break;
            default:
                newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`;
                break;
        }

        // Update the endpoint only if it is available
        if (availableEndpoints.includes(newEndpoint)) {
            updateEndpoint(newEndpoint);
            setActiveOption(option); // Update the active option in the context
        } else {
            console.warn("Attempted to set an unavailable endpoint:", newEndpoint);
        }
    };

    return (
        <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "center" }}>
            <ButtonGroup
                variant="contained"
                aria-label="submenu"
                sx={{
                    "& .MuiButton-root": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.light,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light,
                        },
                        fontSize: "1rem", // Default font size
                        padding: "8px 12px", // Default padding
                        [theme.breakpoints.down("sm")]: {
                            fontSize: "0.75rem", // Slightly larger font size for small screens
                            padding: "10px 20px", // Larger padding for small screens
                        },
                    },
                    "& .MuiButton-root.active": {
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.text.light,
                    },
                }}
            >
                {options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleButtonClick(option.label)}
                        className={option.label === activeOption ? "active" : ""} // Highlight active button
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row", // Icon above text on small screens
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <option.icon
                            sx={{
                                fontSize: isSmallScreen ? "2.5rem" : "1.5rem", // Larger icon size for small screens
                                marginBottom: isSmallScreen ? "6px" : "0", // More space between icon and text on small screens
                                marginRight: isSmallScreen ? "0" : "8px", // Space to the right of the icon on large screens
                            }}
                        />
                        {isSmallScreen ? option.smallLabel : option.label}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
}

SubMenu.propTypes = {};

export default SubMenu;
