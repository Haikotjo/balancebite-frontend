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
} from "@mui/material";

const RecommendedNutritionDisplay = () => {
    const { recommendedNutrition, loading, setRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token, setRecommendedNutrition]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!recommendedNutrition) {
        return <Typography variant="h6" align="center">Update Body Metrics to get your recommended nutrition</Typography>;
    }

    const nutrientOrder = [
        "Energy kcal",
        "Protein",
        "Carbohydrates",
        "Total lipid (fat)",
        "Saturated and Trans fats",
        "Mono- and Polyunsaturated fats",
    ];

    const sortedNutrients = recommendedNutrition.nutrients?.sort((a, b) => {
        return nutrientOrder.indexOf(a.name) - nutrientOrder.indexOf(b.name);
    });

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Recommended Nutrition
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {sortedNutrients?.map((nutrient) => {
                                const isSubNutrient = [
                                    "Saturated and Trans fats",
                                    "Mono- and Polyunsaturated fats",
                                ].includes(nutrient.name);

                                return (
                                    <TableRow key={nutrient.id}>
                                        <TableCell
                                            sx={{
                                                paddingLeft: isSubNutrient ? "20px" : "0",
                                                fontStyle: isSubNutrient ? "italic" : "normal",
                                            }}
                                        >
                                            {nutrient.name}
                                        </TableCell>
                                        <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> {/* Correct gesloten tag voor TableContainer */}

                {/* Datum als subtiele tekst onder de tabel */}
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
                    {recommendedNutrition.createdAtFormatted || "N/A"}
                </Typography>

            </CardContent>
        </Card>
    );
};

export default RecommendedNutritionDisplay;
