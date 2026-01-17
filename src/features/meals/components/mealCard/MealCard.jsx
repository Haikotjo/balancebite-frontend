// src/features/meals/components/mealCard/MealCard.jsx

import PropTypes from "prop-types";
import {useContext, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    ChartBar,
    ScrollText,
    Tags,
    BookOpen,
    Flashlight,
    Boxes,
    MessageSquareWarning
} from "lucide-react";

import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";
import MealCardImageSectionFull from "../mealCardImageSectionFull/MealCardImageSectionFull.jsx";
import MealCardMediaSection from "../MealCardMediaSection/MealCardMediaSection.jsx";
import MealCardJumpLink from "../mealCardJumpLink/MealCardJumpLink.jsx";
import MealCardJumpLinks from "../mealCardJumpLinks/MealCardJumpLinks.jsx";
import MealCardSection from "../mealCardSection/MealCardSection.jsx";
import MealShareForm from "../mealshareform/MealShareForm.jsx";
import FoodItemCard from "../../../fooditem/components/foodItemCard/FoodItemCard.jsx";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";

import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import { scrollToRefWithOffset } from "../../utils/helpers/scrollToRefWithOffset.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import MealCardExpandableDescription from "../mealCardExpandableDescription/ExpandableDescription.jsx";
import {useModal} from "../../../../context/useModal.js";
import MealModal from "../mealModal/MealModal.jsx";

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
    const { openModal } = useModal();

    const isCreator = String(user?.id) === String(meal?.createdBy?.id);
    const isDietitian = Array.isArray(user?.roles) && user.roles.includes("DIETITIAN");
    const canShare = isCreator && isDietitian && !disableActions;

    const prepTextRef = useRef(null);
    const prepVideoRef = useRef(null);
    const ingredientsRef = useRef(null);
    const ingredientsShortRef = useRef(null);
    const nutrientsRef = useRef(null);
    const tagsRef = useRef(null);

    const [showDescription, setShowDescription] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    const isListView = viewMode === "list";
    const isExpanded = !isListView || showDescription;
    const hasAnyVideo = Boolean(meal?.preparationVideoUrl || meal?.videoUrl);
    const hasTags = (meal.cuisines?.length > 0 || meal.diets?.length > 0 || meal.mealTypes?.length > 0);
    const hasIngredients = meal?.mealIngredients?.length > 0;
    const hasPreparation = Boolean(meal?.mealPreparation);

    const toggleSection = (section) => {
        setActiveSection(prev => prev === section ? null : section);
    };

    const handleFilterRedirect = (category, value) => {
        const categoryMap = { mealTypes: "mealTypes", diets: "diets", cuisines: "cuisines" };
        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(meal);
    const macros = buildMacrosObject(meal, calculatedMacros);

    const ingredientFoodItems = useMemo(() => {
        const arr = Array.isArray(meal?.mealIngredients) ? meal.mealIngredients : [];
        return Array.from(new Map(arr.map(mi => mi?.foodItem).filter(fi => fi?.id).map(fi => [fi.id, fi])).values());
    }, [meal?.mealIngredients]);

    const toSafeLinkText = (url) => {
        try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
    };

    return (
        <CustomBox ref={cardRef} className="w-full flex flex-col items-center">
            <CustomBox
                className={`w-full bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
                    isPinned ? "border-yellow-500" : "border-border"
                }`}
            >
                <MealCardImageSectionFull
                    meal={meal}
                    viewMode={viewMode}
                    onClose={onClose}
                    disableActions={disableActions}
                    actionsAnchorRef={actionsAnchorRef}
                />

                <CustomBox className={`${isListView ? "px-2" : "px-6"} flex flex-col justify-between leading-normal w-full`}>
                    <CustomBox className="mb-4">

                        {!isListView && (
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
                        )}

                        {canShare && !isListView && (
                            <CustomBox className="mt-4">
                                <MealShareForm mealId={meal.id}/>
                            </CustomBox>
                        )}

                        {/* TOP GRID: Description (2/3) en Tags (1/3 op Page Desktop) */}
                        <CustomBox className={`grid grid-cols-1 ${!isListView ? "md:grid-cols-12" : ""} gap-4 items-start mb-4`}>
                            <CustomBox className={!isListView ? "md:col-span-8" : ""}>
                                <MealCardSection
                                    title={meal.name}
                                    subtitle="description"
                                    icon={BookOpen}
                                    className={isListView ? "" : "md:px-6"}
                                    onHeaderClick={isListView ? () => openModal(<MealModal meal={meal} mode="view" />) : undefined}
                                >
                                    {meal.mealDescription ? (
                                        <CustomBox
                                            onClick={isListView ? () => setShowDescription(!showDescription) : undefined}
                                            className={isListView ? "cursor-pointer" : ""}
                                        >
                                            <MealCardExpandableDescription
                                                description={meal.mealDescription}
                                                viewMode={viewMode}
                                                forceExpanded={isExpanded}
                                            />
                                        </CustomBox>
                                    ) : (
                                        <CustomBox className="flex items-center gap-2">
                                            <MessageSquareWarning size={24} className="text-primary" />
                                            <CustomTypography variant="small" className="italic">No description available</CustomTypography>
                                        </CustomBox>
                                    )}
                                </MealCardSection>
                            </CustomBox>

                            {/* Tags naast de beschrijving op Page Desktop */}
                            {!isListView && hasTags && (
                                <CustomBox className="hidden md:block md:col-span-4" ref={tagsRef}>
                                    <MealCardSection title="Tags" subtitle="cuisine, diet, type" icon={Tags}>
                                        <MealCardMealTags
                                            cuisines={meal.cuisines}
                                            diets={meal.diets}
                                            mealTypes={meal.mealTypes}
                                            onFilter={handleFilterRedirect}
                                            forceExpand
                                        />
                                    </MealCardSection>
                                </CustomBox>
                            )}
                        </CustomBox>

                        {/* ACCORDION TABS - Alleen in List View */}
                        {isListView && (
                            <CustomBox className="grid grid-cols-2 gap-2 mb-6 mt-2">
                                <CustomBox
                                    onClick={() => toggleSection('nutrients')}
                                    className={`transition-all rounded-xl border ${activeSection === 'nutrients' ? 'bg-primary/10 border-primary shadow-sm' : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]'}`}
                                >
                                    <MetricHeader title="Nutrients" subtitle="macros" icon={ChartBar} variant="meal" className="cursor-pointer p-1.5" />
                                </CustomBox>
                                {hasIngredients && (
                                    <CustomBox
                                        onClick={() => toggleSection('ingredients')}
                                        className={`transition-all rounded-xl border ${activeSection === 'ingredients' ? 'bg-primary/10 border-primary shadow-sm' : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]'}`}
                                    >
                                        <MetricHeader title="Items" subtitle="list" icon={ScrollText} variant="meal" className="cursor-pointer p-1.5" />
                                    </CustomBox>
                                )}
                                {hasPreparation && (
                                    <CustomBox
                                        onClick={() => toggleSection('prep')}
                                        className={`transition-all rounded-xl border ${activeSection === 'prep' ? 'bg-primary/10 border-primary shadow-sm' : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]'}`}
                                    >
                                        <MetricHeader title="Steps" subtitle="prep" icon={Flashlight} variant="meal" className="cursor-pointer p-1.5" />
                                    </CustomBox>
                                )}
                                {hasTags && (
                                    <CustomBox
                                        onClick={() => toggleSection('tags')}
                                        className={`transition-all rounded-xl border ${activeSection === 'tags' ? 'bg-primary/10 border-primary shadow-sm' : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]'}`}
                                    >
                                        <MetricHeader title="Tags" subtitle="filter" icon={Tags} variant="meal" className="cursor-pointer p-1.5" />
                                    </CustomBox>
                                )}
                                {hasAnyVideo && (
                                    <CustomBox
                                        onClick={() => toggleSection('media')}
                                        className={`transition-all rounded-xl border ${activeSection === 'media' ? 'bg-primary/10 border-primary shadow-sm' : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]'}`}
                                    >
                                        <MetricHeader title="Video" subtitle="media" icon={Boxes} variant="meal" className="cursor-pointer p-1.5" />
                                    </CustomBox>
                                )}
                            </CustomBox>
                        )}

                        {/* DYNAMISCHE CONTENT SECTIES */}
                        <CustomBox className="flex flex-col gap-4">

                            {/* TAGS (Alleen voor List view of Mobile page view onder de beschrijving) */}
                            {( (isListView && activeSection === 'tags') || (!isListView && hasTags) ) && (
                                <CustomBox className={`${!isListView ? "md:hidden" : "w-full"}`}>
                                    <MealCardSection title="Tags" icon={Tags}>
                                        <MealCardMealTags
                                            cuisines={meal.cuisines}
                                            diets={meal.diets}
                                            mealTypes={meal.mealTypes}
                                            onFilter={handleFilterRedirect}
                                            forceExpand
                                        />
                                    </MealCardSection>
                                </CustomBox>
                            )}

                            {/* NUTRIENTS & INGREDIENTS */}
                            {(!isListView || activeSection === 'nutrients' || activeSection === 'ingredients') && (
                                <CustomBox className={`${!isListView ? "grid grid-cols-1 md:grid-cols-2 gap-8 my-12" : "flex flex-col gap-4"}`}>
                                    {(!isListView || activeSection === 'nutrients') && (
                                        <MealCardSection ref={nutrientsRef} title="Nutrients" subtitle="Macros" icon={ChartBar}>
                                            <MealCardMacrosSection macros={macros}/>
                                        </MealCardSection>
                                    )}

                                    {(!isListView || activeSection === 'ingredients') && hasIngredients && (
                                        <MealCardSection title="Ingredients" icon={ScrollText}>
                                            <MealCardIngredients ingredients={meal.mealIngredients}/>
                                        </MealCardSection>
                                    )}
                                </CustomBox>
                            )}

                            {/* PREP & VIDEO */}
                            {(!isListView || activeSection === 'prep' || activeSection === 'media') && (
                                <CustomBox className={`${!isListView ? "grid grid-cols-1 md:grid-cols-2 gap-8 mt-12" : "flex flex-col gap-4"}`}>
                                    {(!isListView || activeSection === 'prep') && hasPreparation && (
                                        <MealCardSection ref={prepTextRef} title="Preparation" icon={Flashlight}>
                                            <CustomTypography className="italic whitespace-pre-wrap" variant="small">
                                                {meal.mealPreparation}
                                            </CustomTypography>
                                        </MealCardSection>
                                    )}
                                    {(!isListView || activeSection === 'media') && hasAnyVideo && (
                                        <CustomBox className="w-full p-4 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 shadow-xl">
                                            <MealCardMediaSection meal={meal} prepVideoRef={prepVideoRef}/>
                                        </CustomBox>
                                    )}
                                </CustomBox>
                            )}
                        </CustomBox>
                    </CustomBox>
                </CustomBox>

                {/* FOOTER - Alleen Page view */}
                {!isListView && (
                    <CustomBox className="px-6">
                        {meal?.sourceUrl && (
                            <CustomBox className="pb-2 flex justify-end items-center gap-1 mt-4">
                                <CustomTypography variant="xsmallCard">Recipe from:</CustomTypography>
                                <CustomLink href={meal.sourceUrl} title={meal.sourceUrl} truncate>
                                    <CustomTypography variant="xsmallCard" color="primary" italic>{toSafeLinkText(meal.sourceUrl)}</CustomTypography>
                                </CustomLink>
                            </CustomBox>
                        )}
                        {ingredientFoodItems.length > 0 && (
                            <CustomBox ref={ingredientsRef} className="w-full p-4 md:px-8 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 shadow-xl mb-6">
                                <MetricHeader title="Ingredients" subtitle="overview" icon={Boxes} variant="meal" />
                                <CustomDivider className="mb-8" />
                                <CustomBox className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                    {ingredientFoodItems.map((fi) => <FoodItemCard key={fi.id} item={fi} className="h-full"/>)}
                                </CustomBox>
                            </CustomBox>
                        )}
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
    cardRef: PropTypes.any,
    actionsAnchorRef: PropTypes.any,
};

export default MealCard;