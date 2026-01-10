import { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

// Contexts
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

// Layout & UI Components
import CustomBox from "../layout/CustomBox.jsx";
import CustomCard from "../layout/CustomCard.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import Spinner from "../layout/Spinner.jsx";

// Dashboard Components
import NutritionPieChart from "../../features/dashboard/components/nutritionPieChart/NutritionPieChart.jsx";
import NutritionTable from "../../features/dashboard/components/recommendedNutritionDisplay/NutritionTable.jsx";

// Helpers
import { buildChartData, getSortedNutritionData } from "../../features/dashboard/utils/helpers/nutritionHelpers.js";
import { calculateNutritionProgress, mergeNutritionProgress } from "../../features/dashboard/utils/helpers/nutritionCalculations.js";

const NutritionPieOverview = ({ useBaseRDI = false, onClose }) => {
    const {
        recommendedNutrition,
        baseNutrition,
        loading,
        setRecommendedNutrition,
    } = useContext(RecommendedNutritionContext);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token, setRecommendedNutrition]);

    if (loading) {
        return (
            <CustomBox className="flex flex-col items-center justify-center p-12 min-h-[300px]">
                <Spinner />
                <CustomTypography variant="small" className="mt-4 text-gray-500 italic">
                    Updating your nutrition data...
                </CustomTypography>
            </CustomBox>
        );
    }

    // 1. Prepare base chart data
    const chartData = buildChartData(recommendedNutrition);
    const baseChartData = buildChartData(baseNutrition);

    // 2. Calculate progress percentages (This enables the progress bars)
    const nutritionCalculations = !useBaseRDI
        ? calculateNutritionProgress(chartData, baseChartData)
        : null;

    // 3. Fetch the sorted nutrient list
    const { sortedNutrients, message, createdAt } = getSortedNutritionData(
        useBaseRDI,
        baseNutrition,
        recommendedNutrition
    );

    // 4. Merge the calculated progress into the nutrient list
    const nutrientsWithProgress = mergeNutritionProgress(sortedNutrients, nutritionCalculations);

    if (loading) return <Spinner className="mx-auto my-4" />;

    if (!sortedNutrients) {
        return (
            <CustomTypography variant="h5" className="text-center mt-4">
                {message}
            </CustomTypography>
        );
    }

    return (
        <CustomCard className="max-w-3xl mx-auto p-4 md:p-6">
            <CustomBox className="flex flex-col gap-4">
                <CustomBox className="grid grid-cols-3 items-center">
                    <CustomBox></CustomBox>
                    <CustomTypography variant="h2" className="text-center">
                        {useBaseRDI ? "Recommended" : "Remaining Nutrients"}
                    </CustomTypography>
                    {onClose ? (
                        <CustomButton
                            variant="outline"
                            color="error"
                            onClick={onClose}
                            className="justify-self-end p-1 rounded-full w-7 h-7 flex items-center justify-center"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </CustomButton>
                    ) : (
                        <div></div>
                    )}
                </CustomBox>

                <CustomBox className="flex flex-col gap-2">
                    <NutritionPieChart chartData={chartData} baseChartData={baseChartData}/>

                    <NutritionTable
                        sortedNutrients={nutrientsWithProgress.filter(
                            (n) =>
                                n.name !== "Saturated and Trans fats" &&
                                n.name !== "Mono- and Polyunsaturated fats"
                        )}
                        useBaseRDI={useBaseRDI}
                    />
                </CustomBox>

                <CustomTypography variant="xsmallCard" className="text-right text-friendlyGray mt-2">
                    {createdAt}
                </CustomTypography>
            </CustomBox>
        </CustomCard>
    );
};

NutritionPieOverview.propTypes = {
    useBaseRDI: PropTypes.bool,
    onClose: PropTypes.func,
};

export default NutritionPieOverview;