import PropTypes from "prop-types";
import { useMemo, useState, useCallback } from "react";
import { useModal } from "../../../../context/useModal.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography, { Inline } from "../../../../components/layout/CustomTypography.jsx";
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import MealModalById from "../../../meals/components/mealModalById/MealModalById.jsx";
import ConsumedMealsToggle from "../consumedMealsToggle/ConsumedMealsToggle.jsx";
import {getSortedConsumedMeals} from "../../utils/helpers/getSortedConsumedMeals.js";
import Spinner from "../../../../components/layout/Spinner.jsx";
import SectionHeader from "../../../profile/components/sectionHeaderOverview/SectionHeaderOverview.jsx";

const buildChartData = (nutrition, date = null) => {
    const nutrients = nutrition?.nutrients ?? [];
    const chartValues = nutrients
        .filter((n) =>
            ["Energy kcal", "Protein", "Carbohydrates", "Total lipid (fat)"].includes(n.name)
        )
        .map((n) => ({
            name: n.name,
            value: n.value ?? 0,
        }));

    return {
        date: date,
        data: chartValues
    };
};

const LastWeekOverview = ({ dailyRdiList, baseChartData }) => {
    const { openModal } = useModal();
    const [openMealsByDate, setOpenMealsByDate] = useState({});

    const openMealModal = useCallback(
        (mealId) => {
            if (!mealId) return;
            openModal(<MealModalById mealId={mealId} />, "meal", { id: mealId });
        },
        [openModal]
    );

    const sortedDays = useMemo(() => {
        const safeList = Array.isArray(dailyRdiList) ? dailyRdiList : [];
        return [...safeList].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [dailyRdiList]);

    const toggleMeals = (date) => {
        setOpenMealsByDate((prev) => ({ ...prev, [date]: !prev[date] }));
    };

    // Bepaal de status: laden vs leeg
    const isLoading = dailyRdiList === null || dailyRdiList === undefined;
    const isEmpty = Array.isArray(dailyRdiList) && dailyRdiList.length === 0;

    return (
        <CustomBox className="flex flex-col gap-2 text-center">
            <SectionHeader
                title="Last Week's Overview"
                subtitle="Nutritional Patterns"
                infoText={
                    <CustomTypography variant="xsmallCard" as="span" inheritColor>
                        Daily values show deviation from RDI.
                        <Inline color="#38adb5" weight="bold"> Green</Inline> means remaining,
                        <Inline color="#F43F5E" weight="bold"> red</Inline> means over-intake.
                        Zero is perfect balance. Patterns are more important than single days.
                    </CustomTypography>
                }
            />

            {isLoading ? (
                <CustomBox className="flex justify-center items-center w-full py-10">
                    <Spinner />
                </CustomBox>
            ) : isEmpty ? (
                <CustomBox className="bg-black/[0.02] dark:bg-white/[0.02] border border-dashed border-borderDark/20 dark:border-borderLight/20 rounded-2xl p-10 mt-2 text-center">
                    <CustomTypography variant="small" className="text-friendlyGray italic">
                        No nutritional data found for the past week.
                        Start logging your meals to see your patterns here!
                    </CustomTypography>
                </CustomBox>
            ) : (
                <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mt-2">
                    {sortedDays.map(({ date, data }) => {
                        const meals = getSortedConsumedMeals(data);
                        const isOpen = !!openMealsByDate[date];
                        const daySpecificChartObject = buildChartData(data, date);

                        return (
                            <CustomCard key={date} hasBorder>
                                <RecommendedNutritionDisplay
                                    variant="date"
                                    data={data}
                                    chartData={daySpecificChartObject.data}
                                    baseChartData={baseChartData}
                                />
                                <ConsumedMealsToggle
                                    meals={meals}
                                    isOpen={isOpen}
                                    onToggle={() => toggleMeals(date)}
                                    onOpenMeal={openMealModal}
                                />
                            </CustomCard>
                        );
                    })}
                </CustomBox>
            )}
        </CustomBox>
    );
};

LastWeekOverview.propTypes = {
    dailyRdiList: PropTypes.array,
    baseChartData: PropTypes.array,
};

export default LastWeekOverview;