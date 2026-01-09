import PropTypes from "prop-types";
import { useContext, useEffect, useMemo } from "react";
import { RecommendedNutritionContext } from "../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import Spinner from "../layout/Spinner.jsx";
import { getSortedNutritionData } from "../../features/dashboard/utils/helpers/nutritionHelpers.js";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomCard from "../layout/CustomCard.jsx";
import NutritionPieChart from "../../features/dashboard/components/nutritionPieChart/NutritionPieChart.jsx";
import NutritionTable from "../../features/dashboard/components/recommendedNutritionDisplay/NutritionTable.jsx";
import {X} from "lucide-react";
import CustomButton from "../layout/CustomButton.jsx";

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
 * @param {Function} [props.onClose] - Optional close handler for when used inside a modal.
 */
const NutritionPieOverview = ({ useBaseRDI = false, onClose }) => {
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

    const buildChartData = (nutrition) => {
        const nutrients = nutrition?.nutrients ?? [];

        return nutrients
            .filter((n) =>
                ["Energy kcal", "Protein", "Carbohydrates", "Total lipid (fat)"].includes(n.name)
            )
            .map((n) => ({
                name: n.name,
                value: n.value ?? 0,
            }));
    };

    const chartData = buildChartData(recommendedNutrition);
    const baseChartData = buildChartData(baseNutrition);



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
                <CustomBox className="grid grid-cols-3 items-center">
                    {/* Lege placeholder links zodat titel exact in het midden blijft */}
                    <CustomBox></CustomBox>

                    {/* Gecentreerde titel */}
                    <CustomTypography variant="h2" className="text-center">
                        {useBaseRDI ? "Recommended" : "Remaining Nutrients"}
                    </CustomTypography>

                    {/* Close button helemaal rechts */}
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
                        /* placeholder zodat kolom 3 altijd bestaat */
                        <div></div>
                    )}
                </CustomBox>

                {/* Pie chart on top, table below */}
                <CustomBox className="flex flex-col gap-2">
                    <NutritionPieChart chartData={chartData} baseChartData={baseChartData}/>


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
    onClose: PropTypes.func,
};

export default NutritionPieOverview;
