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

const RecommendedNutritionDisplay = ({ variant = "today", data = null }) => {
    const {
        recommendedNutrition,
        baseNutrition,
        weeklyRdi,
        monthlyRdi,
        loading,
        setRecommendedNutrition,
    } = useContext(RecommendedNutritionContext);
    const { token } = useContext(AuthContext);

    const getRemainingDays = (period) => {
        const today = new Date();

        if (period === "week") {
            const daysLeft = 7 - today.getDay(); // zondag = 0 → 7
            return daysLeft <= 1 ? 1 : daysLeft; // op zaterdag: 1 dag over
        }

        if (period === "month") {
            const year = today.getFullYear();
            const month = today.getMonth();
            const lastDay = new Date(year, month + 1, 0).getDate();
            const daysLeft = lastDay - today.getDate() + 1;
            return daysLeft <= 1 ? 1 : daysLeft;
        }

        return 1;
    };


    useEffect(() => {
        if (!token && variant === "today") {
            setRecommendedNutrition(null);
        }
    }, [token, variant]);

    if (loading && variant === "today") {
        return <Spinner className="mx-auto my-4" />;
    }

    const labelMap = {
        base: "Recommended Intake",
        today: "Today's Intake",
        week: "Weekly Summary",
        month: "Monthly Summary",
        weekAverage: "Avg per Day (This Week)",
        monthAverage: "Avg per Day (This Month)",

    };


    let source;
    switch (variant) {
        case "base":
            source = baseNutrition;
            break;
        case "today":
            source = recommendedNutrition;
            break;
        case "week":
            source = weeklyRdi;
            break;
        case "month":
            source = monthlyRdi;
            break;
        case "date":
            source = data;
            break;
        case "weekAverage": {
            const daysLeftWeek = getRemainingDays("week");
            source = {
                ...weeklyRdi,
                nutrients: (weeklyRdi?.nutrients || []).map(n => ({
                    ...n,
                    value: n.value / daysLeftWeek
                }))
            };
            break;
        }
        case "monthAverage": {
            const daysLeftMonth = getRemainingDays("month");
            source = {
                ...monthlyRdi,
                nutrients: (monthlyRdi?.nutrients || []).map(n => ({
                    ...n,
                    value: n.value / daysLeftMonth
                }))
            };
            break;
        }

        default:
            return null;

    }

    const { sortedNutrients, message, createdAt } = getSortedNutritionData(
        variant === "base",
        baseNutrition,
        source
    );

    if (!sortedNutrients) {
        return (
            <CustomTypography variant="h5" className="text-center mt-4">
                {message}
            </CustomTypography>
        );
    }

    return (
        <CustomCard className="max-w-xl mx-auto p-4">
            <CustomBox className="flex flex-col gap-4">
                <CustomTypography variant="h4" className="text-center">
                    {labelMap[variant]}
                </CustomTypography>

                <NutritionTable
                    sortedNutrients={sortedNutrients.filter(n =>
                        n.name !== "Saturated and Trans fats" &&
                        n.name !== "Mono- and Polyunsaturated fats"
                    )}
                    useBaseRDI={variant === "base"}
                />

                {createdAt && (
                    <CustomTypography variant="xsmallCard" className="text-right mt-2">
                        {createdAt}
                    </CustomTypography>
                )}
            </CustomBox>
        </CustomCard>
    );
};

RecommendedNutritionDisplay.propTypes = {
    variant: PropTypes.oneOf(["today", "base", "week", "month", "date", "weekAverage", "monthAverage"]),
    data: PropTypes.object,
};

export default RecommendedNutritionDisplay;
