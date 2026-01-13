import PropTypes from "prop-types";

// Layout Components
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

// Feature Components
import MealDetailCard from "../../../meals/components/mealCardLarge/MealDetailCard.jsx";
import AccordionItem from "../../../diets/components/accordionItem/AccordionItem.jsx";
import NutritionPieChart from "../nutritionPieChart/NutritionPieChart.jsx";
import LastWeekOverview from "../lastWeekOverview/LastWeekOverview.jsx";
import GoalProgressCard from "../goalProgressCard/GoalProgressCard.jsx";

// Helpers & Config
import { buildMonthlyAverageRdi, buildWeeklyAverageRdi } from "../../utils/helpers/rdiHelpers.js";
import { buildGoalCards } from "../../utils/helpers/goalCardsConfig.js";
import WeightHistoryChart from "../../../profile/components/weightHistoryChart/WeightHistoryChart.jsx";

const DashboardContent = ({
                              userMeals,
                              currentMealId,
                              chartData,
                              baseChartData,
                              weeklyRdi,
                              monthlyRdi,
                              dailyRdiList,
                              baseNutrition,
                              recommendedNutrition,
                              weightData,
                              targetWeight,
                              isLoadingWeight,
                              isEditingWeight,
                              setIsEditingWeight,
                              isEditingTarget,
                              setIsEditingTarget,
                              onQuickWeightUpdate,
                              onQuickTargetUpdate
                          }) => {

    const weeklyAverageRdi = buildWeeklyAverageRdi(weeklyRdi);
    const monthlyAverageRdi = buildMonthlyAverageRdi(monthlyRdi);

    const goalCards = buildGoalCards(
        weeklyAverageRdi,
        monthlyAverageRdi,
        weeklyRdi,
        monthlyRdi,
        baseNutrition,
        recommendedNutrition,
    );

    return (
        <CustomBox className="flex flex-col xl:flex-row gap-2 w-full mt-4">

            <CustomBox className="hidden lg:flex flex-col gap-6 basis-[80%] min-w-0">

                <CustomBox className="flex flex-col gap-4">

                    <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <NutritionPieChart chartData={chartData} baseChartData={baseChartData}/>
                        <WeightHistoryChart
                            data={weightData}
                            targetWeight={targetWeight}
                            isLoading={isLoadingWeight}
                            isEditingWeight={isEditingWeight}
                            setIsEditingWeight={setIsEditingWeight}
                            isEditingTarget={isEditingTarget}
                            setIsEditingTarget={setIsEditingTarget}
                            onQuickWeightUpdate={onQuickWeightUpdate}
                            onQuickTargetUpdate={onQuickTargetUpdate}
                        />
                    </CustomBox>

                </CustomBox>


                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                    {/* Goals */}
                    <CustomBox className="flex flex-col gap-4">
                        <CustomBox className="text-center">
                            <CustomTypography variant="h3">Goal Overview</CustomTypography>
                            <CustomTypography className="text-muted text-sm">Remaining nutrients based on averages</CustomTypography>
                        </CustomBox>

                        <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {goalCards.map((card) => (
                                <GoalProgressCard
                                    key={card.key}
                                    variant={card.variant}
                                    data={card.data}
                                    description={card.description}
                                    chartData={chartData}
                                    baseChartData={baseChartData}
                                />
                            ))}
                        </CustomBox>
                    </CustomBox>

                    <CustomBox className="flex flex-col gap-4">
                        <LastWeekOverview dailyRdiList={dailyRdiList} baseChartData={baseChartData}/>
                    </CustomBox>

                </CustomBox>
            </CustomBox>



            {/* -------------------------------------------------------- */}
            {/* MOBILE + TABLET  (ACCORDIONS)  */}
            {/* -------------------------------------------------------- */}

            <CustomBox className="flex lg:hidden flex-col">

                <CustomBox className="flex flex-col gap-2 mb-4">
                    <CustomBox className="text-center">
                        <CustomTypography variant="h3">
                            Today’s Nutrition Overview
                        </CustomTypography>
                        <CustomTypography variant="small" className="text-muted mt-1">
                            Showing your remaining intake for today based on your goals
                        </CustomTypography>
                    </CustomBox>

                    <CustomCard hasBorder>
                        <NutritionPieChart chartData={chartData} baseChartData={baseChartData}/>
                    </CustomCard>
                </CustomBox>

                <AccordionItem title="Last Week's Overview">
                    <LastWeekOverview dailyRdiList={dailyRdiList} baseChartData={baseChartData} />
                </AccordionItem>

                {goalCards.map((card) => (
                    <AccordionItem key={card.key} title={card.accordionTitle}>
                        <GoalProgressCard
                            variant={card.variant}
                            data={card.data}
                            description={card.description}
                            chartData={chartData}
                            baseChartData={baseChartData}
                        />
                    </AccordionItem>
                ))}

                <CustomBox className="mt-4">
                    <WeightHistoryChart
                        data={weightData}
                        targetWeight={targetWeight}
                        isLoading={isLoadingWeight}
                    />
                </CustomBox>

            </CustomBox>



            {/* SIDEBAR (desktop only) */}
            <CustomBox className="hidden lg:flex flex-col gap-4 basis-[20%] max-w-[20%] min-w-[320px] overflow-y-auto px-2">

                {userMeals
                    ?.filter(meal => String(meal.id) !== String(currentMealId))
                    .map(meal => (
                        <MealDetailCard viewMode="list" key={meal.id} meal={meal} />
                    ))}
            </CustomBox>

        </CustomBox>
    );
};

DashboardContent.propTypes = {
    userMeals: PropTypes.array,
    userDiets: PropTypes.array,
    currentMealId: PropTypes.any,
    chartData: PropTypes.array,
    baseChartData: PropTypes.array,
    sortedNutrients: PropTypes.array,
    recommendedNutrition: PropTypes.object,
    baseNutrition: PropTypes.object,
    weeklyRdi: PropTypes.object,
    monthlyRdi: PropTypes.object,
    dailyRdiList: PropTypes.array,
    weightData: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        weight: PropTypes.number
    })),
    targetWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isLoadingWeight: PropTypes.bool,
    isEditingWeight: PropTypes.bool,
    setIsEditingWeight: PropTypes.func,
    isEditingTarget: PropTypes.bool,
    setIsEditingTarget: PropTypes.func,
    onQuickWeightUpdate: PropTypes.func,
    onQuickTargetUpdate: PropTypes.func
};

export default DashboardContent;
