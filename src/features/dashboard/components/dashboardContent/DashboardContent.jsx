import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import PropTypes from "prop-types";
import MealDetailCard from "../../../meals/components/mealCardLarge/MealDetailCard.jsx";
import NutritionPieChart from "../nutritionPieChart/NutritionPieChart.jsx";
import {buildMonthlyAverageRdi, buildWeeklyAverageRdi} from "../../utils/helpers/rdiHelpers.js";
import AccordionItem from "../../../diets/components/accordionItem/AccordionItem.jsx";
import LastWeekOverview from "../lastWeekOverview/LastWeekOverview.jsx";
import GoalProgressCard from "../goalProgressCard/GoalProgressCard.jsx";
import {buildGoalCards} from "../../utils/helpers/goalCardsConfig.js";

const DashboardContent = ({
                              userMeals,
                              currentMealId,
                              chartData,
                              sortedNutrients,
                              weeklyRdi,
                              monthlyRdi,
                              dailyRdiList,
                          }) => {

    const weeklyAverageRdi = buildWeeklyAverageRdi(weeklyRdi);
    const monthlyAverageRdi = buildMonthlyAverageRdi(monthlyRdi);

    const goalCards = buildGoalCards(
        weeklyAverageRdi,
        monthlyAverageRdi,
        weeklyRdi,
        monthlyRdi
    );

    return (
        <CustomBox className="flex flex-col xl:flex-row gap-2 w-full mt-4">

            {/* -------------------------------------------------------- */}
            {/* DESKTOP / LAPTOP LAYOUT */}
            {/* -------------------------------------------------------- */}

            <CustomBox className="hidden lg:flex flex-col gap-2 basis-[80%] min-w-0">
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* LEFT COLUMN */}
                    <CustomBox className="flex flex-col gap-2">
                        <CustomBox className="text-center">
                            <CustomTypography variant="h3">
                                Today’s Nutrition Overview
                            </CustomTypography>
                            <CustomTypography className="text-sm text-muted mt-1 mb-2">
                                Showing your remaining intake for today based on your goals
                            </CustomTypography>
                        </CustomBox>

                        <CustomCard hasBorder>
                            <NutritionPieChart chartData={chartData} sortedNutrients={sortedNutrients} />
                        </CustomCard>

                        {/* Last Week */}
                        <LastWeekOverview dailyRdiList={dailyRdiList} />
                    </CustomBox>

                    {/* RIGHT COLUMN */}
                    <CustomBox className="flex flex-col gap-2 ">
                        <CustomBox className="text-center">
                            <CustomTypography variant="h3" className="text-center">
                                Goal & Progress Overview
                            </CustomTypography>
                            <CustomTypography className="text-sm text-muted mt-1 mb-2">
                                Overview of averages and remaining nutrients.
                            </CustomTypography>
                        </CustomBox>

                        <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                            {goalCards.map((card) => (
                                <GoalProgressCard
                                    key={card.key}
                                    variant={card.variant}
                                    data={card.data}
                                    description={card.description}
                                />
                            ))}
                        </CustomBox>
                    </CustomBox>

                </CustomBox>
            </CustomBox>



            {/* -------------------------------------------------------- */}
            {/* MOBILE + TABLET  (ACCORDIONS)  */}
            {/* -------------------------------------------------------- */}

            <CustomBox className="flex lg:hidden flex-col">

                {/* Today stays normal */}
                <CustomBox className="flex flex-col gap-2 mb-4">
                    <CustomBox className="text-center">
                        <CustomTypography variant="h3">
                            Today’s Nutrition Overview
                        </CustomTypography>
                        <CustomTypography variant="body" className="text-sm text-muted mt-1">
                            Showing your remaining intake for today based on your goals
                        </CustomTypography>
                    </CustomBox>

                    <CustomCard hasBorder>
                        <NutritionPieChart chartData={chartData} sortedNutrients={sortedNutrients} />
                    </CustomCard>
                </CustomBox>

                {/* Last Week in accordion */}
                <AccordionItem title="Last Week's Overview">
                    <LastWeekOverview dailyRdiList={dailyRdiList} />
                </AccordionItem>

                {/* All progress cards in accordions (with all original text) */}
                {goalCards.map((card) => (
                    <AccordionItem key={card.key} title={card.accordionTitle}>
                        <GoalProgressCard
                            variant={card.variant}
                            data={card.data}
                            description={card.description}
                        />
                    </AccordionItem>
                ))}

            </CustomBox>



            {/* SIDEBAR (desktop only) */}
            <CustomBox className="hidden lg:flex flex-col gap-4 basis-[20%] max-w-[20%] min-w-[320px] overflow-y-auto px-2">
                <CustomTypography variant="h4" className="mb-4 font-semibold">
                    My Meals
                </CustomTypography>

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
    sortedNutrients: PropTypes.array,
    recommendedNutrition: PropTypes.object,
    baseNutrition: PropTypes.object,
    weeklyRdi: PropTypes.object,
    monthlyRdi: PropTypes.object,
    dailyRdiList: PropTypes.array,
};

export default DashboardContent;
