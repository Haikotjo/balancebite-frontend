import { useContext, useEffect, useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { RecommendedNutritionContext } from "../../../../context/RecommendedNutritionContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { getSortedNutritionData } from "../../utils/nutritionHelpers.js";
import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts";
import RecommendedNutritionDisplay from "../../components/recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import MealDetailCard from "../../../meals/components/mealCardLarge/MealDetailCard.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { useNavigate } from "react-router-dom";
import DietSubMenu from "../../../diets/components/subMenu/DietsSubMenu.jsx";
import SubMenu from "../../../meals/components/subMenu/SubMenu.jsx";
import useIsSmallScreen from "../../../../hooks/useIsSmallScreen.js";

const DashboardPage = () => {
    const { recommendedNutrition, baseNutrition, setRecommendedNutrition } = useContext(RecommendedNutritionContext);
    const { userMeals } = useContext(UserMealsContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const isSmallScreen = useIsSmallScreen();

    const [activeDietOption, setActiveDietOption] = useState(null);
    const [activeMealOption, setActiveMealOption] = useState(null);
    const currentMealId = null; // Voor later

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
        <CustomBox className="flex flex-col gap-4 p-5 pb-16 md:pb-10">
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

            {/* Main content + sidebar */}
            <CustomBox className="flex flex-col lg:flex-row gap-6 items-start w-full">

                {/* Twee kaarten naast elkaar (of onder elkaar) */}
                <CustomBox className="flex flex-col md:flex-row gap-4 w-full lg:flex-1">
                    {chartData && (
                        <CustomCard className="w-full md:w-1/2 p-4">
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

                    {/* Voeding kaart */}
                    <CustomCard className="w-full md:w-1/2 p-4">
                        <RecommendedNutritionDisplay useBaseRDI={true} />
                    </CustomCard>
                </CustomBox>

                {/* Sidebar alleen op grote schermen */}
                {!isSmallScreen && (
                    <CustomBox className="hidden lg:flex flex-col gap-4 lg:basis-1/4 min-w-0">
                        <CustomTypography variant="h4" className="mb-4 font-semibold">
                            My Meals
                        </CustomTypography>
                        <CustomBox className="flex flex-col gap-6 overflow-y-auto pr-2">
                            {userMeals
                                ?.filter(meal => String(meal.id) !== String(currentMealId))
                                .map(meal => (
                                    <MealDetailCard viewMode="list" key={meal.id} meal={meal} />
                                ))}
                        </CustomBox>
                    </CustomBox>
                )}
            </CustomBox>
        </CustomBox>
    );
};

export default DashboardPage;
