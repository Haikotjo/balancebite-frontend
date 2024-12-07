import PropTypes from "prop-types";
import { Box } from "@mui/material";

const NutrientList = ({ nutrients }) => {
    const filteredNutrients = nutrients.filter((nutrient) =>
        ["Energy kcal", "Total lipid (fat) g", "Carbohydrates g", "Protein g"].includes(nutrient.nutrientName)
    );

    return (
        <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredNutrients.map((nutrient) => (
                <Box
                    key={nutrient.nutrientId}
                    component="li"
                    sx={{
                        fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                        },
                        fontFamily: "'Quicksand', sans-serif",
                    }}
                >
                    {nutrient.nutrientName}: {nutrient.value ? nutrient.value.toFixed(1) : "N/A"} {nutrient.unitName}
                </Box>
            ))}
        </ul>
    );
};

NutrientList.propTypes = {
    nutrients: PropTypes.arrayOf(
        PropTypes.shape({
            nutrientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Accepteer zowel string als number
            nutrientName: PropTypes.string.isRequired,
            value: PropTypes.number,
            unitName: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default NutrientList;
