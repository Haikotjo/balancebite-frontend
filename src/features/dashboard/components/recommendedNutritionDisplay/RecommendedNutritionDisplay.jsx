import { useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Contexts
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

// Layout Components
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";

// Feature Components
import NutritionTable from "./NutritionTable.jsx";

// Helpers & Calculations
import { getSortedNutritionData } from "../../utils/helpers/nutritionHelpers.js";
import {
    calculateNutritionProgress,
    getNutritionSourceConfig,
    mergeNutritionProgress
} from "../../utils/helpers/nutritionCalculations.js";

const titleMap = {
    today: "Today's remaining nutrients",
    base: "Base Nutrition",
    date: "Day overview",
    week: "This week's remaining nutrients",
    weekAverage: "Daily average this week",
    month: "This month's remaining nutrients",
    monthAverage: "Daily average this month",
};

const RecommendedNutritionDisplay = ({
                                         variant = "today",
                                         data = null,
                                         newCustomTitle = null,
                                         chartData,
                                         baseChartData
                                     }) => {
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
        return <Spinner className="mx-auto my-4" />;
    }

    let nutritionCalculations = null;
    if (variant === "today" || variant === "date") {
        nutritionCalculations = calculateNutritionProgress(chartData, baseChartData);
    }

    const { useBaseRDI, source } = getNutritionSourceConfig(variant, recommendedNutrition, data);

    const { sortedNutrients, message, createdAt } =
        getSortedNutritionData(useBaseRDI, baseNutrition, source);

    if (!sortedNutrients) {
        return <CustomTypography variant="h5" className="text-center mt-4">{message}</CustomTypography>;
    }

    const nutrientsWithProgress = mergeNutritionProgress(sortedNutrients, nutritionCalculations);

    const title = titleMap[variant] ?? (useBaseRDI ? "Recommended" : "Today");
    const customTitle =
        variant === "date" && createdAt
            ? createdAt
            : (newCustomTitle ?? title);

    return (
        <CustomBox className="flex flex-col gap-2">

            <CustomBox className="w-full px-4 py-2 bg-darkBackground dark:bg-lightBackground rounded-md mb-4">
                <CustomTypography
                    variant="paragraph"
                    className="text-center text-white dark:text-lightText"
                    inheritColor
                    weight="bold"
                >
                    {customTitle}
                </CustomTypography>
            </CustomBox>

            <NutritionTable
                sortedNutrients={nutrientsWithProgress.filter(
                    (n) =>
                        n.name !== "Saturated and Trans fats" &&
                        n.name !== "Mono- and Polyunsaturated fats"
                )}
                useBaseRDI={useBaseRDI}
            />

        </CustomBox>
    );
};

RecommendedNutritionDisplay.propTypes = {
    variant: PropTypes.oneOf([
        "today",
        "base",
        "date",
        "week",
        "month",
        "weekAverage",
        "monthAverage",
    ]),
    data: PropTypes.object,
    newCustomTitle: PropTypes.string,
    chartData: PropTypes.array,
    baseChartData: PropTypes.array,
};

export default RecommendedNutritionDisplay;
