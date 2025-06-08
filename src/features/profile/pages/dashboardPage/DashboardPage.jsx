import { useContext, useEffect, useState } from "react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { getSortedNutritionData } from "../../utils/nutritionHelpers.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import DietSubMenu from "../../../diets/components/subMenu/DietsSubMenu.jsx";
import SubMenu from "../../../meals/components/subMenu/SubMenu.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { format, subDays } from "date-fns";
import DashboardContent from "../../components/dashboardContent/DashboardContent.jsx";

const DashboardPage = () => {
    const {
        recommendedNutrition,
        baseNutrition,
        setRecommendedNutrition,
        weeklyRdi,
        monthlyRdi,
        fetchWeeklyRdi,
        fetchMonthlyRdi,
    } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);
    const { token } = useContext(AuthContext);

    const { userDiets } = useContext(UserDietsContext);
    const [dailyRdiList, setDailyRdiList] = useState([]);
    const { fetchDailyRdiByDate } = useContext(RecommendedNutritionContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            const userId = JSON.parse(atob(token.split(".")[1])).sub;
            fetchWeeklyRdi(userId);
            fetchMonthlyRdi(userId);
        }
    }, [token]);

    const { sortedNutrients } = getSortedNutritionData(false, baseNutrition, recommendedNutrition);

    const chartData = sortedNutrients
        ?.filter(n => ["Protein", "Carbohydrates", "Total lipid (fat)"].includes(n.name))
        .map(n => ({
            name: n.name,
            value: n.value || 0,
        }));

    useEffect(() => {
        const loadDailyRdi = async () => {
            const today = new Date();
            const days = [];

            for (let i = 1; i <= 7; i++) {
                const date = subDays(today, i);
                const formattedDate = format(date, "yyyy-MM-dd");
                const data = await fetchDailyRdiByDate(formattedDate);
                if (data) {
                    days.push({ date: formattedDate, data });
                }
            }
            setDailyRdiList(days.reverse()); // Oudste eerst
        };

        if (token) loadDailyRdi();
    }, [token]);

    return (
        <CustomBox className="flex flex-col items-center gap-6 pt-6 sm:pt-10 px-4 pb-24 sm:pb-10">
            <CustomTypography variant="h2" className="text-center">
                Dashboard
            </CustomTypography>

            {/* Submenus */}
            <CustomBox className="flex flex-col md:flex-row gap-12 justify-center">
                <DietSubMenu
                    isDetailPage
                />
                <SubMenu isDetailPage />
            </CustomBox>

            {/* Driekoloms-layout */}
            <DashboardContent
                userMeals={userMeals}
                userDiets={userDiets}
                currentMealId={null}
                chartData={chartData}
                sortedNutrients={sortedNutrients}
                recommendedNutrition={recommendedNutrition}
                baseNutrition={baseNutrition}
                weeklyRdi={weeklyRdi}
                monthlyRdi={monthlyRdi}
                dailyRdiList={dailyRdiList}
            />
        </CustomBox>
    );
};

export default DashboardPage;
