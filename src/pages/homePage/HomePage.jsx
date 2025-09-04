import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomAnimatedBox from "../../components/layout/CustomAnimatedBox.jsx";
import Logo from "../../components/logo/Logo.jsx";
import HorizontalScrollSection from "../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import MealCardCompact from "../../features/meals/components/mealCardCompact/MealCardCompact.jsx";
import MealDetailCard from "../../features/meals/components/mealCardLarge/MealDetailCard.jsx";
import DietListCard from "../../features/diets/components/dietListCard/DietListCard.jsx";
import Interceptor from "../../services/authInterceptor.js";
import { UserDietsContext } from "../../context/UserDietContext.jsx";
import {getAllStickyItems} from "../../services/apiService.js";
import fetchStickyItemDetails from "../../utils/helpers/fetchStickyItemDetails.js";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";
import PageWrapper from "../../components/layout/PageWrapper.jsx";

function HomePage() {
    const navigate = useNavigate();
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [stickyItems, setStickyItems] = useState([]);
    const { userMeals, applyUserCopies } = useContext(UserMealsContext);

    const {
        diets,
        fetchDietsData,
        replaceDietInDiets,
        removeDietFromUserDiets,
    } = useContext(UserDietsContext);

    const fetchVegetarianMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const res = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}/meals?page=0&size=100&diets=VEGETARIAN`, { headers });
            return res.data.content || [];
        } catch (err) {
            console.error("❌ Failed to fetch vegetarian meals:", err);
            return [];
        }
    };

    const fetchAllMeals = async () => {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            const res = await Interceptor.get(`${import.meta.env.VITE_BASE_URL}/meals?page=0&size=100`, { headers });
            return res.data.content || [];
        } catch (err) {
            console.error("❌ Failed to fetch all meals:", err);
            return [];
        }
    };


    useEffect(() => {
        const loadStickyData = async () => {
            try {
                const rawStickyItems = await getAllStickyItems();
                const { meals, diets } = await fetchStickyItemDetails(rawStickyItems);

                // Voeg reference toe aan elk item
                const enriched = rawStickyItems.map((item) => {
                    const reference =
                        item.type === "MEAL"
                            ? meals.find((m) => m.id === item.referenceId)
                            : diets.find((d) => d.id === item.referenceId);

                    return { ...item, reference };
                });

                setStickyItems(enriched);
            } catch (err) {
                console.error("Failed to fetch sticky items:", err);
            }
        };

        loadStickyData();
    }, []);


    useEffect(() => {
        fetchDietsData();

        fetchVegetarianMeals().then(data => {
            const enriched = applyUserCopies(data, userMeals);
            setVegetarianMeals(enriched.sort(() => 0.5 - Math.random()).slice(0, 12));
        });

        fetchAllMeals().then(data => {
            const enriched = applyUserCopies(data, userMeals);
            setAllMeals(enriched.sort(() => 0.5 - Math.random()).slice(0, 12));
        });
    }, [fetchDietsData, userMeals]);


    return (
        <PageWrapper className="flex flex-col items-center justify-center text-center px-2">
            <CustomBox className="flex flex-col items-center w-full">
                <CustomAnimatedBox animation="fadeIn" className="animated-logo p-2 mb-2 mt-6">
                    <Logo size={100} />
                </CustomAnimatedBox>

                <HorizontalScrollSection
                    title="Pinned Items"
                    items={stickyItems}
                    onTitleClick={() => navigate("/pinned")}
                    renderItem={(item) => {
                        if (item.type === "MEAL") {
                            return (
                                <CustomBox className="w-full max-w-[300px]">
                                    <MealDetailCard
                                        meal={item.reference}
                                        viewMode="list"
                                        hideAfterTitle
                                        isPinned
                                    />
                                </CustomBox>
                            );
                        }
                        if (item.type === "DIET_PLAN") {
                            return (
                                <CustomBox className="w-full max-w-[280px]">
                                    <DietListCard diet={item.reference} compact isPinned />
                                </CustomBox>
                            );
                        }
                        return null;
                    }}
                />


                <HorizontalScrollSection
                    title="Vegetarian Meals"
                    items={vegetarianMeals}
                    onTitleClick={() => navigate("/meals?diets=VEGETARIAN")}
                    renderItem={(meal) => <MealCardCompact meal={meal}/>}
                />

                <HorizontalScrollSection
                    title="All Meals – View More"
                    items={allMeals}
                    onTitleClick={() => navigate("/meals", { state: { filtersFromRedirect: {} } })}
                    renderItem={(meal) => (
                        <CustomBox className="w-full max-w-[300px]">
                            <MealDetailCard meal={meal} viewMode="list" hideAfterTitle />
                        </CustomBox>
                    )}
                />

                <HorizontalScrollSection
                    title="Explore Diet Plans"
                    items={diets.slice(0, 6)}
                    onTitleClick={() => navigate("/diets")}
                    renderItem={(diet) => (
                        <CustomBox className="w-full max-w-[280px]">
                            <DietListCard
                                diet={diet}
                                compact={true}
                                onAdd={(newDiet) => replaceDietInDiets(diet.id, newDiet)}
                                onRemove={() => removeDietFromUserDiets(diet.id)}
                            />
                        </CustomBox>
                    )}
                />

            </CustomBox>
        </PageWrapper>
    );
}

export default HomePage;
