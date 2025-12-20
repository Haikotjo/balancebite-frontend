import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import MealCard from "../../components/mealCard/MealCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import MealsSubMenu from "../../components/subMenu/MealsSubMenu.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import PageWrapper from "../../../../components/layout/PageWrapper.jsx";

const MealDetailsPage = () => {
    const { mealId } = useParams();
    const { getMealById } = useContext(UserMealsContext);

    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                setLoading(true);
                setMeal(null);
                setError(null);

                const result = await getMealById(mealId);
                if (result) setMeal(result);
                else setError("Meal not found");
            } catch (err) {
                console.error("Failed to fetch meal:", err);
                setError("Meal not found");
            } finally {
                setLoading(false);
            }
        };

        if (mealId) void fetchMeal();
    }, [mealId, getMealById]);

    if (loading) {
        return (
            <>
                <PageWrapper>
                    <CustomBox className="mb-4">
                        <MealsSubMenu isDetailPage />
                    </CustomBox>
                    <CustomBox className="flex justify-center pt-10">
                        <Spinner />
                    </CustomBox>
                </PageWrapper>
            </>
        );
    }

    if (error || !meal) {
        return (
            <PageWrapper>
                <CustomBox className="mb-4">
                    <MealsSubMenu isDetailPage />
                </CustomBox>
                <CustomTypography className="text-2xl font-bold text-center mt-10 text-error">
                    Meal not found
                </CustomTypography>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <CustomBox className="max-w-screen-xl mx-auto">
                <MealsSubMenu isDetailPage />

                <CustomBox className="flex justify-center mt-6">
                    <MealCard meal={meal} viewMode="page" />
                </CustomBox>
            </CustomBox>
        </PageWrapper>

    );
};

export default MealDetailsPage;
