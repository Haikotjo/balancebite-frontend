import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { getSortedNutritionData } from "../../utils/nutritionHelpers.js";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import NutritionTable from "./NutritionTable.jsx";

const RecommendedNutritionDisplay = ({ useBaseRDI = false }) => {
    const { recommendedNutrition, baseNutrition, loading, setRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token]);

    if (loading) {
        return <Spinner className="mx-auto my-4" />;
    }

    const { sortedNutrients, message, createdAt } = getSortedNutritionData(useBaseRDI, baseNutrition, recommendedNutrition);

    if (!sortedNutrients) {
        return (
            <CustomTypography variant="h5" className="text-center mt-4">
                {message}
            </CustomTypography>
        );
    }

    return (
        <CustomCard className="max-w-xl mx-auto p-6">
            <CustomBox className="flex flex-col gap-4">
                <CustomTypography variant="h2" className="text-center">
                    {useBaseRDI ? "Recommended" : "Today"}
                </CustomTypography>

                <NutritionTable
                    sortedNutrients={sortedNutrients.filter(n =>
                        n.name !== "Saturated and Trans fats" &&
                        n.name !== "Mono- and Polyunsaturated fats"
                    )}
                    useBaseRDI={useBaseRDI}
                />

                <CustomTypography variant="xsmallCard" className="text-right text-friendlyGray mt-2">
                    {createdAt}
                </CustomTypography>
            </CustomBox>
        </CustomCard>
    );
};

RecommendedNutritionDisplay.propTypes = {
    useBaseRDI: PropTypes.bool,
};

export default RecommendedNutritionDisplay;
