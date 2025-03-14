import { Box, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { CircleX } from "lucide-react";
import { useTheme } from '@mui/material/styles';
import {formatEnum} from "../../../utils/helpers/formatEnum.js";

/**
 * ActiveFilters component - Displays active filters as removable chips.
 *
 * @component
 * @param {Object} filters - An object containing active filters, where keys are categories (e.g., "diet") and values are selected filter options.
 * @param {Function} onFilterClick - Function to handle filter removal when a chip is clicked.
 */
const ActiveFilters = ({ filters, onFilterClick }) => {
    console.log("🎯 Received filters in ActiveFilters:", filters);

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                padding: 1,
                gap: 1,
                flexWrap: "wrap",
            }}
        >
            {Object.entries(filters).map(([key, value]) => (
                <Chip
                    key={key}
                    label={formatEnum(value)} // Pas formatEnum toe
                    variant="outlined"
                    onDelete={() => onFilterClick(key)}
                    deleteIcon={<CircleX size={16} color={theme.palette.text.primary} />}
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
    filters: PropTypes.object.isRequired,
    onFilterClick: PropTypes.func.isRequired, //
};

export default ActiveFilters;
