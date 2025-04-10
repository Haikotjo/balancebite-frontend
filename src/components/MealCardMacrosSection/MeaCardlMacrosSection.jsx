import PropTypes from "prop-types";
import { Box, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";

const MealCardMacrosSection = ({ macros }) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Grid container spacing={2} marginTop={2} marginBottom={3}>
            {Object.entries(macros).map(([key, macro]) => (
                <Grid item xs={12} sm={6} key={key}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                        <Box sx={{ marginTop: "2px" }}>
                            {key === "Calories" && <Flame size={20} color={theme.palette.error.main} />}
                            {key === "Protein" && <Dumbbell size={20} color={theme.palette.primary.main} />}
                            {key === "Carbs" && <ChartColumnIncreasing size={20} color={theme.palette.success.light} />}
                            {key === "Fats" && <Droplet size={20} color={theme.palette.secondary.main} />}
                        </Box>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                            >
                                {key === "Calories"
                                    ? `${key}: ${macro.total}`
                                    : `${key}: ${macro.total} ${macro.unit}`}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "0.75rem", md: "0.95rem" } }}
                            >
                                ({macro.per100g} per 100g)
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

MealCardMacrosSection.propTypes = {
    macros: PropTypes.object.isRequired,
};

export default MealCardMacrosSection;
