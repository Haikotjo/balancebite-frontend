import { Box, Button, ButtonGroup } from "@mui/material";
import PropTypes from "prop-types";

/**
 * SubMenu component renders a group of buttons based on provided options.
 * Each button triggers an action when clicked.
 *
 * @param {Array} options - Array of button labels.
 * @param {Function} onOptionClick - Callback function executed when a button is clicked.
 */
function SubMenu({ options = [], onOptionClick }) {
    /**
     * Handle button click and execute the provided callback.
     * @param {string} option - The label of the clicked button.
     */
    const handleButtonClick = (option) => {
        console.log("SubMenu button clicked:", option);
        if (onOptionClick) {
            onOptionClick(option);
        }
    };

    return (
        <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "center" }}>
            <ButtonGroup variant="contained" color="primary" aria-label="submenu">
                {options.map((option, index) => (
                    <Button key={index} onClick={() => handleButtonClick(option)}>
                        {option}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
}

// Define PropTypes for better type checking and documentation
SubMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string), // Array of button labels
    onOptionClick: PropTypes.func, // Callback function for button clicks
};

export default SubMenu;
