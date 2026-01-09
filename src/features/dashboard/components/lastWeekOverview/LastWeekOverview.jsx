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



const LastWeekOverview = ({ dailyRdiList }) => {
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


    return (
        <CustomBox className="flex flex-col gap-2 text-center">
            <CustomTypography variant="h3" className="mt-4">
                Last Week&#39;s Overview
            </CustomTypography>

            <CustomTypography variant="xsmallCard" className="mx-4 mb-2" italic>
                Daily values show how much you deviated from your recommended intake.{" "}
                <Inline color="#38adb5" weight="700">Green positive values</Inline>{" "}
                mean you ate less than recommended (remaining intake),{" "}
                <Inline color="#F43F5E" weight="700">red negative values</Inline>{" "}
                mean you ate more than recommended. The closer the value is to zero,
                the more balanced your intake was for that nutrient. Your weekly and
                monthly pattern is more important than any single day.
            </CustomTypography>

            <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {sortedDays.map(({ date, data }) => {
                    const meals = getSortedConsumedMeals(data);
                    const isOpen = !!openMealsByDate[date];

                    return (
                        <CustomCard key={date} hasBorder>
                            <RecommendedNutritionDisplay variant="date" data={data} />

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
        </CustomBox>
    );
};

LastWeekOverview.propTypes = {
    dailyRdiList: PropTypes.array.isRequired,
};

export default LastWeekOverview;
