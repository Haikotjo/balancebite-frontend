// src/features/meals/components/mealCard/MealCard.jsx

import PropTypes from "prop-types";
import {useContext, useMemo, useRef} from "react";
import { useNavigate } from "react-router-dom";

import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";

import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import MealShareForm from "../mealshareform/MealShareForm.jsx";
import FoodItemCard from "../../../fooditem/components/foodItemCard/FoodItemCard.jsx";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import MealCardImageSectionFull from "../mealCardImageSectionFull/MealCardImageSectionFull.jsx";
import MealCardMediaSection from "../MealCardMediaSection/MealCardMediaSection.jsx";
import MealCardJumpLink from "../mealCardJumpLink/MealCardJumpLink.jsx";
import {scrollToRefWithOffset} from "../../utils/helpers/scrollToRefWithOffset.js";
import MealCardJumpLinks from "../mealCardJumpLinks/MealCardJumpLinks.jsx";

const useAuth = () => useContext(AuthContext);

const MealCard = ({
                      meal,
                      viewMode = "page",
                      onClose,
                      isPinned = false,
                      disableActions = false,
                      cardRef,
                      actionsAnchorRef,
                  }) => {
    const navigate = useNavigate();

    const { user } = useAuth();
    const isCreator = String(user?.id) === String(meal?.createdBy?.id);
    const isDietitian = Array.isArray(user?.roles) && user.roles.includes("DIETITIAN");

    const canShare = isCreator && isDietitian && !disableActions;

    const prepTextRef = useRef(null);
    const prepVideoRef = useRef(null);
    const ingredientsRef = useRef(null);
    const ingredientsShortRef = useRef(null);
    const nutrientsRef = useRef(null);
    const tagsRef = useRef(null);


    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const handleFilterRedirect = (category, value) => {
        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(meal);
    const macros = buildMacrosObject(meal, calculatedMacros);

    const ingredientFoodItems = useMemo(() => {
        const arr = Array.isArray(meal?.mealIngredients) ? meal.mealIngredients : [];

        const foodItems = arr
            .map((mi) => mi?.foodItem)
            .filter((fi) => fi && fi.id != null);

        const uniqueById = new Map();
        foodItems.forEach((fi) => {
            if (!uniqueById.has(fi.id)) uniqueById.set(fi.id, fi);
        });

        return Array.from(uniqueById.values());
    }, [meal?.mealIngredients]);

    const priceLabel =
        typeof meal.mealPrice === "number" ? `€ ${meal.mealPrice.toFixed(2)}` : null;

    const toSafeLinkText = (url) => {
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./, "");
        } catch {
            return url;
        }
    };

    return (
        <CustomBox ref={cardRef} className="w-full flex flex-col items-center">
            <CustomBox
                className={`max-w-6xl w-full bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
                    isPinned ? "border-yellow-500" : "border-border"
                }`}
                role="region"
                aria-label="Meal card"
            >
                {/* Image section (ALWAYS on top, all breakpoints) */}
                <MealCardImageSectionFull
                    meal={meal}
                    viewMode={viewMode}
                    onClose={onClose}
                    disableActions={disableActions}
                    actionsAnchorRef={actionsAnchorRef}
                />

                {/* Content section (ALWAYS below image, all breakpoints) */}
                <CustomBox className="p-4 flex flex-col justify-between leading-normal w-full">
                    <CustomBox className="mb-4">
                        <CustomTypography className="text-4xl font-bold text-primary mb-2">
                            {meal.name}
                        </CustomTypography>

                        {priceLabel && (
                            <CustomBox className="mb-4">
                                <CustomTypography
                                    as="span"
                                    variant="xsmallCard"
                                    bold
                                    className="inline-flex justify-center rounded-full px-3 py-1
                             bg-black/55 backdrop-blur-sm text-white
                             border border-white"
                                >
                                    {priceLabel}
                                </CustomTypography>
                            </CustomBox>
                        )}

                        <MealCardJumpLinks
                            meal={meal}
                            onJumpToPreparation={() => scrollToRefWithOffset(prepTextRef)}
                            onJumpToPreparationVideo={() => scrollToRefWithOffset(prepVideoRef)}
                            onJumpToIngredients={() => scrollToRefWithOffset(ingredientsShortRef)}
                            onJumpToNutrients={() => scrollToRefWithOffset(nutrientsRef)}
                            onJumpToTags={() => scrollToRefWithOffset(tagsRef)}
                        />
                        <CustomDivider className="my-6" />

                        {canShare && (
                            <CustomBox className="mt-4">
                                <MealShareForm mealId={meal.id} />
                            </CustomBox>
                        )}

                        <CustomTypography variant="h4" bold className="my-2">
                            Meal Description :
                        </CustomTypography>
                        <CustomTypography variant="small" className="italic break-words whitespace-pre-wrap break-all">
                            {meal.mealDescription}
                        </CustomTypography>
                        <CustomDivider className="my-6" />

                        <CustomBox ref={nutrientsRef}>
                            <CustomTypography variant="h4" bold>
                                Nutrients :
                            </CustomTypography>
                            <MealCardMacrosSection macros={macros} />
                        </CustomBox>

                        <CustomDivider className="my-6" />

                        <CustomBox ref={ingredientsShortRef}>
                            <MealCardIngredients ingredients={meal.mealIngredients} />
                        </CustomBox>
                        <CustomBox className="mt-1">
                            <MealCardJumpLink
                                label="      Ingredient overview"
                                onClick={() => scrollToRefWithOffset(ingredientsRef)}
                            />
                        </CustomBox>

                        <CustomDivider className="my-6" />

                        <CustomTypography variant="h4" bold>
                            Tags :
                        </CustomTypography>
                        <CustomBox
                            ref={tagsRef}
                            className={[
                                "flex px-2 py-1 mt-2",
                                disableActions ? "pointer-events-none opacity-60" : "",
                            ].join(" ")}
                            aria-disabled={disableActions}
                        >

                            <MealCardMealTags
                                cuisines={meal.cuisines}
                                diets={meal.diets}
                                mealTypes={meal.mealTypes}
                                onFilter={
                                    disableActions
                                        ? () => {}
                                        : (category, value) => {
                                            handleFilterRedirect(category, value);
                                            if (viewMode === "page" && onClose) onClose?.();
                                        }
                                }
                                forceExpand
                            />
                        </CustomBox>

                        <CustomDivider className="my-6" />

                        {meal?.mealPreparation && (
                            <CustomBox ref={prepTextRef}>
                                <CustomTypography variant="h4" bold className="my-2 mt-4">
                                    Preparation :
                                </CustomTypography>

                                <CustomTypography className="italic whitespace-pre-wrap break-all" variant="small">
                                    {meal.mealPreparation}
                                </CustomTypography>
                            </CustomBox>
                        )}

                    </CustomBox>
                </CustomBox>
                {meal?.sourceUrl && (
                    <CustomLink href={meal.sourceUrl} title={meal.sourceUrl} truncate className="pb-2 pl-2">
                        {toSafeLinkText(meal.sourceUrl)}
                    </CustomLink>
                )}
            </CustomBox>

            <MealCardMediaSection meal={meal} prepVideoRef={prepVideoRef} />

            {ingredientFoodItems.length > 0 && (
                <CustomBox className="max-w-6xl w-full p-4 mt-4" ref={ingredientsRef}>

                    <CustomTypography as="h3" variant="h3" className="mb-4">
                        Ingredients overview
                    </CustomTypography>

                    <CustomBox className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {ingredientFoodItems.map((fi) => (
                            <FoodItemCard key={fi.id} item={fi} className="h-full" />
                        ))}
                    </CustomBox>
                </CustomBox>
            )}
        </CustomBox>
    );
};

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onClose: PropTypes.func,
    isPinned: PropTypes.bool,
    disableActions: PropTypes.bool,
    cardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
    actionsAnchorRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
};

export default MealCard;
