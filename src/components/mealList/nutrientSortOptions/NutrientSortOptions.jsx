import { useState } from "react";
import { Box, Typography } from "@mui/material";
import {
    Flame,
    ChartColumnIncreasing,
    Dumbbell,
    Droplet,
    ArrowDownUp,
    ArrowUpNarrowWide,
    ArrowDownNarrowWide,
} from "lucide-react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

/**
 * NutrientSortOptions component: Displays nutrient icons with labels and click handlers.
 * Used for sorting meals based on selected nutrient.
 */
const NutrientSortOptions = ({ onSort }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [currentSort, setCurrentSort] = useState({ key: null, order: "asc" });

    const getSortIcon = () => {
        if (!expanded) return <ArrowDownUp size={25} />;
        if (currentSort.key) {
            return currentSort.order === "asc"
                ? <ArrowUpNarrowWide size={25} />
                : <ArrowDownNarrowWide size={25} />;
        }
        return <ArrowDownUp size={25} />;
    };

    const nutrients = [
        { name: "Sort", label: "", icon: getSortIcon(), sortKey: null, isSpecial: true },
        { name: "Energy", label: "Kcal", icon: <Flame size={25} />, sortKey: "calories" },
        { name: "Protein", label: "Protein", icon: <Dumbbell size={25} />, sortKey: "protein" },
        { name: "Carbs", label: "Carbs", icon: <ChartColumnIncreasing size={25} />, sortKey: "carbs" },
        { name: "Fat", label: "Fat", icon: <Droplet size={25} />, sortKey: "fat" },
    ];

    const handleSort = (sortKey) => {
        let newOrder = "asc";

        // Special case: Protein should default to "desc" on first click
        if (sortKey === "protein" && currentSort.key !== "protein") {
            newOrder = "desc";
        }

        // Toggle between "asc" and "desc" if the same key is clicked
        if (currentSort.key === sortKey) {
            newOrder = currentSort.order === "asc" ? "desc" : "asc";
        }

        // Update the state with the new sorting order
        setCurrentSort({ key: sortKey, order: newOrder });

        // Send sorting info to parent component
        onSort(sortKey, newOrder);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 100,
                right: 20,
                padding: 0,
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1000,
                backgroundColor: theme.palette.primary.dark,
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-around"
                alignItems="center"
                sx={{
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.text.light,
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
            >
                {nutrients.map((nutrient, index) => (
                    <Box
                        key={nutrient.name}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            cursor: nutrient.sortKey ? "pointer" : "default",
                            paddingX: nutrient.isSpecial ? "0px" : "25px",
                            paddingY: nutrient.isSpecial ? "5px" : "10px",
                            width: nutrient.isSpecial ? "35px" : "25px",
                            color: "inherit",
                            borderBottom:
                                !nutrient.isSpecial && index !== nutrients.length - 1
                                    ? `1px solid rgba(255, 255, 255, 0.3)`
                                    : "none",
                            backgroundColor: nutrient.sortKey ? "inherit" : "transparent",
                            "&:hover": nutrient.sortKey ? { backgroundColor: theme.palette.primary.light } : {},
                            display: nutrient.isSpecial || expanded ? "flex" : "none",
                        }}
                        onClick={() => {
                            if (nutrient.isSpecial) {
                                setExpanded(!expanded);
                            } else {
                                handleSort(nutrient.sortKey);
                            }
                        }}
                    >
                        {nutrient.icon}
                        <Typography variant="body2" sx={{ marginTop: "6px", fontSize: "0.6rem", textAlign: "center" }}>
                            {nutrient.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

NutrientSortOptions.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default NutrientSortOptions;
