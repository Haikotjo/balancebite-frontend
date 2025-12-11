import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {useContext, useMemo, useState} from "react";

import MealCardImageSection from "../mealCardImageSection/MealCardImageSection.jsx";
import MealCardExpandableDescription from "../mealCardExpandableDescription/ExpandableDescription.jsx";
import ExpandableTitle from "../mealCardexpandableTitle/ExpandableTitle.jsx";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";

import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import HorizontalScrollSection from "../../../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import { ExternalLink } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

const useAuth = () => useContext(AuthContext);

const MealDetailCard = ({ meal, viewMode = "page", isPinned = false }) => {
    // Resolve meal as before
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find((m) => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;

    const navigate = useNavigate();
    const role = mealToRender.createdBy?.roles?.[0]?.roleName?.toUpperCase();
    const { user } = useAuth();
    const isCreator = String(user?.id) === String(mealToRender?.createdBy?.id);
    const isDietitian = Array.isArray(user?.roles) && user.roles.includes("DIETITIAN");
    const isAdmin = Array.isArray(user?.roles) && user.roles.includes("ADMIN");
    const canShare = isCreator && (isDietitian || isAdmin);
    const [infoOpen, setInfoOpen] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);

    const isListItem = viewMode === "list";

    // Format price once
    const formattedPrice = useMemo(() => {
        const v = mealToRender?.mealPrice;
        if (typeof v !== "number" || Number.isNaN(v)) return null;
        return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
    }, [mealToRender?.mealPrice]);

    // Collect ingredient thumbnails (unique, defined)
    const ingredientThumbs = useMemo(() => {
        const arr = Array.isArray(mealToRender?.mealIngredients) ? mealToRender.mealIngredients : [];
        const urls = arr
            .map((mi) => mi?.foodItem?.imageUrl)
            .filter((u) => typeof u === "string" && u.length > 0);
        // De-duplicate
        return [...new Set(urls)];
    }, [mealToRender?.mealIngredients]);

    // Macros
    const calculatedMacros = calculateMacrosPer100g(mealToRender);
    const macros = buildMacrosObject(meal, calculatedMacros);

    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const handleFilterRedirect = (category, value) => {
        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const showUpdateButton = userMeals.some((m) => m.id === meal.id);

    return (
        <CustomCard isPinned={isPinned} createdByRole={role} className="flex w-full box-border">
            {/* Left column: main image + horizontal thumbnails */}
            <CustomBox className="flex flex-col">
                <MealCardImageSection
                    meal={mealToRender}
                    showUpdateButton={showUpdateButton}
                    viewMode={viewMode}
                    isPinned={isPinned}
                    priceLabel={formattedPrice}
                    macros={macros}
                />

            </CustomBox>

            {/* Right column: details */}
            <CustomBox className="p-4 flex-1">
                <CustomBox className="mb-2">
                    {/* Title + price row */}
                    <CustomBox className="flex items-start justify-between gap-3">
                        <CustomBox className="flex items-center gap-2">
                            <ExpandableTitle
                                title={mealToRender.name}
                                mealId={String(mealToRender.id)}
                                viewMode={viewMode}
                            />

                            <CustomLink
                                href={`/meal/${mealToRender.id}`}
                                ariaLabel="Open new window"
                                title="Open new window"
                                target="_blank"
                                rel="noopener noreferrer"
                                rightIcon={<ExternalLink className="w-3 h-3" aria-hidden="true" />}
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary"
                            >
                            </CustomLink>
                        </CustomBox>


                    </CustomBox>

                </CustomBox>

                <CustomDivider className="mb-2" />

                {/* Description */}
                <MealCardExpandableDescription
                    description={mealToRender.mealDescription}
                    viewMode={viewMode}
                    forceExpanded={isListItem && showMoreInfo}
                />


                {/*{canShare && <MealShareForm mealId={mealToRender.id} />}*/}


                {isListItem && (
                    <>
                        {/* Toggle */}
                        <CustomBox className={`mt-4 ${showMoreInfo ? "mb-4" : "mb-0"} w-full flex justify-center`}>
                            <CustomIconButton
                                icon={showMoreInfo ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-primary" />}
                                onClick={() => setShowMoreInfo(v => !v)}
                                size={28}
                                bgColor="bg-transparent hover:bg-primary/10"
                                className="border border-primary/60 hover:border-primary text-primary rounded-xl focus:outline-none"
                                disableScale
                            />

                        </CustomBox>

                        {/* Verborgen content pas tonen bij expand */}
                        {showMoreInfo && (
                            <>

                                <MealCardMealTags
                                    cuisines={mealToRender.cuisines}
                                    diets={mealToRender.diets}
                                    mealTypes={mealToRender.mealTypes}
                                    onFilter={handleFilterRedirect}
                                    viewMode={viewMode}
                                    size="small"
                                />

                                <CustomDivider className="my-4" />

                                {ingredientThumbs.length > 0 && (
                                    <HorizontalScrollSection
                                        items={ingredientThumbs}
                                        className="mt-1 mb-0"
                                        renderItem={(src) => (
                                            <img
                                                src={src}
                                                alt="Ingredient"
                                                className="h-16 w-16 rounded-md object-cover border border-borderLight dark:border-borderDark"
                                                loading="lazy"
                                                draggable={false}
                                            />
                                        )}
                                    />
                                )}
                            </>
                        )}
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
