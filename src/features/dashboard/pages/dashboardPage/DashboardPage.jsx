import { useContext } from "react";

// Contexts
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";

// Hooks
import { useDashboardData } from "../../utils/hooks/useDashboardData.js";

// Layout Components
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

// Feature Components
import DashboardContent from "../../components/dashboardContent/DashboardContent.jsx";
import DietSubMenu from "../../../diets/components/subMenu/DietsSubMenu.jsx";
import MealsSubMenu from "../../../meals/components/subMenu/MealsSubMenu.jsx";

// Helpers
import { buildChartData, getSortedNutritionData } from "../../utils/helpers/nutritionHelpers.js";
const DashboardPage = () => {
    const { userMeals } = useContext(UserMealsContext);
    const { userDiets } = useContext(UserDietsContext);

    // Everything logic-related is now handled inside this hook
    const {
        recommendedNutrition,
        baseNutrition,
        weeklyRdi,
        monthlyRdi,
        dailyRdiList
    } = useDashboardData();

    const { sortedNutrients } = getSortedNutritionData(false, baseNutrition, recommendedNutrition);
    const chartData = buildChartData(recommendedNutrition);
    const baseChartData = buildChartData(baseNutrition);

    return (
        <PageWrapper className="flex flex-col items-center">
            <CustomBox className="w-full mx-auto flex flex-col items-center gap-6">
                <CustomBox className="flex flex-col md:flex-row gap-12 justify-center">
                    <DietSubMenu isDetailPage />
                    <MealsSubMenu isDetailPage />
                </CustomBox>

                <DashboardContent
                    userMeals={userMeals}
                    userDiets={userDiets}
                    currentMealId={null}
                    chartData={chartData}
                    baseChartData={baseChartData}
                    sortedNutrients={sortedNutrients}
                    recommendedNutrition={recommendedNutrition}
                    baseNutrition={baseNutrition}
                    weeklyRdi={weeklyRdi}
                    monthlyRdi={monthlyRdi}
                    dailyRdiList={dailyRdiList}
                />
            </CustomBox>
        </PageWrapper>
    );
};

export default DashboardPage;