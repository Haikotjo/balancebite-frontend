import { useNavigate } from "react-router-dom";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import Logo from "../../components/logo/Logo.jsx";
import HorizontalScrollSection from "../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import { useEffect, useState} from "react";
import Interceptor from "../../services/authInterceptor.js";
import MealCardCompact from "../../features/meals/components/mealCardCompact/MealCardCompact.jsx";
import MealDetailCard from "../../features/meals/components/mealCardLarge/MealDetailCard.jsx";

/**
 * HomePage
 */
function HomePage() {
    const navigate = useNavigate();
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);

    const fetchVegetarianMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = "/meals?page=0&size=100&diets=VEGETARIAN";
        try {
            const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
            return response.data.content || [];
        } catch (error) {
            console.error("❌ Failed to fetch vegetarian meals:", error);
            return [];
        }
    };

    const fetchAllMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = "/meals?page=0&size=100";
        try {
            const response = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
            return response.data.content || [];
        } catch (error) {
            console.error("❌ Failed to fetch all meals:", error);
            return [];
        }
    };

    useEffect(() => {
        const loadMeals = async () => {
            const vegetarian = await fetchVegetarianMeals();
            setVegetarianMeals(vegetarian.sort(() => 0.5 - Math.random()).slice(0, 12));

            const all = await fetchAllMeals();
            setAllMeals(all.sort(() => 0.5 - Math.random()).slice(0, 12));
        };
        loadMeals();
    }, []);

    return (
        <CustomBox className="flex flex-col items-center justify-center min-h-screen w-full max-w-full mx-auto px-2 text-center ">
            <CustomAnimatedBox animation="fadeIn" className="animated-logo p-2 mb-2 mt-6">
                <Logo size={100} />
            </CustomAnimatedBox>

            <HorizontalScrollSection
                title="Vegetarian Meals"
                items={vegetarianMeals}
                onTitleClick={() => navigate("/meals?diets=VEGETARIAN")}
                renderItem={(meal) => <MealCardCompact meal={meal} />}
            />

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
        </CustomBox>
    );
}

export default HomePage;
