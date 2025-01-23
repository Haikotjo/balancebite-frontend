import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getSortedNutritionData } from "./nutritionHelpers.js";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from "@mui/material";
import NutritionDate from "./nutritionDate/NutritionDate.jsx";
import NutritionTable from "./nutritionTable/NutritionTable.jsx";


const RecommendedNutritionDisplay = ({ useBaseRDI = false }) => {
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

    const { sortedNutrients, message, createdAt } = getSortedNutritionData(useBaseRDI, baseNutrition, recommendedNutrition);

    if (!sortedNutrients) {
        return <Typography variant="h6" align="center">{message}</Typography>;
    }

    return (
        <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    {useBaseRDI ? "Recommended" : "Today"}
                </Typography>

                <NutritionTable sortedNutrients={sortedNutrients} useBaseRDI={useBaseRDI} />

                <NutritionDate createdAt={createdAt} />
            </CardContent>
        </Card>
    );
};

RecommendedNutritionDisplay.propTypes = {
    useBaseRDI: PropTypes.bool,
};

export default RecommendedNutritionDisplay;
