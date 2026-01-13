import { useContext, useState } from "react";

// Contexts
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

// Hooks
import { useDashboardData } from "../../utils/hooks/useDashboardData.js";
import useUserProfile from "../../../profile/utils/hooks/useUserProfile.js";
import { useWeightUpdates } from "../../../profile/utils/hooks/useWeightUpdates.js";

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
    const { token } = useContext(AuthContext);
    const { userMeals } = useContext(UserMealsContext);
    const { userDiets } = useContext(UserDietsContext);

    // Fetch user profile data and refetch function
    const { userData, isLoading: isLoadingUser, refetch } = useUserProfile(token);

    // Edit states for weight and target metrics
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [isEditingTarget, setIsEditingTarget] = useState(false);

    // Initialize update handlers with refetch capability
    const { handleWeightUpdate, handleTargetUpdate } = useWeightUpdates(refetch);

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
                    weightData={userData?.weightHistory || []}
                    targetWeight={userData?.targetWeight}
                    isLoadingWeight={isLoadingUser}
                    isEditingWeight={isEditingWeight}
                    setIsEditingWeight={setIsEditingWeight}
                    isEditingTarget={isEditingTarget}
                    setIsEditingTarget={setIsEditingTarget}
                    onQuickWeightUpdate={handleWeightUpdate}
                    onQuickTargetUpdate={handleTargetUpdate}
                />
            </CustomBox>
        </PageWrapper>
    );
};

export default DashboardPage;