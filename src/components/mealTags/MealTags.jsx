import PropTypes from "prop-types";
import { Box, Chip, Button } from "@mui/material";
import { useState } from "react";
import { formatEnum } from "../../utils/helpers/formatEnum.js";

/**
 * MealTags component that displays cuisines, diets, and mealTypes tags.
 * If there are multiple tags in a category, only the first is shown with an option to expand.
 * Font size is controlled by the "size" prop. Tags are clickable for filtering.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array|string} props.cuisines - List of cuisines.
 * @param {Array|string} props.diets - List of diets.
 * @param {Array|string} props.mealTypes - List of meal types.
 * @param {string} props.size - Font size setting ("small" or "default").
 * @param {Function} props.onFilter - Function to handle filtering when a tag is clicked.
 * @returns {JSX.Element} A component rendering meal tags with expand functionality and filtering.
 */
const MealTags = ({ cuisines, diets, mealTypes, size = "default", onFilter, forceExpand = false, onExpandRequest  }) => {
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

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const allTags = [
        ...(Array.isArray(cuisines) ? cuisines : [cuisines]).filter(Boolean).map(value => ({ value, color: "primary", category: "cuisines" })),
        ...(Array.isArray(diets) ? diets : [diets]).filter(Boolean).map(value => ({ value, color: "secondary", category: "diets" })),
        ...(Array.isArray(mealTypes) ? mealTypes : [mealTypes]).filter(Boolean).map(value => ({ value, color: "success", category: "mealTypes" })),
    ];

    const shuffledTags = (expanded || forceExpand)
        ? shuffleArray(allTags)
        : shuffleArray([
            ...(Array.isArray(cuisines) ? cuisines : [cuisines]).filter(Boolean).slice(0, 1).map(value => ({ value, color: "primary", category: "cuisines" })),
            ...(Array.isArray(diets) ? diets : [diets]).filter(Boolean).slice(0, 1).map(value => ({ value, color: "secondary", category: "diets" })),
            ...(Array.isArray(mealTypes) ? mealTypes : [mealTypes]).filter(Boolean).slice(0, 1).map(value => ({ value, color: "success", category: "mealTypes" })),
        ]);


    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: forceExpand ? "center" : "flex-start",
                gap: 1,
                mb: size === "small" ? 0 : 2,
            }}
        >
            {shuffledTags.map((tag, index) => (
                <Chip
                    key={index}
                    label={formatEnum(tag.value)}
                    color={tag.color}
                    variant="outlined"
                    onClick={() => handleFilterClick(tag.category, tag.value)}
                    sx={{
                        fontSize: sizeStyles[size].fontSize,
                        padding: sizeStyles[size].padding,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: `${tag.color}.light` },
                        boxShadow: 3,
                    }}
                />
            ))}

            {!forceExpand && allTags.length > 3 && (
                <Button
                    size="small"
                    onClick={() => {
                        if (size === "small" && onExpandRequest) {
                            onExpandRequest();
                        } else {
                            setExpanded(prev => !prev);
                        }
                    }}
                    sx={{
                        textTransform: "none",
                        fontSize: sizeStyles[size].fontSize,
                        padding: "2px 6px",
                        minWidth: "auto",
                    }}
                >
                    {expanded ? "- less" : `+${allTags.length - shuffledTags.length} more`}
                </Button>
            )}
        </Box>
    );
};

// PropTypes validation
MealTags.propTypes = {
    cuisines: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    diets: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    mealTypes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    size: PropTypes.oneOf(["small", "default"]),
    forceExpand: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    onExpandRequest: PropTypes.func,
};

export default MealTags;
