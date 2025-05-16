import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import Logo from "../../components/logo/Logo.jsx";
import HorizontalScrollSection from "../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import { useEffect, useState } from "react";
import Interceptor from "../../services/authInterceptor.js";
import MealCardCompact from "../../features/meals/components/mealCardCompact/MealCardCompact.jsx";
import MealDetailCard from "../../features/meals/components/mealCardLarge/MealDetailCard.jsx";
import DietListCard from "../../features/diets/dietListCard/DietListCard.jsx";
import {getAllPublicDietPlansApi} from "../../services/apiService.js";

/**
 * HomePage component that displays featured meals and diet plans
 */
function HomePage() {
    const navigate = useNavigate();
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [randomDiets, setRandomDiets] = useState([]);

    // Fetch vegetarian meals from backend
    const fetchVegetarianMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = "/meals?page=0&size=100&diets=VEGETARIAN";
        try {
            const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
            return response.data.content || [];
        } catch (error) {
            console.error("\u274C Failed to fetch vegetarian meals:", error);
            return [];
        }
    };

    // Fetch all meals from backend
    const fetchAllMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = "/meals?page=0&size=100";
        try {
            const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
            return response.data.content || [];
        } catch (error) {
            console.error("\u274C Failed to fetch all meals:", error);
            return [];
        }
    };

    // Fetch template diet plans
    const fetchRandomPublicDiets = async () => {
        try {
            const diets = await getAllPublicDietPlansApi({ page: 0, size: 30 });
            return diets;
        } catch (error) {
            console.error("❌ Failed to fetch public diets:", error);
            return [];
        }
    };

    // Load meals and diets on mount
    useEffect(() => {
        const loadData = async () => {
            const vegetarian = await fetchVegetarianMeals();
            setVegetarianMeals(vegetarian.sort(() => 0.5 - Math.random()).slice(0, 12));

            const all = await fetchAllMeals();
            setAllMeals(all.sort(() => 0.5 - Math.random()).slice(0, 12));

            const diets = await fetchRandomPublicDiets();
            setRandomDiets(diets.sort(() => 0.5 - Math.random()).slice(0, 6));
        };
        loadData();
    }, []);

    return (
        <CustomBox className="flex flex-col items-center justify-center min-h-screen w-full max-w-full mx-auto px-2 text-center ">
            <CustomAnimatedBox animation="fadeIn" className="animated-logo p-2 mb-2 mt-6">
                <Logo size={100} />
            </CustomAnimatedBox>

            {/* Vegetarian meals section */}
            <HorizontalScrollSection
                title="Vegetarian Meals"
                items={vegetarianMeals}
                onTitleClick={() => navigate("/meals?diets=VEGETARIAN")}
                renderItem={(meal) => <MealCardCompact meal={meal} />}
            />

            {/* Random meals section */}
            <HorizontalScrollSection
                title="All Meals – View More"
                items={allMeals}
                onTitleClick={() => navigate("/meals", { state: { filtersFromRedirect: {} } })}
                renderItem={(meal) => (
                    <CustomBox className="w-full max-w-[300px]">
                        <MealDetailCard
                            meal={meal}
                            viewMode="list"
                            hideAfterTitle
                        />
                    </CustomBox>
                )}
            />

            {/* Random diet plans section in compact mode */}
            <HorizontalScrollSection
                title="Explore Diet Plans"
                items={randomDiets}
                onTitleClick={() => navigate("/diets")}
                renderItem={(diet) => (
                    <CustomBox className="w-full max-w-[280px]">
                        {/* Only pass the minimal data into a compact view */}
                        <DietListCard diet={diet} compact />
                    </CustomBox>
                )}
            />
        </CustomBox>
    );
}

export default HomePage;
