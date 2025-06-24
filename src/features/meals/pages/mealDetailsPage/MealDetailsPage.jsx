import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import MealDetailCard from "../../components/mealCardLarge/MealDetailCard.jsx";
import MealCard from "../../components/mealCard/MealCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import Spinner from "../../../../components/layout/Spinner.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import SubMenu from "../../components/subMenu/SubMenu.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";

const MealDetailsPage = () => {
    const { mealId } = useParams();
    const { getMealById } = useContext(UserMealsContext);

    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeal = async () => {
            setLoading(true);
            const result = await getMealById(mealId);
            if (result) {
                setMeal(result);
                setError(null);
            } else {
                setError("Meal not found");
            }
            setLoading(false);
        };

        if (mealId) {
            fetchMeal();
        }
    }, [mealId, getMealById]);

    if (loading) {
        return (
            <CustomBox className="flex justify-center mt-10">
                <Spinner />
            </CustomBox>
        );
    }

    if (error || !meal) {
        return (
            <>
                <CustomBox className="mb-4 mt-10">
                    <SubMenu isDetailPage />
                </CustomBox>
                <CustomTypography className="text-2xl font-bold text-center mt-10 text-error">
                    Meal not found
                </CustomTypography>
            </>
        );
    }

    return (
        <CustomBox className="pt-6 sm:pt-10 pb-20 sm:pb-10 px-4">
            <CustomBox className="max-w-screen-xl mx-auto">
                <SubMenu isDetailPage />
                <CustomBox className="block md:hidden justify-center">
                    <MealDetailCard meal={meal} viewMode="page" />
                </CustomBox>
                <CustomBox className="hidden md:flex justify-center">
                    <MealCard meal={meal} />
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

export default MealDetailsPage;
