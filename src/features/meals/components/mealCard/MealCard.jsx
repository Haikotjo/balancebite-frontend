// src/features/meals/components/mealCard/MealCard.jsx

/**
 * MealCard
 *
 * Purpose:
 * - Displays a full meal card with image, overlays, macros, ingredients and tags.
 * - Can be used in multiple contexts: page, list, or modal.
 *
 * Preview/Lock mode:
 * - When `disableActions` is true (e.g., modal preview), *all interactive actions*
 *   must be non-clickable:
 *   - Action buttons (Eat/Delete/Update/etc.) inside MealCardActionButtons
 *   - Clickable tags via MealCardMealTags (onFilter navigation)
 * - This file enforces the lock without requiring changes to child components by:
 *   1) Wrapping action buttons in a container that applies `pointer-events: none`
 *   2) Guarding the `onFilter` handler to become a no-op
 *   3) Lowering opacity for visual feedback and setting `aria-disabled`
 *
 * Props:
 * - meal:            The meal object (required)
 * - viewMode:        "page" | "list" | "modal" (default: "page")
 * - onClose:         Optional close handler used in modal/page transitions
 * - isPinned:        Whether to show pinned styling
 * - disableActions:  When true, disables all interactive actions in the card
 *
 * Notes:
 * - We keep the guard logic *local* to this component so no other file needs to change.
 * - If you later want per-button disabled styles, you can still pass `disableActions`
 *   down to child components, but it is not required for the lock to work.
 */

import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";

import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import MealShareForm from "../mealshareform/MealShareForm.jsx";

const useAuth = () => useContext(AuthContext);

/**
 * Component definition
 */
const MealCard = ({
                      meal,
                      viewMode = "page",
                      onClose,
                      isPinned = false,
                      disableActions = false,
                  }) => {
    // Derive image and navigation
    const imageSrc = getImageSrc(meal);
    const navigate = useNavigate();

    // Current user / role checks
    const { user } = useAuth();
    const isCreator = String(user?.id) === String(meal?.createdBy?.id);
    const isDietitian = Array.isArray(user?.roles) && user.roles.includes("DIETITIAN");

    /**
     * Sharing is only allowed when:
     * - user is creator AND dietitian
     * - actions are not disabled (preview lock blocks it)
     */
    const canShare = isCreator && isDietitian && !disableActions;

    // Map for building filter query params
    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    /**
     * Handle tag filter redirect.
     * When `disableActions` is true, this is guarded at callsite to avoid navigation.
     */
    const handleFilterRedirect = (category, value) => {
        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    // Compute macros
    const calculatedMacros = calculateMacrosPer100g(meal);
    const macros = buildMacrosObject(meal, calculatedMacros);

    // Debugging (keep if useful during integration)
    console.log("MealCard.disableActions =", disableActions);

    return (
        <CustomBox
            className={`max-w-4xl w-full lg:flex bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
                isPinned ? "border-yellow-500" : "border-border"
            }`}
            role="region"
            aria-label="Meal card"
        >
            {/* Left: Image section with top/bottom overlays */}
            <CustomBox className="h-48 lg:h-auto lg:w-[50%] flex-none relative">
                {/* Meal image */}
                <CustomImage src={imageSrc} alt={meal.name} className="w-full h-full object-cover" />

                {/* Top overlay: timer + action buttons */}
                <CustomBox
                    className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()} // prevent bubbling to parent containers
                >
                    <CustomBox className="absolute inset-0 rounded-md z-0" />
                    <CustomBox className="flex items-center justify-between w-full z-10">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}

                        {/**
                         * Action buttons are wrapped in a container that:
                         * - Applies pointer-events: none when locked, so clicks do nothing
                         * - Reduces opacity for visual feedback
                         * - Marks the region as aria-disabled for accessibility
                         */}
                        <CustomBox
                            className={disableActions ? "pointer-events-none opacity-60" : ""}
                            aria-disabled={disableActions}
                        >
                            <MealCardActionButtons
                                meal={meal}
                                showUpdateButton={true}
                                viewMode={viewMode}
                                onClose={onClose}
                                // Note: we do NOT need to pass disableActions; the wrapper already blocks clicks.
                                // If you want per-button disabled styles, you can still pass it down later.
                            />
                        </CustomBox>
                    </CustomBox>
                </CustomBox>

                {/* Bottom overlay: compact info strip */}
                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem" />
                </CustomBox>
            </CustomBox>

            {/* Right: Content section */}
            <CustomBox className="p-4 flex flex-col justify-between leading-normal">
                <CustomBox className="mb-4">
                    <CustomTypography className="text-4xl font-bold text-primary mb-2">
                        {meal.name}
                    </CustomTypography>

                    <CustomDivider className="my-6" />

                    {/* Optional share form (creator + dietitian only, and not in locked state) */}
                    {canShare && (
                        <CustomBox className="mt-4">
                            <MealShareForm mealId={meal.id} />
                        </CustomBox>
                    )}

                    <CustomTypography className=" italic">{meal.mealDescription}</CustomTypography>
                    <CustomDivider className="my-6" />

                    <MealCardIngredients ingredients={meal.mealIngredients} />
                    <CustomDivider className="my-6" />

                    <MealCardMacrosSection macros={macros} />
                    <CustomDivider className="my-6" />

                    {/**
                     * Tags row:
                     * - We lock interactions by:
                     *   a) wrapping in `pointer-events-none` when disableActions = true
                     *   b) guarding the onFilter handler to a no-op in lock state
                     */}
                    <CustomBox
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
                                    ? () => {} // No-op while locked
                                    : (category, value) => {
                                        handleFilterRedirect(category, value);
                                        if (viewMode === "page" && onClose) onClose?.();
                                    }
                            }
                            forceExpand
                        />
                    </CustomBox>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

MealCard.propTypes = {
    /** The meal data to render */
    meal: PropTypes.object.isRequired,
    /** Visual/behavioral mode of the card */
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    /** Optional close handler (used when navigation should also close a parent modal) */
    onClose: PropTypes.func,
    /** Whether to display the card with a pinned border highlight */
    isPinned: PropTypes.bool,
    /** When true, all interactive actions in this card are disabled (used for preview/lock) */
    disableActions: PropTypes.bool,
};

export default MealCard;
