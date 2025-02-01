import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Flame, Dumbbell, Droplet, ChartColumnIncreasing } from "lucide-react";

const NutrientList = ({ nutrients }) => {
    const nutrientIcons = {
        "Energy kcal": <Flame size={16} style={{ marginRight: "5px" }} />,
        "Protein g": <Dumbbell size={16} style={{ marginRight: "5px" }} />,
        "Total lipid (fat) g": <Droplet size={16} style={{ marginRight: "5px" }} />,
        "Carbohydrates g": <ChartColumnIncreasing size={16} style={{ marginRight: "5px" }} />,
    };

    const filteredNutrients = nutrients.filter((nutrient) =>
        Object.keys(nutrientIcons).includes(nutrient.nutrientName)
    );

    return (
        <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredNutrients.map((nutrient) => (
                <Box
                    key={nutrient.nutrientId}
                    component="li"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                        },
                        marginBottom: "5px",
                        fontFamily: "'Quicksand', sans-serif",
                    }}
                >
                    {nutrientIcons[nutrient.nutrientName]}
                    {nutrient.nutrientName}: {nutrient.value ? nutrient.value.toFixed(1) : "N/A"} {nutrient.unitName}

                </Box>
            ))}
        </ul>
    );
};

NutrientList.propTypes = {
    nutrients: PropTypes.arrayOf(
        PropTypes.shape({
            nutrientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            nutrientName: PropTypes.string.isRequired,
            value: PropTypes.number,
            unitName: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default NutrientList;
