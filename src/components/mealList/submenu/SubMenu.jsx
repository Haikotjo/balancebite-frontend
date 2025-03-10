import { Box, Button, ButtonGroup, useTheme, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import PropTypes from "prop-types";

/**
 * SubMenu component renders a group of buttons with icons based on the user's authentication status.
 * Each button updates the active meal category in the context.
 *
 * @component
 */
function SubMenu({ activeOption, setActiveOption }) {
    const { user } = useContext(AuthContext); // Access authenticated user context
    // const { activeOption, setActiveOption } = useContext(UserMealsContext); // Use context for activeOption
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is small

    // Define available options based on user authentication status
    const options = user
        ? [
            { label: "All Meals", smallLabel: "Meals", icon: MenuBookRoundedIcon },
            { label: "My Meals", smallLabel: "My Meals", icon: FoodBankRoundedIcon },
            { label: "Created Meals", smallLabel: "Created", icon: AccountBoxRoundedIcon },
        ]
        : [{ label: "All Meals", smallLabel: "Meals", icon: MenuBookRoundedIcon }];

    /**
     * Handles button clicks by setting the active meal category.
     * @param {string} option - The selected meal category.
     */
    const handleButtonClick = (option) => {
        console.log("📌 SubMenu gives:", option);
        setActiveOption(option);
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
                        "&:hover": { backgroundColor: theme.palette.primary.light },
                        fontSize: "1rem", // Default font size
                        padding: "8px 12px", // Default padding
                        [theme.breakpoints.down("sm")]: {
                            fontSize: "0.6rem",
                            padding: "6px 15px", // Adjusted for small screens
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
                        className={option.label === activeOption ? "active" : ""}
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <option.icon
                            sx={{
                                fontSize: isSmallScreen ? "2rem" : "1.5rem",
                                marginBottom: isSmallScreen ? "6px" : "0",
                                marginRight: isSmallScreen ? "0" : "8px",
                            }}
                        />
                        {isSmallScreen ? option.smallLabel : option.label}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
}

SubMenu.propTypes = {
    activeOption: PropTypes.string.isRequired,
    setActiveOption: PropTypes.func.isRequired,
};

export default SubMenu;
