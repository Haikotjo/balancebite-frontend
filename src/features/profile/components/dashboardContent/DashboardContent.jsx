import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography, {Inline} from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import PropTypes from "prop-types";
import MealDetailCard from "../../../meals/components/mealCardLarge/MealDetailCard.jsx";
import NutritionPieChart from "../nutritionPieChart/NutritionPieChart.jsx";
import {buildMonthlyAverageRdi, buildWeeklyAverageRdi} from "../../utils/helpers/rdiHelpers.js";
import AccordionItem from "../../../diets/components/accordionItem/AccordionItem.jsx";

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

    return (
        <CustomBox className="flex flex-col xl:flex-row gap-2 w-full mt-4">

            {/* -------------------------------------------------------- */}
            {/* DESKTOP / LAPTOP LAYOUT (exact jouw versie) */}
            {/* -------------------------------------------------------- */}

            <CustomBox className="hidden lg:flex flex-col gap-2 basis-[80%] min-w-0">
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* LEFT COLUMN */}
                    <CustomBox className="flex flex-col gap-4">
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

                        {/* Last Week */}
                        <CustomBox className="flex flex-col gap-2 text-center">
                            <CustomTypography variant="h3" className="mt-4">
                                Last Week's Overview
                            </CustomTypography>

                            <CustomTypography variant="xsmallCard" className="mx-4">
                                Daily values show how much you deviated from your recommended intake.{" "}
                                <Inline color="#38adb5" weight="700">Green positive values</Inline>{" "}
                                mean you ate less than recommended (remaining intake),{" "}
                                <Inline color="#F43F5E" weight="700">red negative values</Inline>{" "}
                                mean you ate more than recommended. Your weekly and monthly pattern is more
                                important than any single day.
                            </CustomTypography>


                            <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[...dailyRdiList]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(({ date, data }) => {
                                        const daysAgo = Math.floor((new Date() - new Date(date)) / 86400000);
                                        const label = daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

                                        return (
                                            <CustomCard key={date} className="pt-4" hasBorder>
                                                <CustomTypography variant="h5" className="mb-2">
                                                    {label}
                                                </CustomTypography>
                                                <RecommendedNutritionDisplay variant="date" data={data} />
                                            </CustomCard>
                                        );
                                    })}
                            </CustomBox>
                        </CustomBox>
                    </CustomBox>


                    {/* RIGHT COLUMN */}
                    <CustomBox className="flex flex-col gap-2 ">
                        <CustomTypography variant="h3" className="text-center">
                            Goal & Progress Overview
                        </CustomTypography>

                        <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="today" />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Remaining recommended nutrients for today, based on your current goals.
                                </CustomTypography>
                            </CustomCard>

                            <CustomCard className="w-full p-4" hasBorder>
                                <RecommendedNutritionDisplay variant="base" />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Your baseline daily recommended intake, calculated from your profile settings.
                                </CustomTypography>
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="week" data={weeklyRdi} />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Total recommended nutrients for the remaining days of this week (may be inaccurate if past data is incomplete).
                                </CustomTypography>
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="month" data={monthlyRdi} />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Total recommended nutrients for the remaining days of this month (may be inaccurate if past data is incomplete).
                                </CustomTypography>
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="weekAverage" data={weeklyAverageRdi} />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Calculated daily average for the rest of the week (may be inaccurate if past data is incomplete).
                                </CustomTypography>
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="monthAverage" data={monthlyAverageRdi} />
                                <CustomTypography variant="xsmallCard" className="m-2">
                                    Calculated daily average for the rest of the month (may be inaccurate if past data is incomplete).
                                </CustomTypography>
                            </CustomCard>

                        </CustomBox>
                    </CustomBox>

                </CustomBox>
            </CustomBox>



            {/* -------------------------------------------------------- */}
            {/* MOBILE + TABLET  (ACCORDIONS)  */}
            {/* -------------------------------------------------------- */}

            <CustomBox className="flex lg:hidden flex-col gap-4">

                {/* Today stays normal */}
                <CustomBox className="flex flex-col gap-4">
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
                    <CustomBox className="grid grid-cols-1 gap-4">
                        {[...dailyRdiList]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(({ date, data }) => {
                                const daysAgo = Math.floor((new Date() - new Date(date)) / 86400000);
                                const label = daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

                                return (
                                    <CustomCard key={date} className="pt-4" hasBorder>
                                        <CustomTypography variant="h5" className="mb-2">{label}</CustomTypography>
                                        <RecommendedNutritionDisplay variant="date" data={data} />
                                    </CustomCard>
                                );
                            })}
                    </CustomBox>
                </AccordionItem>

                {/* All progress cards in accordions (with all original text) */}
                <AccordionItem title="Today's remaining nutrients">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="today" />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Remaining recommended nutrients for today, based on your current goals.
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

                <AccordionItem title="Base Nutrition">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="base" />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Your baseline daily recommended intake, calculated from your profile settings.
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

                <AccordionItem title="This week's remaining nutrients">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="week" data={weeklyRdi} />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Total recommended nutrients for the remaining days of this week (may be inaccurate if past data is incomplete).
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

                <AccordionItem title="This month's remaining nutrients">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="month" data={monthlyRdi} />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Total recommended nutrients for the remaining days of this month (may be inaccurate if past data is incomplete).
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

                <AccordionItem title="Per day for the rest of this week">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="weekAverage" data={weeklyAverageRdi} />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Calculated daily average for the rest of the week (may be inaccurate if past data is incomplete).
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

                <AccordionItem title="Per day for the rest of this month">
                    <CustomCard className="pt-4" hasBorder>
                        <RecommendedNutritionDisplay variant="monthAverage" data={monthlyAverageRdi} />
                        <CustomTypography variant="xsmallCard" className="m-2">
                            Calculated daily average for the rest of the month (may be inaccurate if past data is incomplete).
                        </CustomTypography>
                    </CustomCard>
                </AccordionItem>

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
