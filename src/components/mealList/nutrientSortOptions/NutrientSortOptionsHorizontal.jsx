import { useState } from "react";
import { Box, Stack, Tooltip, useMediaQuery } from "@mui/material";
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
import CustomChip from "./customChip/CustomChip.jsx";

const NutrientSortOptionsHorizontal = ({ onSort }) => {
    const isLargeScreen = useMediaQuery("(min-width: 600px)");
    const iconSize = isLargeScreen ? 25 : 20;
    const iconMargin = isLargeScreen ? 25 : 10;
    const labelFontSize = isLargeScreen ? "0.7rem" : "0.6rem";

    const [currentSort, setCurrentSort] = useState({ key: null, order: "asc" });

    const getSortIcon = (key) => {
        if (!key) return <ArrowDownUp size={iconSize} />;
        return currentSort.order === "asc" ? <ArrowUpNarrowWide size={iconSize} /> : <ArrowDownNarrowWide size={iconSize} />;
    };

    const getSortTooltip = () => {
        if (!currentSort.key) return "Sort Order";
        return currentSort.order === "asc" ? "Sort: Low → High" : "Sort: High → Low";
    };

    const nutrients = [
        { name: "Energy", label: "Kcal", icon: <Flame size={iconSize} />, sortKey: "calories" },
        { name: "Protein", label: "Protein", icon: <Dumbbell size={iconSize} />, sortKey: "protein" },
        { name: "Carbs", label: "Carbs", icon: <ChartColumnIncreasing size={iconSize} />, sortKey: "carbs" },
        { name: "Fat", label: "Fat", icon: <Droplet size={iconSize} />, sortKey: "fat" },
    ];

    const handleSort = (sortKey) => {
        let newOrder = "asc";

        // Special case: Protein should default to "desc" on first click
        if (sortKey === "protein" && currentSort.key !== "protein") {
            newOrder = "desc";
        }

        // Toggle tussen "asc" en "desc"
        if (currentSort.key === sortKey) {
            newOrder = currentSort.order === "asc" ? "desc" : "asc";
        }

        setCurrentSort({ key: sortKey, order: newOrder });
        onSort(sortKey, newOrder);
    };

    const handleSortOrderClick = () => {
        if (!currentSort.key) return;

        setCurrentSort((prevSort) => ({
            key: prevSort.key,
            order: prevSort.order === "asc" ? "desc" : "asc",
        }));

        onSort(currentSort.key, currentSort.order === "asc" ? "desc" : "asc");
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 2 }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: "100%",
                }}
            >
                {nutrients.map((nutrient) => (
                    <Tooltip key={nutrient.sortKey} title={nutrient.label} arrow>
                        <CustomChip
                            icon={nutrient.icon}
                            label={nutrient.label}
                            selected={currentSort.key === nutrient.sortKey}
                            onClick={() => handleSort(nutrient.sortKey)}
                            iconMargin={iconMargin}
                            iconSize={iconSize}
                            labelFontSize={labelFontSize}
                            labelPosition="bottom"
                        />
                    </Tooltip>
                ))}

                <Tooltip title={getSortTooltip()} arrow>
                    <CustomChip
                        icon={getSortIcon(currentSort.key)}
                        label={!currentSort.key ? "Direction" : currentSort.order === "asc" ? "Low > High" : "High > Low"}
                        selected={!!currentSort.key}
                        onClick={handleSortOrderClick}
                        iconMargin={iconMargin}
                        labelFontSize={labelFontSize}
                        iconSize={iconSize}
                    />
                </Tooltip>
            </Stack>
        </Box>

    );
};

NutrientSortOptionsHorizontal.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default NutrientSortOptionsHorizontal;
