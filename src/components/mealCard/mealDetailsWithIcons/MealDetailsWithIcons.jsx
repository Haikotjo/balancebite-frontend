import PropTypes from "prop-types";
import { Typography, Box, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";

const MealDetailsWithIcons = ({ meal }) => {
    const theme = useTheme();

    const macros = [
        { label: "Calories", value: meal.totalCalories, icon: <Flame size={16} color={theme.palette.primary.main} /> },
        { label: "Protein", value: meal.totalProtein, icon: <Dumbbell size={16} color={theme.palette.primary.main} /> },
        { label: "Carbs", value: meal.totalCarbs, icon: <ChartColumnIncreasing size={16} color={theme.palette.primary.main} /> },
        { label: "Fats", value: meal.totalFat, icon: <Droplet size={16} color={theme.palette.primary.main} /> },
    ];

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
            {macros.map((macro, index) => (
                <Box
                    key={macro.label}
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
                    {macro.icon}
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: "8px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                        }}
                    >
                        {macro.value ? Math.round(macro.value) : "N/A"}
                    </Typography>

                    {index !== macros.length - 1 && (
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                position: "absolute",
                                right: 0,
                                height: "60%",
                                borderColor: theme.palette.primary.main,
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
    meal: PropTypes.shape({
        totalCalories: PropTypes.number,
        totalProtein: PropTypes.number,
        totalCarbs: PropTypes.number,
        totalFat: PropTypes.number,
    }).isRequired,
};

export default MealDetailsWithIcons;
