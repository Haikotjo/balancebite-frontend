import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    CircularProgress,
    useTheme,
} from "@mui/material";

const RecommendedNutritionDisplay = ({ useBaseRDI = false }) => {
    const theme = useTheme(); // ✅ Gebruik het thema voor dynamische kleuren
    const { recommendedNutrition, baseNutrition, loading, setRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    // ✅ Bepaal of we de dagelijkse RDI of BaseRDI tonen
    const nutritionData = useBaseRDI ? baseNutrition : recommendedNutrition;

    if (!nutritionData) {
        return <Typography variant="h6" align="center">
            {useBaseRDI ? "No Base RDI available" : "Update Body Metrics to get your recommended nutrition"}
        </Typography>;
    }

    const nutrientOrder = [
        "Energy kcal",
        "Protein",
        "Carbohydrates",
        "Total lipid (fat)",
        "Saturated and Trans fats",
        "Mono- and Polyunsaturated fats",
    ];

    const sortedNutrients = nutritionData.nutrients?.sort((a, b) => {
        return nutrientOrder.indexOf(a.name) - nutrientOrder.indexOf(b.name);
    });

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    {useBaseRDI ? "Standard" : "Today"}
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {sortedNutrients?.map((nutrient) => {
                                const isSubNutrient = [
                                    "Saturated and Trans fats",
                                    "Mono- and Polyunsaturated fats",
                                ].includes(nutrient.name);

                                // ✅ Alleen kleuren als het om "Today" gaat
                                const textColor =
                                    !useBaseRDI && nutrient.value < 0 ? theme.palette.error.main
                                        : !useBaseRDI ? theme.palette.success.main
                                            : "inherit"; // Standaardkleur als het BaseRDI is

                                return (
                                    <TableRow key={nutrient.id}>
                                        {/* ✅ Tekst + cijfer krijgen kleur alleen als het Today is */}
                                        <TableCell
                                            sx={{
                                                paddingLeft: isSubNutrient ? "20px" : "0",
                                                fontStyle: isSubNutrient ? "italic" : "normal",
                                                color: textColor, // ✅ Alleen kleuren als het Today is
                                            }}
                                        >
                                            {nutrient.name}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: textColor }}>
                                            {nutrient.value || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography
                    variant="caption"
                    align="right"
                    display="block"
                    sx={{
                        marginTop: "10px",
                        color: "gray",
                        fontStyle: "italic",
                    }}
                >
                    {nutritionData.createdAtFormatted || "N/A"}
                </Typography>

            </CardContent>
        </Card>
    );
};

RecommendedNutritionDisplay.propTypes = {
    useBaseRDI: PropTypes.bool,
};

export default RecommendedNutritionDisplay;
