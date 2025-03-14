import PropTypes from "prop-types";
import { Box, Chip, Button } from "@mui/material";
import { useState } from "react";
import { formatEnum } from "../filterSidebar/helper/formatEnum.js";

/**
 * MealTags component that displays cuisine, diet, and mealType tags.
 * If there are multiple tags in a category, only the first is shown with an option to expand.
 * Font size is controlled by the "size" prop. Tags are clickable for filtering.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array|string} props.cuisine - List of cuisines.
 * @param {Array|string} props.diet - List of diets.
 * @param {Array|string} props.mealType - List of meal types.
 * @param {string} props.size - Font size setting ("small" or "default").
 * @param {Function} props.onFilter - Function to handle filtering when a tag is clicked.
 * @returns {JSX.Element} A component rendering meal tags with expand functionality and filtering.
 */
const MealTags = ({ cuisine, diet, mealType, size = "default", onFilter }) => {
    const [expanded, setExpanded] = useState(false);

    // Size mapping for font and padding
    const sizeStyles = {
        small: { fontSize: "0.65rem", padding: "3px 5px" },
        default: { fontSize: "0.85rem", padding: "6px 10px" },
    };

    // Function to handle filtering when a tag is clicked
    const handleFilterClick = (category, value) => {
        if (onFilter && value) {
            onFilter(category, value);
        }
    };

    // Function to format and display tags with filtering
    const renderTags = (items, color, category) => {
        if (!items || (Array.isArray(items) && items.length === 0)) return null;

        const itemsArray = Array.isArray(items) ? items : [items];
        const visibleTags = expanded ? itemsArray : [itemsArray[0]];
        const hasMore = itemsArray.length > 1 && !expanded;

        return (
            <>
                {visibleTags.map((item, index) => (
                    <Chip
                        key={index}
                        label={formatEnum(item)}
                        color={color}
                        variant="outlined"
                        onClick={() => handleFilterClick(category, item)}
                        sx={{
                            fontSize: sizeStyles[size].fontSize,
                            padding: sizeStyles[size].padding,
                            cursor: "pointer", // Maak klikbaar
                            transition: "background-color 0.2s",
                            "&:hover": { backgroundColor: `${color}.light` }, // Visuele feedback bij hover
                        }}
                    />
                ))}
                {hasMore && (
                    <Button
                        size="small"
                        onClick={() => setExpanded(true)}
                        sx={{
                            textTransform: "none",
                            fontSize: sizeStyles[size].fontSize,
                            padding: "2px 6px",
                            minWidth: "auto",
                        }}
                    >
                        +{itemsArray.length - 1} more
                    </Button>
                )}
            </>
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
            }}
        >
            {renderTags(cuisine, "primary", "cuisine")}
            {renderTags(diet, "secondary", "diet")}
            {renderTags(mealType, "success", "mealType")}
        </Box>
    );
};

// PropTypes validation
MealTags.propTypes = {
    cuisine: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    diet: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    mealType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    size: PropTypes.oneOf(["small", "default"]), // "small" voor MealCard, "default" voor MealCardLarge
    onFilter: PropTypes.func.isRequired, // Verplicht, zodat filtering werkt
};

export default MealTags;
