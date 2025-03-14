import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";

const MealDetailsWithIcons = ({ nutrients }) => {
    const theme = useTheme();

    const nutrientIcons = {
        "Energy kcal": <Flame size={16} />,
        "Protein g": <Dumbbell size={16} />,
        "Carbohydrates g": <ChartColumnIncreasing size={16} />,
        "Total lipid (fat) g": <Droplet size={16} />,
    };

    const nutrientOrder = ["Energy kcal", "Protein g", "Carbohydrates g", "Total lipid (fat) g"];

    const filteredNutrients = nutrients
        .filter(nutrient => Object.keys(nutrientIcons).includes(nutrient.nutrientName))
        .sort((a, b) => nutrientOrder.indexOf(a.nutrientName) - nutrientOrder.indexOf(b.nutrientName));

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.light,
                overflow: "hidden",
            }}
        >
            {filteredNutrients.map((nutrient, index) => (
                <Box
                    key={nutrient.nutrientName}
                    flexGrow={1}
                    flexBasis={0}
                    textAlign="center"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingY: "8px",
                        paddingX: "2px",
                        borderRight: index !== filteredNutrients.length - 1 ? `1px solid rgba(255, 255, 255, 0.3)` : "none",
                    }}
                >
                    {nutrientIcons[nutrient.nutrientName]}
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: "8px",
                            fontSize: "0.6rem",
                        }}
                    >
                        {nutrient.value ? nutrient.value.toFixed(0) : "N/A"}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

MealDetailsWithIcons.propTypes = {
    nutrients: PropTypes.arrayOf(
        PropTypes.shape({
            nutrientName: PropTypes.string.isRequired,
            value: PropTypes.number,
        })
    ).isRequired,
};

export default MealDetailsWithIcons;
