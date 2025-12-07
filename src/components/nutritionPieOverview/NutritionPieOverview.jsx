import PropTypes from "prop-types";
import { useContext, useEffect, useMemo } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import Spinner from "../layout/Spinner.jsx";
import { getSortedNutritionData } from "../../features/profile/utils/nutritionHelpers.js";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomCard from "../layout/CustomCard.jsx";
import NutritionPieChart from "../../features/profile/components/nutritionPieChart/NutritionPieChart.jsx";
import NutritionTable from "../../features/profile/components/recommendedNutritionDisplay/NutritionTable.jsx";

/**
 * NutritionPieOverview
 *
 * Responsible for showing a combined overview of:
 * - A pie chart with macro nutrients (Protein, Carbohydrates, Fat)
 * - A detailed nutrition table
 *
 * Data is read from RecommendedNutritionContext and normalized with
 * `getSortedNutritionData`. When the user logs out, the recommended
 * nutrition data is cleared.
 *
 * @param {Object} props
 * @param {boolean} [props.useBaseRDI=false] - When true, use base RDI values instead of today's intake.
 * @returns {JSX.Element}
 */
const NutritionPieOverview = ({ useBaseRDI = false }) => {
    const {
        recommendedNutrition,
        baseNutrition,
        loading,
        setRecommendedNutrition,
    } = useContext(RecommendedNutritionContext);

    const { token } = useContext(AuthContext);

    /**
     * When the user is no longer authenticated, clear any user-specific
     * recommended nutrition data to avoid showing stale values.
     */
    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token, setRecommendedNutrition]);

    /**
     * Normalize the raw nutrition data into a shape that the UI can work with.
     * This is a regular function call, not a hook.
     */
    const { sortedNutrients, message, createdAt } = getSortedNutritionData(
        useBaseRDI,
        baseNutrition,
        recommendedNutrition
    );

    /**
     * Build the chart data for the pie chart.
     * - Hook is always called (no conditional returns before this)
     * - If `sortedNutrients` is missing, return an empty array
     */
    const chartData = useMemo(() => {
        if (!sortedNutrients) {
            return [];
        }

        /**
         * Helper to find a nutrient by name.
         * Falls back to an object with value 0 when the nutrient is not present.
         *
         * @param {string} name
         * @returns {{name: string, value: number}}
         */
        const pick = (name) =>
            sortedNutrients.find((n) => n.name === name) || { name, value: 0 };

        return [
            { name: "Protein", value: pick("Protein").value ?? 0 },
            { name: "Carbohydrates", value: pick("Carbohydrates").value ?? 0 },
            { name: "Fat", value: pick("Total lipid (fat)").value ?? 0 },
        ];
    }, [sortedNutrients]);

    // Show a loading indicator while the nutrition data is being fetched.
    if (loading) {
        return <Spinner className="mx-auto my-4" />;
    }

    // If there is no data, show the message returned by getSortedNutritionData.
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
                <CustomTypography variant="h2" className="text-center">
                    {useBaseRDI ? "Recommended" : "Today"}
                </CustomTypography>

                {/* Pie chart on top, table below */}
                <CustomBox className="flex flex-col gap-4">
                    <NutritionPieChart
                        chartData={chartData}
                        sortedNutrients={sortedNutrients}
                    />

                    <NutritionTable
                        sortedNutrients={sortedNutrients.filter(
                            (n) =>
                                n.name !== "Saturated and Trans fats" &&
                                n.name !== "Mono- and Polyunsaturated fats"
                        )}
                        useBaseRDI={useBaseRDI}
                    />
                </CustomBox>

                <CustomTypography
                    variant="xsmallCard"
                    className="text-right text-friendlyGray mt-2"
                >
                    {createdAt}
                </CustomTypography>
            </CustomBox>
        </CustomCard>
    );
};

NutritionPieOverview.propTypes = {
    /** When true, use base RDI values instead of today's intake. */
    useBaseRDI: PropTypes.bool,
};

export default NutritionPieOverview;
