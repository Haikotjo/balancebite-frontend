import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MealDetails = ({ diet, mealType, cuisine, nutrients }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const kcal = nutrients?.find(nutrient => nutrient.nutrientName === "Energy kcal")?.value || "N/A";

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: isDarkMode ? theme.palette.text.primary : theme.palette.text.light,
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >
            {[
                { label: diet || "No Diet" },
                { label: mealType || "No Type" },
                { label: cuisine || "No Cuisine" },
                { label: kcal !== "N/A" ? `${kcal.toFixed(1)} kcal` : "N/A", bold: true },
            ].map((item, index) => (
                <Box
                    key={index}
                    flexGrow={1}
                    flexBasis={0}
                    textAlign="center"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingY: "10px", // ✅ Padding per item
                        paddingX: "2px",
                        transition: "background-color 0.2s ease-in-out",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.light, // ✅ Background verandert over het volledige item
                        },
                        borderRight: index !== 3 ? `1px solid rgba(255, 255, 255, 0.3)` : "none",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontSize: "0.65rem",
                            fontWeight: item.bold ? "bold" : "normal",
                        }}
                    >
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

MealDetails.propTypes = {
    diet: PropTypes.string,
    mealType: PropTypes.string,
    cuisine: PropTypes.string,
    nutrients: PropTypes.arrayOf(
        PropTypes.shape({
            nutrientName: PropTypes.string.isRequired,
            value: PropTypes.number,
        })
    ),
};

export default MealDetails;
