import { useContext, useEffect, useState } from "react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { getSortedNutritionData } from "../../utils/nutritionHelpers.js";
import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { useNavigate } from "react-router-dom";
import DietSubMenu from "../../../diets/components/subMenu/DietsSubMenu.jsx";
import SubMenu from "../../../meals/components/subMenu/SubMenu.jsx";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";
import DietListCard from "../../../diets/components/dietListCard/DietListCard.jsx";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import MealCardCompact from "../../../meals/components/mealCardCompact/MealCardCompact.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const DashboardPage = () => {
    const { recommendedNutrition, baseNutrition, setRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const isSmallScreen = useIsSmallScreen();

    const [activeDietOption, setActiveDietOption] = useState(null);
    const [activeMealOption, setActiveMealOption] = useState(null);
    const currentMealId = null;
    const { userDiets } = useContext(UserDietsContext);

    useEffect(() => {
        if (!token) {
            setRecommendedNutrition(null);
        }
    }, [token]);

    const { sortedNutrients } = getSortedNutritionData(false, baseNutrition, recommendedNutrition);

    const chartData = sortedNutrients
        ?.filter(n => ["Protein", "Carbohydrates", "Total lipid (fat)"].includes(n.name))
        .map(n => ({
            name: n.name,
            value: n.value || 0,
        }));

    const COLORS = ["#41D3BD", "#DD1155", "#71f175"];

    return (
        <CustomBox className="flex flex-col items-center gap-6 pt-6 sm:pt-10 px-4 pb-24 sm:pb-10">
            <CustomTypography variant="h2" className="text-center">
                Dashboard
            </CustomTypography>

            {/* Submenus */}
            <CustomBox className="flex flex-col md:flex-row gap-12 justify-center">
                <DietSubMenu
                    isDetailPage={true}
                    onSelect={(label) => {
                        setActiveDietOption(label);
                        const optionParam = label.toLowerCase().replace(/\s+/g, "-");
                        navigate(`/diets?option=${optionParam}`);
                    }}
                />
                <SubMenu
                    isDetailPage={true}
                    onSelect={(label) => {
                        setActiveMealOption(label);
                        const optionParam = label.toLowerCase().replace(/\s+/g, "-");
                        navigate(`/meals?option=${optionParam}`);
                    }}
                />
            </CustomBox>

            {/* Driekoloms-layout */}
            <CustomBox className="flex flex-col lg:flex-row gap-6 w-full">

                {/* Sidebar links (My Meals) */}
                <CustomBox className="hidden lg:flex flex-col gap-4 basis-[22%] max-w-[22%] overflow-y-auto px-2">
                    <CustomTypography variant="h4" className="mb-4 font-semibold">
                        My Meals
                    </CustomTypography>
                    {userMeals
                        ?.filter(meal => String(meal.id) !== String(currentMealId))
                        .map(meal => (
                            <MealCardCompact key={meal.id} meal={meal} />
                        ))}
                </CustomBox>

                {/* Middenkolom */}
                <CustomBox className="flex flex-col gap-4 basis-[56%] min-w-0">
                    <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Chart */}
                        {chartData && (
                            <CustomCard className="w-full p-4 h-fit">
                                <CustomBox className="w-full">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {sortedNutrients && (
                                        <CustomTypography variant="h5" className="text-center text-primary mt-2">
                                            Energy: {sortedNutrients.find(n => n.name === "Energy kcal")?.value ?? 0} kcal
                                        </CustomTypography>
                                    )}
                                </CustomBox>
                            </CustomCard>
                        )}

                        {/* Voedingsaanbeveling */}
                        <div className="flex flex-col gap-4">
                            <CustomCard className="w-full p-4">
                                <RecommendedNutritionDisplay />
                            </CustomCard>
                            <CustomCard className="w-full p-4">
                                <RecommendedNutritionDisplay useBaseRDI={true} />
                            </CustomCard>
                        </div>
                    </CustomBox>
                </CustomBox>

                {/* Sidebar rechts (My Diets) */}
                <CustomBox className="hidden lg:flex flex-col gap-4 basis-[22%] max-w-[22%] overflow-y-auto pl-2">
                    <CustomTypography variant="h4" className="mb-4 font-semibold">
                        My Diets
                    </CustomTypography>
                    {userDiets?.map(diet => (
                        <DietListCard key={diet.id} compact diet={diet} />
                    ))}
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

export default DashboardPage;
