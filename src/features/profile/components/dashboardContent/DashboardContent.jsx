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
        <CustomBox className="flex flex-col lg:flex-row gap-6 w-full">

            {/* Middenkolom */}
            <CustomBox className="flex flex-col gap-4 basis-[75%] min-w-0">
                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Chart */}
                    {/* Chart + Daily RDI-kaarten onder elkaar */}
                    <CustomBox className="flex flex-col gap-4">
                        <NutritionPieChart chartData={chartData} sortedNutrients={sortedNutrients} />

                        {dailyRdiList.map(({ date, data }) => (
                            <CustomCard key={date} className="w-full p-4">
                                <RecommendedNutritionDisplay variant="date" data={data} />
                            </CustomCard>
                        ))}
                    </CustomBox>

                    {/* Voedingsaanbeveling */}
                    <CustomBox className="flex flex-col gap-4">
                        <CustomCard className="w-full p-4">
                            <RecommendedNutritionDisplay variant="today" />
                        </CustomCard>

                        <CustomCard className="w-full p-4">
                            <RecommendedNutritionDisplay variant="base" />
                        </CustomCard>

                        <CustomCard className="w-full p-4">
                            This BETA data may be inaccurate.
                            <RecommendedNutritionDisplay variant="week" data={weeklyRdi} />
                        </CustomCard>

                        <CustomCard className="w-full p-4">
                            This BETA data may be inaccurate.
                            <RecommendedNutritionDisplay variant="month" data={monthlyRdi} />
                        </CustomCard>

                        <CustomCard className="w-full p-4">
                            This BETA data may be inaccurate.
                            <RecommendedNutritionDisplay variant="weekAverage" data={weeklyRdi} />
                        </CustomCard>

                        <CustomCard className="w-full p-4">
                            This BETA data may be inaccurate.
                            <RecommendedNutritionDisplay variant="monthAverage" data={monthlyRdi} />
                        </CustomCard>

                    </CustomBox>
                </CustomBox>
            </CustomBox>

            {/* Sidebar rechts (My Meals) */}
            <CustomBox className="hidden lg:flex flex-col gap-4 basis-[25%] max-w-[25%] overflow-y-auto px-2">

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
