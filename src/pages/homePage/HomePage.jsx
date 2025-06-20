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
import MealModal from "../../features/meals/components/mealModal/MealModal.jsx";
import useIsSmallScreen from "../../hooks/useIsSmallScreen.js";
import DietModal from "../../features/diets/components/dietmodal/DietModal.jsx";

function HomePage() {
    const navigate = useNavigate();
    const [vegetarianMeals, setVegetarianMeals] = useState([]);
    const [allMeals, setAllMeals] = useState([]);
    const [stickyItems, setStickyItems] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const isSmallScreen = useIsSmallScreen();
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [showDietModal, setShowDietModal] = useState(false);


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

    const handleOpenModal = (meal) => {
        setSelectedMeal(meal);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setSelectedMeal(null);
        setShowModal(false);
    };

    const handleOpenDietModal = (diet) => {
        setSelectedDiet(diet);
        setShowDietModal(true);
    };

    const handleCloseDietModal = () => {
        setSelectedDiet(null);
        setShowDietModal(false);
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
        fetchVegetarianMeals().then(data =>
            setVegetarianMeals(data.sort(() => 0.5 - Math.random()).slice(0, 12))
        );
        fetchAllMeals().then(data =>
            setAllMeals(data.sort(() => 0.5 - Math.random()).slice(0, 12))
        );
    }, [fetchDietsData]);

    return (
        <CustomBox className="flex flex-col items-center justify-center min-h-screen w-full max-w-full mx-auto px-2 text-center ">
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
                                    onMealClick={isSmallScreen ? undefined : handleOpenModal}
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
                renderItem={(meal) => <MealCardCompact meal={meal} onMealClick={handleOpenModal}/>}
            />

            <HorizontalScrollSection
                title="All Meals – View More"
                items={allMeals}
                onTitleClick={() => navigate("/meals", { state: { filtersFromRedirect: {} } })}
                renderItem={(meal) => (
                    <CustomBox className="w-full max-w-[300px]">
                        <MealDetailCard meal={meal} viewMode="list" hideAfterTitle        onMealClick={handleOpenModal} />
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
                            compact
                            onClick={() => handleOpenDietModal(diet)}
                            onAdd={(newDiet) => replaceDietInDiets(diet.id, newDiet)}
                            onRemove={() => removeDietFromUserDiets(diet.id)}
                        />
                    </CustomBox>
                )}
            />


            <MealModal isOpen={showModal} onClose={handleCloseModal} meal={selectedMeal} />
            <DietModal isOpen={showDietModal} onClose={handleCloseDietModal} diet={selectedDiet} />

        </CustomBox>
    );
}

export default HomePage;
