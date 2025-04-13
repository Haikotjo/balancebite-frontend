import PropTypes from "prop-types";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { useNavigate } from "react-router-dom";
import {useContext, useState} from "react";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import ExpandableTitle from "../expandableTitle/ExpandableTitle.jsx";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import CustomCard from "../layout/CustomCard.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import clsx from "clsx";
import CustomDivider from "../layout/CustomDivider.jsx";
import MealCardImageSection from "../mealCardImageSection/MealCardImageSection.jsx";
import MealCardNutritionToggle from "../mealCardNutritionToggle/MealCardNutritionToggle.jsx";
import MealCardExpandableDescription from "../mealCardExpandableDescription/ExpandableDescription.jsx";
import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";

const MealDetailCard = ({ meal, isModal = false, onClose, isListItem = false, onOpenAsModal }) => {
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;
    const showUpdateButton = userMeals.some((m) => m.id === meal.id);
    const [showMacros, setShowMacros] = useState(!isListItem);

    const navigate = useNavigate();

    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const handleFilterRedirect = (category, value) => {
        if (isModal && onClose) {
            onClose();
        }

        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(mealToRender);
    const macros = buildMacrosObject(meal, calculatedMacros);

    return (
        <CustomCard
            className={clsx(
                "flex w-full box-border min-w-[300px]",
                isListItem ? "flex-col" : "flex-row",
                isModal ? "max-w-full h-full m-0 mt-0" : "max-w-[1000px] h-auto mx-auto mt-4"
            )}
        >

        {/* Image Section */}
            <CustomBox className={clsx(
                "relative w-full flex flex-col justify-start shrink-0",
                !isListItem && "md:w-1/2"
            )}>
                <MealCardImageSection
                    meal={mealToRender}
                    isListItem={isListItem}
                    showUpdateButton={showUpdateButton}
                    onOpenAsModal={onOpenAsModal}
                    variant="inline" // "inline" / "overlay"
                />
            </CustomBox>

            {/* Details Section */}
            <CustomBox className="flex flex-col flex-1 p-2">
                <CustomBox className="p-4">

                    {/* Title Section */}
                    <ExpandableTitle title={mealToRender.name} />
                <CustomDivider className="my-6" />

                    {/* Description Section */}
                <CustomBox className="mb-6">
                    <MealCardExpandableDescription
                        description={mealToRender.mealDescription}
                        isModal={isModal}
                    />
                    <CustomDivider className="my-6" />
                </CustomBox>



                    {/* Ingredients Section */}
                    <MealCardIngredients ingredients={mealToRender.mealIngredients} />
                    <CustomDivider className="my-6" />

                    {/* MealTags Section*/}
                    <CustomBox className="hidden md:flex px-2 py-1 mt-2">
                        <MealCardMealTags
                            cuisines={mealToRender.cuisines}
                            diets={mealToRender.diets}
                            mealTypes={mealToRender.mealTypes}
                            onFilter={handleFilterRedirect}
                            forceExpand
                        />
                    </CustomBox>
                    <CustomBox className="flex md:hidden">
                        <MealCardMealTags
                            cuisines={mealToRender.cuisines}
                            diets={mealToRender.diets}
                            mealTypes={mealToRender.mealTypes}
                            onFilter={handleFilterRedirect}
                        />
                    </CustomBox>
                    <CustomDivider className="my-6" />

                    {/* Nutrition Section */}
                        <MealCardNutritionToggle
                            macros={macros}
                            show={showMacros}
                            onToggle={() => setShowMacros((prev) => !prev)}
                            isModal={isModal}
                        />
                </CustomBox>

            </CustomBox>
        </CustomCard>
    );
};

MealDetailCard.propTypes = {
    meal: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    onClose: PropTypes.func,
    isListItem: PropTypes.bool,
    onOpenAsModal: PropTypes.func,
};

export default MealDetailCard;
