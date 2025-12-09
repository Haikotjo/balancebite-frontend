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

const titleMap = {
    today: "Today",
    base: "Recommended",
    date: "Day overview",
    week: "Last 7 days (total)",
    weekAverage: "Last 7 days (average)",
    month: "Last 30 days (total)",
    monthAverage: "Last 30 days (average)",
};

const RecommendedNutritionDisplay = ({
                                         variant = "today", // "today" | "base" | "date" | "week" | "month" | "weekAverage" | "monthAverage"
                                         data = null,       // gebruikt voor date/week/month varianten
                                     }) => {
    const {
        recommendedNutrition,
        baseNutrition,
        loading,
        setRecommendedNutrition
    } = useContext(RecommendedNutritionContext);

    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token, setRecommendedNutrition]);

    const wantsContextLoading = variant === "today" || variant === "base";
    if (wantsContextLoading && loading) {
        return <Spinner className="mx-auto my-4" />;
    }

    // Bepaal welke bron en of we base-RDI gebruiken
    let useBaseRDI = false;
    let source = null;

    switch (variant) {
        case "today":
            useBaseRDI = false;
            source = recommendedNutrition;
            break;
        case "base":
            useBaseRDI = true;
            // getSortedNutritionData gebruikt baseNutrition intern wanneer useBaseRDI=true,
            // dus hier mag recommendedNutrition gewoon mee als "current"
            source = recommendedNutrition;
            break;
        case "date":
        case "week":
        case "month":
        case "weekAverage":
        case "monthAverage":
            useBaseRDI = false;
            source = data;
            break;
        default:
            useBaseRDI = false;
            source = recommendedNutrition;
    }

    if (loading) {
        return <Spinner className="mx-auto my-4" />;
    }

    const { sortedNutrients, message, createdAt } =
        getSortedNutritionData(useBaseRDI, baseNutrition, source);

    if (!sortedNutrients) {
        return (
            <CustomTypography variant="h5" className="text-center mt-4">
                {message}
            </CustomTypography>
        );
    }

    const title = titleMap[variant] ?? (useBaseRDI ? "Recommended" : "Today");

    return (
        <CustomCard className="max-w-xl mx-auto p-4">
            <CustomBox className="flex flex-col gap-4">
                <CustomTypography variant="h4" className="text-center">
                    {title}
                </CustomTypography>

                <NutritionTable
                    sortedNutrients={sortedNutrients.filter(n =>
                        n.name !== "Saturated and Trans fats" &&
                        n.name !== "Mono- and Polyunsaturated fats"
                    )}
                    useBaseRDI={useBaseRDI}
                />

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
};

export default RecommendedNutritionDisplay;
