import PropTypes from "prop-types";
import { Typography, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";

const MealDetailsWithIcons = ({ nutrients }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark"; // Check of dark mode aanstaat

    // Mapping nutrients to icons and colors
    const nutrientConfig = {
        "Energy kcal": { icon: <Flame size={16} color={theme.palette.primary.main}/> },
        "Protein g": { icon: <Dumbbell size={16} color={theme.palette.primary.main} /> },
        "Carbohydrates g": { icon: <ChartColumnIncreasing size={16} color={theme.palette.primary.main}/> },
        "Total lipid (fat) g": { icon: <Droplet size={16} color={theme.palette.primary.main} /> },
    };

    const nutrientOrder = ["Energy kcal", "Protein g", "Carbohydrates g", "Total lipid (fat) g"];

    const filteredNutrients = nutrients
        .filter(nutrient => Object.keys(nutrientConfig).includes(nutrient.nutrientName))
        .sort((a, b) => nutrientOrder.indexOf(a.nutrientName) - nutrientOrder.indexOf(b.nutrientName));

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                overflow: "visible",
                position: "relative",
                zIndex: 2,
                boxShadow: "0px 3px 7px rgba(0, 0, 0, 0.3)",
                borderRadius: "0 0 5px 5px",
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
                        paddingX: "6px",
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        position: "relative",
                    }}
                >
                    {nutrientConfig[nutrient.nutrientName].icon}
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: "8px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                        }}
                    >
                        {nutrient.value ? nutrient.value.toFixed(0) : "N/A"}
                    </Typography>

                    {/* Divider - Alleen als het NIET het laatste item is */}
                    {index !== filteredNutrients.length - 1 && (
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                position: "absolute",
                                right: 0,
                                height: "60%",
                                borderColor: theme.palette.primary.main, // Dit werkt voor de kleur
                                borderStyle: "solid",
                            }}
                        />

                    )}

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
