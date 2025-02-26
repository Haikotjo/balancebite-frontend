import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MealDetails = ({ diet, mealType, cuisine, onFilter }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const handleClick = (category, value) => {
        if (value && value !== "No Diet" && value !== "No Type" && value !== "No Cuisine") {
            onFilter(category, value);
        }
    };

    const formatText = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: isDarkMode ? theme.palette.text.primary : theme.palette.text.light,
                overflow: "hidden",
            }}
        >
            {[
                { label: formatText(diet || "No Diet"), category: "diet" },
                { label: formatText(mealType || "No Type"), category: "mealType" },
                { label: formatText(cuisine || "No Cuisine"), category: "cuisine" },
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
                        paddingY: "10px",
                        paddingX: "2px",
                        transition: "background-color 0.2s ease-in-out",
                        cursor: item.category ? "pointer" : "default",
                        "&:hover": item.category ? { backgroundColor: theme.palette.primary.light } : {},
                        borderRight: index !== 2 ? `1px solid rgba(255, 255, 255, 0.3)` : "none",
                    }}
                    onClick={() => item.category && handleClick(item.category, item.label)}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: "'Quicksand', sans-serif",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontSize: "0.65rem",
                            fontWeight: "normal",
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
    onFilter: PropTypes.func.isRequired,
};

export default MealDetails;
