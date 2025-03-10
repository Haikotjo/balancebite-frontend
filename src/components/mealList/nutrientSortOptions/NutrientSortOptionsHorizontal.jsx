import { useState } from "react";
import { Box, Stack, Tooltip } from "@mui/material";
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
import CustomChip from "./customChip/CustomChip.jsx";

const NutrientSortOptionsHorizontal = ({ onSort }) => {
    const theme = useTheme();
    const [currentSort, setCurrentSort] = useState({ key: null, order: "asc" });

    // Bepaalt welk sorteericoon wordt gebruikt
    const getSortIcon = (key) => {
        if (currentSort.key !== key) return <ArrowDownUp size={22} />;
        return currentSort.order === "asc" ? <ArrowUpNarrowWide size={22} /> : <ArrowDownNarrowWide size={22} />;
    };

    // Tooltip text voor de sorteervolgorde
    const getSortTooltip = () => {
        if (!currentSort.key) return "Sort Order";
        return currentSort.order === "asc" ? "Sort: Low → High" : "Sort: High → Low";
    };

    const nutrients = [
        { name: "Energy", label: "Kcal", icon: <Flame size={22} />, sortKey: "calories" },
        { name: "Protein", label: "Protein", icon: <Dumbbell size={22} />, sortKey: "protein" },
        { name: "Carbs", label: "Carbs", icon: <ChartColumnIncreasing size={22} />, sortKey: "carbs" },
        { name: "Fat", label: "Fat", icon: <Droplet size={22} />, sortKey: "fat" },
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
        if (!currentSort.key) return; // Geen actie als er nog geen sorteeroptie is gekozen

        setCurrentSort((prevSort) => ({
            key: prevSort.key,
            order: prevSort.order === "asc" ? "desc" : "asc",
        }));

        onSort(currentSort.key, currentSort.order === "asc" ? "desc" : "asc");
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 2 }}>
            <Stack direction="row" spacing={1}>
                {nutrients.map((nutrient) => (
                    <Tooltip key={nutrient.sortKey} title={nutrient.label} arrow>
                        <span>
                            <CustomChip
                                icon={nutrient.icon}
                                selected={currentSort.key === nutrient.sortKey}
                                onClick={() => handleSort(nutrient.sortKey)}
                                iconMargin={10}
                            />
                        </span>
                    </Tooltip>
                ))}
                {/* Sorteer icoon altijd rechts met juiste tooltip */}
                <Tooltip title={getSortTooltip()} arrow>
                    <span>
                        <CustomChip
                            icon={getSortIcon(currentSort.key)}
                            onClick={handleSortOrderClick} // 🔥 Nieuw: Omkeert sortering bij klik!
                            selected={!!currentSort.key}
                            iconMargin={10}
                        />
                    </span>
                </Tooltip>
            </Stack>
        </Box>
    );
};

NutrientSortOptionsHorizontal.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default NutrientSortOptionsHorizontal;
