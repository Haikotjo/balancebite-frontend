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

import { AuthContext } from "../../../../context/AuthContext.jsx";
import MealShareForm from "../mealshareform/MealShareForm.jsx";
import FoodItemCard from "../../../fooditem/components/foodItemCard/FoodItemCard.jsx";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import MealCardImageSectionFull from "../mealCardImageSectionFull/MealCardImageSectionFull.jsx";
import MealCardMediaSection from "../MealCardMediaSection/MealCardMediaSection.jsx";
import MealCardJumpLink from "../mealCardJumpLink/MealCardJumpLink.jsx";
import {scrollToRefWithOffset} from "../../utils/helpers/scrollToRefWithOffset.js";
import MealCardJumpLinks from "../mealCardJumpLinks/MealCardJumpLinks.jsx";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";
import MealCardSection from "../mealCardSection/MealCardSection.jsx";
import { ChartBar, ScrollText, Tags, BookOpen, Flashlight, Boxes, MessageSquareWarning   } from "lucide-react";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

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
    const hasAnyVideo = Boolean(meal?.preparationVideoUrl || meal?.videoUrl);


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
                className={`w-full bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
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
                <CustomBox className="px-6 flex flex-col justify-between leading-normal w-full">
                    <CustomBox className="mb-4">

                        <CustomBox className="mb-2 pl-4">
                            <MealCardJumpLinks
                                meal={meal}
                                onJumpToPreparation={() => scrollToRefWithOffset(prepTextRef)}
                                onJumpToPreparationVideo={() => scrollToRefWithOffset(prepVideoRef)}
                                onJumpToIngredients={() => scrollToRefWithOffset(ingredientsShortRef)}
                                onJumpToNutrients={() => scrollToRefWithOffset(nutrientsRef)}
                                onJumpToTags={() => scrollToRefWithOffset(tagsRef)}
                            />
                        </CustomBox>

                        {canShare && (
                            <CustomBox className="mt-4">
                                <MealShareForm mealId={meal.id}/>
                            </CustomBox>
                        )}


                        <CustomBox className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <CustomBox className="md:col-span-8">
                                <MealCardSection
                                    title={meal.name}
                                    subtitle="meal description"
                                    icon={BookOpen}
                                    className="md:px-6"
                                >
                                    {meal.mealDescription ? (
                                        <CustomTypography
                                            variant="small"
                                            className="italic break-words whitespace-pre-wrap break-all leading-relaxed"
                                        >
                                            {meal.mealDescription}
                                        </CustomTypography>
                                    ) : (
                                        <CustomBox className="flex items-center gap-2 ">
                                        <MessageSquareWarning   size={24} className="text-primary" />
                                        <CustomTypography
                                            variant="small"
                                            className="italic"
                                        >
                                            No description available for this meal
                                        </CustomTypography>
                            </CustomBox>
                                    )}
                                </MealCardSection>
                            </CustomBox>

                            <CustomBox className="hidden md:block md:col-span-4" ref={tagsRef}>
                                <MealCardSection
                                    title="Tags"
                                    subtitle="cuisine, diet, type"
                                    icon={Tags}
                                >
                                    {meal.cuisines?.length > 0 || meal.diets?.length > 0 || meal.mealTypes?.length > 0 ? (
                                        <MealCardMealTags
                                            cuisines={meal.cuisines}
                                            diets={meal.diets}
                                            mealTypes={meal.mealTypes}
                                            onFilter={
                                                disableActions ? () => {} : (category, value) => {
                                                    handleFilterRedirect(category, value);
                                                    if (viewMode === "page" && onClose) onClose?.();
                                                }
                                            }
                                            forceExpand
                                        />
                                    ) : (
                                        <CustomBox className="flex items-center gap-2 ">
                                            <MessageSquareWarning   size={24} className="text-primary" />
                                            <CustomTypography variant="small" className="italic">
                                                No tags added for this meal
                                            </CustomTypography>
                                        </CustomBox>
                                    )}
                                </MealCardSection>
                            </CustomBox>
                        </CustomBox>

                        <CustomBox ref={nutrientsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full my-12">

                            {/* Nutrients Card */}
                            <MealCardSection
                                ref={nutrientsRef}
                                title="Nutrients"
                                subtitle="Macro breakdown"
                                icon={ChartBar}
                            >
                                <CustomBox className="px-2 pb-2">
                                    <MealCardMacrosSection macros={macros}/>
                                </CustomBox>
                            </MealCardSection>

                            {/* Ingredients Card */}
                            <CustomBox ref={ingredientsShortRef} >
                            <MealCardSection
                                title="Ingredients"
                                subtitle="List"
                                icon={ScrollText}
                                className="flex flex-col"
                            >
                                <CustomBox className="w-full px-2">
                                    <MealCardIngredients ingredients={meal.mealIngredients}/>
                                </CustomBox>
                                <CustomBox className="mt-6 px-2">
                                    <MealCardJumpLink
                                        label="Ingredient overview"
                                        onClick={() => scrollToRefWithOffset(ingredientsRef)}
                                    />
                                </CustomBox>
                            </MealCardSection>
                            </CustomBox>
                        </CustomBox>


                        <CustomBox className="md:hidden md:col-span-4" ref={tagsRef}>
                            <MealCardSection
                                title="Tags"
                                subtitle="cuisine, diet, type"
                                icon={Tags}
                            >
                                {meal.cuisines?.length > 0 || meal.diets?.length > 0 || meal.mealTypes?.length > 0 ? (
                                    <MealCardMealTags
                                        cuisines={meal.cuisines}
                                        diets={meal.diets}
                                        mealTypes={meal.mealTypes}
                                        onFilter={
                                            disableActions ? () => {} : (category, value) => {
                                                handleFilterRedirect(category, value);
                                                if (viewMode === "page" && onClose) onClose?.();
                                            }
                                        }
                                        forceExpand
                                    />
                                ) : (
                                    <CustomBox className="flex items-center gap-2 py-2 ">
                                        <MessageSquareWarning   size={18} className="text-primary" />
                                        <CustomTypography variant="small" className="italic">
                                            No tags added for this meal
                                        </CustomTypography>
                                    </CustomBox>
                                )}
                            </MealCardSection>
                        </CustomBox>

                        <CustomBox ref={prepTextRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full mt-12">
                            {meal?.mealPreparation && (
                                <MealCardSection
                                    ref={prepTextRef}
                                    title="Preparation"
                                    subtitle="Detailed instructions"
                                    icon={Flashlight}
                                    className="md:px-8 "
                                >
                                    <CustomTypography
                                        className="italic whitespace-pre-wrap break-words"
                                        variant="small"
                                    >
                                        {meal.mealPreparation}
                                    </CustomTypography>
                                </MealCardSection>
                            )}
                            {hasAnyVideo && (
                                <CustomBox className="w-full p-4 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 dark:border-white/10 shadow-xl">
                                    <MealCardMediaSection meal={meal} prepVideoRef={prepVideoRef}/>
                                </CustomBox>
                            )}
                        </CustomBox>

                    </CustomBox>

                </CustomBox>
                {meal?.sourceUrl && (
                    <CustomBox className="pb-2 pr-2 flex justify-end items-center gap-1 mt-4">
                        <CustomTypography variant="xsmallCard">
                            Recipe from:
                        </CustomTypography>
                        <CustomLink href={meal.sourceUrl} title={meal.sourceUrl} truncate>
                            <CustomTypography variant="xsmallCard" color="primary" italic>
                                {toSafeLinkText(meal.sourceUrl)}
                            </CustomTypography>
                        </CustomLink>
                    </CustomBox>
                )}
                {ingredientFoodItems.length > 0 && (
                    <CustomBox ref={ingredientsRef} className="w-full p-4 md:px-8 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 dark:border-white/10 shadow-xl">
                        <MetricHeader
                            title="Ingredients"
                            subtitle="overview"
                            icon={Boxes}
                            variant="meal"
                        />
                        <CustomDivider className="mb-8"></CustomDivider>

                        <CustomBox className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {ingredientFoodItems.map((fi) => (
                                <FoodItemCard key={fi.id} item={fi} className="h-full"/>
                            ))}
                        </CustomBox>
                    </CustomBox>
                )}
            </CustomBox>
        </CustomBox>
    );
};

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onClose: PropTypes.func,
    isPinned: PropTypes.bool,
    disableActions: PropTypes.bool,
    cardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({current: PropTypes.any})]),
    actionsAnchorRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.any}),
    ]),
};

export default MealCard;
