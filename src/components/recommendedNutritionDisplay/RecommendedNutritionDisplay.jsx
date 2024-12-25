import React, { useContext, useEffect } from "react";
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

    // Controleer of de context overeenkomt met de juiste gebruiker
    useEffect(() => {
        if (!token) {
            // Reset de context als er geen token is
            setRecommendedNutrition(null);
        }
    }, [token, setRecommendedNutrition]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!recommendedNutrition) {
        return <Typography variant="h6" align="center">Update Body Metrics to get your recommended nutrition</Typography>;
    }

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Recommended Nutrition
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {/* Toon de lijst van nutrients in een sub-tabel */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    NUTRIENTS
                                </TableCell>
                                <TableCell>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                {recommendedNutrition.nutrients && (
                                                    <>
                                                        {/* Energy kcal */}
                                                        {recommendedNutrition.nutrients
                                                            .filter((nutrient) => nutrient.name === "Energy kcal")
                                                            .map((nutrient) => (
                                                                <TableRow key={nutrient.id}>
                                                                    <TableCell>{nutrient.name}</TableCell>
                                                                    <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {/* Protein */}
                                                        {recommendedNutrition.nutrients
                                                            .filter((nutrient) => nutrient.name === "Protein")
                                                            .map((nutrient) => (
                                                                <TableRow key={nutrient.id}>
                                                                    <TableCell>{nutrient.name}</TableCell>
                                                                    <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {/* Carbohydrates */}
                                                        {recommendedNutrition.nutrients
                                                            .filter((nutrient) => nutrient.name === "Carbohydrates")
                                                            .map((nutrient) => (
                                                                <TableRow key={nutrient.id}>
                                                                    <TableCell>{nutrient.name}</TableCell>
                                                                    <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {/* Total lipid (fat) */}
                                                        {recommendedNutrition.nutrients
                                                            .filter((nutrient) => nutrient.name === "Total lipid (fat)")
                                                            .map((nutrient) => (
                                                                <TableRow key={nutrient.id}>
                                                                    <TableCell>{nutrient.name}</TableCell>
                                                                    <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                                                </TableRow>
                                                            ))}

                                                        {/* Sub-list: Saturated and Trans fats, Mono- and Polyunsaturated fats */}
                                                        {recommendedNutrition.nutrients
                                                            .filter((nutrient) =>
                                                                ["Saturated and Trans fats", "Mono- and Polyunsaturated fats"].includes(nutrient.name)
                                                            )
                                                            .map((nutrient) => (
                                                                <TableRow key={nutrient.id} sx={{ paddingLeft: "20px" }}>
                                                                    <TableCell sx={{ paddingLeft: "20px" }}>{nutrient.name}</TableCell>
                                                                    <TableCell align="right">{nutrient.value || "N/A"}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                    </>
                                                )}

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TableCell>
                            </TableRow>

                            {/* Toon de geformatteerde datum */}
                            <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                                    CREATED AT
                                </TableCell>
                                <TableCell align="right">
                                    {recommendedNutrition.createdAtFormatted || "N/A"}
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default RecommendedNutritionDisplay;
