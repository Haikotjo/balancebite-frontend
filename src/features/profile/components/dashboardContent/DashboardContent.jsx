import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import PropTypes from "prop-types";
import MealDetailCard from "../../../meals/components/mealCardLarge/MealDetailCard.jsx";
import NutritionPieChart from "../nutritionPieChart/NutritionPieChart.jsx";

const DashboardContent = ({
                              userMeals,
                              currentMealId,
                              chartData,
                              sortedNutrients,
                              weeklyRdi,
                              monthlyRdi,
                              dailyRdiList,
                          }) => {


    return (
        <CustomBox className="flex flex-col lg:flex-row gap-2 w-full mt-4">

            {/* Middenkolom */}
            <CustomBox className="flex flex-col gap-2 basis-[80%] min-w-0">
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chart */}
                    {/* Chart + Daily RDI-kaarten onder elkaar */}
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

                        <CustomBox className="flex flex-col gap-2 text-center">
                            <CustomTypography variant="h3" className="mt-4">
                                Last Week's Overview
                            </CustomTypography>

                            <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[...dailyRdiList]
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map(({ date, data }) => {
                                        const daysAgo = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
                                        const label = daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

                                        return (
                                            <CustomCard key={date} className=" pt-4" hasBorder>
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


                    {/* Voedingsaanbeveling */}
                    <CustomBox className="flex flex-col gap-2">
                        <CustomTypography variant="h3" className="text-center">
                            Goal & Progress Overview
                        </CustomTypography>

                        <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="today" />
                            </CustomCard>

                            <CustomCard className="w-full p-4" hasBorder>
                                <RecommendedNutritionDisplay variant="base" />
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="week" data={weeklyRdi} />
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="month" data={monthlyRdi} />
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="weekAverage" data={weeklyRdi} />
                            </CustomCard>

                            <CustomCard className="w-full pt-4" hasBorder>
                                <RecommendedNutritionDisplay variant="monthAverage" data={monthlyRdi} />
                            </CustomCard>
                        </CustomBox>
                    </CustomBox>

                </CustomBox>
            </CustomBox>

            {/* Sidebar rechts (My Meals) */}
            <CustomBox className="hidden lg:flex flex-col gap-4 basis-[20%] max-w-[20%] overflow-y-auto px-2">

                <CustomTypography variant="h4" className="mb-4 font-semibold">
                    My Meals
                </CustomTypography>
                {userMeals
                    ?.filter(meal => String(meal.id) !== String(currentMealId))
                    .map(meal => (
                        <MealDetailCard viewMode="list"  key={meal.id} meal={meal} />
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
    dailyRdiList: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string.isRequired,
            data: PropTypes.object.isRequired,
        })
    ),
};
export default DashboardContent;
