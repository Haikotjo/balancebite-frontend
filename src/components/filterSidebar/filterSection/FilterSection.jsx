import { Box, Typography, Divider, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { formatEnum } from "../helper/formatEnum.js";
import { useTheme } from "@mui/material/styles";

const FilterSection = ({ title, items, selectedFilters, category, onFilterClick }) => {
    const theme = useTheme();

    if (!items.length) return null;

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginTop: 1 }}>
                {title}
            </Typography>
            <Divider sx={{ marginY: 1,
            borderColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#2d2f39",
                marginBottom: "15px",
            }} />
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
                                fontSize: "0.8rem",
                                padding: "4px",
                                height: "auto",
                                borderColor: theme.palette.primary.main,
                                color: isSelected ? theme.palette.text.light : theme.palette.primary.main,
                                backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
                                "&:hover": {
                                    backgroundColor: isSelected ? theme.palette.primary.dark : "rgba(0, 0, 0, 0.04)", // Hover effect
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
