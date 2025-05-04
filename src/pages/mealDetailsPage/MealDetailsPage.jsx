
import { useParams } from "react-router-dom";

import MealDetailCard from "../../components/mealCardLarge/MealDetailCard.jsx";
import SubMenu from "../../components/submenu/SubMenu.jsx";
import CustomBox from "../../components/layout/CustomBox.jsx";
import CustomTypography from "../../components/layout/CustomTypography.jsx";
import useMealById from "../../hooks/useMealById.js";
import Spinner from "../../components/layout/Spinner.jsx";
import MealCard from "../../components/mealCard/MealCard.jsx";

const MealDetailsPage = () => {
    const { mealId } = useParams();
    const { meal, loading, error } = useMealById(mealId);

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
                <CustomTypography
                    className="text-2xl font-bold text-center mt-10 text-error"
                >
                    Meal not found
                </CustomTypography>
            </>
        );
    }


    return (
        <CustomBox className="max-w-screen-xl mx-auto mt-4 px-4">
            <CustomBox className="my-10">
                <SubMenu isDetailPage/>
            </CustomBox>

            {/* Alleen tonen op small screens */}
            <CustomBox className="block md:hidden justify-center">
                <MealDetailCard
                    meal={meal}
                    viewMode="page"
                />
            </CustomBox>

            {/* Alleen tonen op medium en groter */}
            <CustomBox className="hidden md:flex justify-center">
                <MealCard
                    meal={meal}
                />
            </CustomBox>

        </CustomBox>

    );
};

export default MealDetailsPage;
