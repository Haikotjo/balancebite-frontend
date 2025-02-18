import { Box, Typography } from "@mui/material";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

/**
 * NutrientSortOptions component: Displays nutrient icons with labels and click handlers.
 * Used for sorting meals based on selected nutrient.
 */
const NutrientSortOptions = ({ onSort }) => {
    const theme = useTheme();
    const nutrients = [
        { name: "Energy", label: "Kcal", icon: <Flame size={25} />, sortKey: "Energy kcal" },
        { name: "Protein", label: "Protein", icon: <Dumbbell size={25} />, sortKey: "Protein g" },
        { name: "Carbs", label: "Carbs", icon: <ChartColumnIncreasing size={25} />, sortKey: "Carbohydrates g" },
        { name: "Fat", label: "Fat", icon: <Droplet size={25} />, sortKey: "Total lipid (fat) g" },
    ];

    return (
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
                        cursor: "pointer",
                        paddingX: "25px",
                        paddingY: "10px",
                        borderBottom: index !== nutrients.length - 1 ? `1px solid rgba(255, 255, 255, 0.3)` : "none",
                        "&:hover": { backgroundColor: "primary.light" },
                    }}
                    onClick={() => onSort(nutrient.sortKey)}
                >
                    {nutrient.icon}
                    <Typography variant="body2" sx={{ marginTop: "6px", fontSize: "0.6rem" }}>
                        {nutrient.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

NutrientSortOptions.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default NutrientSortOptions;
