import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {useContext} from "react";
import MealCardImageSection from "../mealCardImageSection/MealCardImageSection.jsx";
import MealCardExpandableDescription from "../mealCardExpandableDescription/ExpandableDescription.jsx";
import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import ExpandableTitle from "../mealCardexpandableTitle/ExpandableTitle.jsx";
import MealCardMacrosCompact from "../mealCardMacrosCompact/MealCardMacrosCompact.jsx";
import {calculateMacrosPer100g} from "../../utils/helpers/calculateMacrosPer100g.js";
import {buildMacrosObject} from "../../utils/helpers/buildMacrosObject.js";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";
import MealCardNutritionToggle from "../mealCardNutritionToggle/MealCardNutritionToggle.jsx";
import {UserMealsContext} from "../../../../context/UserMealsContext.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

const MealDetailCard = ({ meal, viewMode = "page", isPinned = false }) => {

    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;
    const showUpdateButton = userMeals.some((m) => m.id === meal.id);
    const navigate = useNavigate();

    const isPage = viewMode === "page";
    const isListItem = viewMode === "list";

    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const shouldHideContent = isListItem;

    const handleFilterRedirect = (category, value) => {

        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(mealToRender);
    const macros = buildMacrosObject(meal, calculatedMacros);

    return (
        <CustomCard isPinned={isPinned} className="flex w-full box-border">

            {/* Image Section */}

                <MealCardImageSection
                    meal={mealToRender}
                    showUpdateButton={showUpdateButton}
                    viewMode={viewMode}
                />

            {/* Details Section */}

            <CustomBox className="p-4">

                {/* Title Section */}
                <ExpandableTitle
                    title={mealToRender.name}
                    mealId={String(mealToRender.id)}
                    viewMode={viewMode}
                />

                {isPage && (
                <CustomDivider className="my-6" />
                )}
                {isListItem && (
                    <>
                        <CustomDivider className="my-2" />
                    <CustomBox className="my-3 px-7">
                        <MealCardMacrosCompact macros={macros} />
                    </CustomBox>


                        <MealCardMealTags
                            cuisines={mealToRender.cuisines}
                            diets={mealToRender.diets}
                            mealTypes={mealToRender.mealTypes}
                            onFilter={handleFilterRedirect}
                            viewMode={viewMode}
                        />
                        <CustomDivider className="my-4" />
                    </>
                )}

                {/* Description Section */}
                            <MealCardExpandableDescription
                                description={mealToRender.mealDescription}
                                viewMode={viewMode}
                            />


                {!shouldHideContent && (
                    <>
                        <CustomDivider className="my-6" />

                        {/* Ingredients Section */}
                        <MealCardIngredients ingredients={mealToRender.mealIngredients} />
                        <CustomDivider className="my-6" />

                        {/* MealTags Section*/}
                        {!isListItem && (
                            <CustomBox className="px-2 py-1 mt-2">
                                <MealCardMealTags
                                    cuisines={mealToRender.cuisines}
                                    diets={mealToRender.diets}
                                    mealTypes={mealToRender.mealTypes}
                                    onFilter={handleFilterRedirect}
                                    forceExpand
                                    viewMode={viewMode}
                                />
                            </CustomBox>
                        )}
                        <CustomDivider className="my-6" />

                        {/* Nutrition Section */}
                        <MealCardNutritionToggle
                            macros={macros}
                            viewMode={viewMode}
                        />

                    </>
                )}
            </CustomBox>

        </CustomCard>

    );
};

MealDetailCard.propTypes = {
    meal: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]),
    onMealClick: PropTypes.func,
    isPinned: PropTypes.bool,
};

export default MealDetailCard;
