import { Box, Typography, Divider, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { formatEnum } from "../helper/formatEnum.js";
import { useTheme } from "@mui/material/styles";

/**
 * FilterSection component - Renders a section of filter options with selectable chips.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the filter section
 * @param {string[]} props.items - The list of filter options
 * @param {Object} props.selectedFilters - The currently selected filters
 * @param {string} props.category - The filter category (e.g., "mealType", "diet", "cuisine")
 * @param {Function} props.onFilterClick - Callback function to handle filter selection
 */
const FilterSection = ({ title, items, selectedFilters, category, onFilterClick }) => {
    const theme = useTheme();

    // If there are no items, do not render the section
    if (!items.length) return null;

    return (
        <Box>
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: "bold",
                    marginTop: 1,
                    fontSize:{ xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" }
            }}
            >
                {title}
            </Typography>

            {/* Divider with dynamic color based on theme mode */}
            <Divider sx={{ marginY: 1,
                borderColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#2d2f39",
                marginBottom: "15px",
            }}
            />

            {/* Render filter options as selectable Chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                {items.map(item => {
                    const isSelected = selectedFilters[category] === item;
                    return (
                        <Chip
                            key={item}
                            label={formatEnum(item)}
                            clickable
                            variant="outlined"
                            onClick={() => onFilterClick(category, item)}
                            sx={{
                                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                                padding: "4px",
                                height: "auto",
                                borderColor: theme.palette.primary.main,
                                color: isSelected ? theme.palette.text.light : theme.palette.primary.main,
                                backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
                                "&:hover": {
                                    backgroundColor: isSelected ? theme.palette.primary.dark : "rgba(0, 0, 0, 0.04)", // Hover effect
                                },
                                "& .MuiChip-label": {
                                    paddingLeft: { xs: "4px", sm: "8px"},
                                    paddingRight: { xs: "4px", sm: "8px" },
                                },
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};

FilterSection.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selectedFilters: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
    onFilterClick: PropTypes.func.isRequired,
};

export default FilterSection;
