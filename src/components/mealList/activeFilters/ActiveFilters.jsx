import { Box, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { CircleX } from "lucide-react";
import { useTheme } from '@mui/material/styles';

/**
 * ActiveFilters component - Displays active filters as removable chips.
 *
 * @component
 * @param {Object} filters - An object containing active filters, where keys are categories (e.g., "diet") and values are selected filter options.
 * @param {Function} onFilterClick - Function to handle filter removal when a chip is clicked.
 */
const ActiveFilters = ({ filters, onFilterClick }) => {
    console.log("🎯 Received filters in ActiveFilters:", filters);

    const theme = useTheme(); // Access theme to match color styles

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                padding: 1,
                gap: 1,
                flexWrap: "wrap", // Ensures filters wrap to a new line if needed
            }}
        >
            {Object.entries(filters).map(([key, value]) => (
                <Chip
                    key={key}
                    label={value} // Display filter value
                    variant="outlined"
                    onDelete={() => onFilterClick(key)} // Calls function to remove filter when clicked
                    deleteIcon={<CircleX size={16} color={theme.palette.text.primary} />} // Close icon with theme color
                    sx={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                    }}
                />
            ))}
        </Box>
    );
};

ActiveFilters.propTypes = {
    filters: PropTypes.object.isRequired, // Expects an object with key-value filter pairs
    onFilterClick: PropTypes.func.isRequired, // Expects a function to handle filter removal
};

export default ActiveFilters;
