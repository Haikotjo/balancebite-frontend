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
import {useContext, useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";

import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";

import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

import { AuthContext } from "../../../../context/AuthContext.jsx";
import MealShareForm from "../mealshareform/MealShareForm.jsx";
import FoodItemCard from "../../../fooditem/components/foodItemCard/FoodItemCard.jsx";
import MealCardMediaSection from "../MealCardMediaSection/MealCardMediaSection.jsx";
import MealImageCarousel from "../mealImageCarousel/MealImageCarousel.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import CustomLink from "../../../../components/layout/CustomLink.jsx";
import {toYoutubeEmbedUrl} from "../../utils/helpers/toYoutubeEmbedUrl.js";
import MealCardExpandableDescription from "../mealCardExpandableDescription/ExpandableDescription.jsx";

const useAuth = () => useContext(AuthContext);

/**
 * Component definition
 */
const MealCard = ({ meal, viewMode="page", onClose, isPinned=false, disableActions=false, cardRef, actionsAnchorRef }) => {

    // Derive image and navigation
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

    // Build unique food items from meal ingredients for the grid
    const ingredientFoodItems = useMemo(() => {
        const arr = Array.isArray(meal?.mealIngredients) ? meal.mealIngredients : [];

        const foodItems = arr
            .map((mi) => mi?.foodItem)
            .filter((fi) => fi && fi.id != null);

        // Deduplicate by id
        const uniqueById = new Map();
        foodItems.forEach((fi) => {
            if (!uniqueById.has(fi.id)) {
                uniqueById.set(fi.id, fi);
            }
        });

        return Array.from(uniqueById.values());
    }, [meal?.mealIngredients]);

    const images = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];
        if (arr.length > 0) {
            return [...arr]
                .sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0))
                .map((img) => img?.imageUrl?.trim())
                .filter(Boolean);
        }
        const urls = Array.isArray(meal?.imageUrls) ? meal.imageUrls : [];
        return urls.map((u) => (u ?? "").trim()).filter(Boolean);
    }, [meal?.images, meal?.imageUrls]);

    const primaryIndex = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];
        if (arr.length === 0) return 0;

        const sorted = [...arr].sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0));
        const idx = sorted.findIndex((img) => img?.primary && img?.imageUrl?.trim());
        return idx >= 0 ? idx : 0;
    }, [meal?.images]);

    const [activeImageIndex, setActiveImageIndex] = useState(primaryIndex);

    useEffect(() => {
        setActiveImageIndex(primaryIndex);
    }, [primaryIndex, meal?.id, images.length]);


    const priceLabel =
        typeof meal.mealPrice === "number"
            ? `€ ${meal.mealPrice.toFixed(2)}`
            : null;

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
                className={`max-w-6xl w-full lg:flex bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
                    isPinned ? "border-yellow-500" : "border-border"
                }`}
                role="region"
                aria-label="Meal card"
            >
                {/* Left: Image section with top/bottom overlays */}
                <CustomBox className="h-48 lg:h-auto lg:w-[50%] flex-none relative">
                    {/* Meal image */}
                    <MealImageCarousel
                        meal={meal}
                        alt={meal.name}
                        className="w-full h-full"
                        activeIndex={activeImageIndex}
                        onChangeIndex={setActiveImageIndex}
                        disableActions={disableActions}
                    />

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
                                <CustomBox
                                    ref={actionsAnchorRef}
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
                {/* Mobile/Tablet thumbnails above the name (hidden on lg+) */}
                {images.length > 1 && (
                    <CustomBox
                        className={`flex lg:hidden justify-between gap-4 overflow-x-auto m-2 mt-4 ${
                            disableActions ? "pointer-events-none opacity-60" : ""
                        }`}
                    >
                    {images.map((url, idx) => {
                            const isActive = idx === activeImageIndex;

                            return (
                                <CustomIconButton
                                    key={`${url}-${idx}`}
                                    icon={
                                        <CustomImage
                                            src={url}
                                            alt=""
                                            className={[
                                                "w-16 h-12 object-cover rounded-lg",
                                                isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                                            ].join(" ")}
                                        />
                                    }
                                    onClick={() => setActiveImageIndex(idx)}
                                    bgColor="bg-transparent"
                                    sizeClassName="w-16 h-12"
                                    disableScale
                                    useMotion={false}
                                    className={isActive ? "ring-2 ring-primary" : "ring-1 ring-border"}
                                />
                            );
                        })}
                    </CustomBox>
                )}

                <CustomBox className="p-4 flex flex-col justify-between leading-normal">
                    <CustomBox className="mb-4">
                        <CustomTypography className="text-4xl font-bold text-primary mb-2">
                            {meal.name}
                        </CustomTypography>

                        {/* Price pill under name */}
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

                        <CustomDivider className="my-6" />

                        {/* Optional share form (creator + dietitian only, and not in locked state) */}
                        {canShare && (
                            <CustomBox className="mt-4">
                                <MealShareForm mealId={meal.id} />
                            </CustomBox>
                        )}

                        <CustomTypography className="italic break-words whitespace-pre-wrap break-all">
                            {meal.mealDescription}
                        </CustomTypography>

                        <CustomDivider className="my-6" />

                        <MealCardIngredients ingredients={meal.mealIngredients} />
                        <CustomDivider className="my-6" />

                        <CustomTypography variant="h4" bold>
                            Nutrients
                        </CustomTypography>
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
                        {meal?.sourceUrl && (
                            <>
                                <CustomLink
                                    href={meal.sourceUrl}
                                    title={meal.sourceUrl}
                                    truncate
                                >
                                    {toSafeLinkText(meal.sourceUrl)}
                                </CustomLink>

                            </>
                        )}
                    </CustomBox>
                </CustomBox>
            </CustomBox>

            {(meal?.preparationVideoUrl || meal?.videoUrl) && (
                <CustomBox className="max-w-6xl w-full px-4 mt-12">
                    <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {meal?.preparationVideoUrl && (
                            <CustomBox className="w-full aspect-video rounded-xl overflow-hidden border border-border">
                                <iframe
                                    title="Preparation video"
                                    src={toYoutubeEmbedUrl(meal.preparationVideoUrl)}
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </CustomBox>
                        )}

                        {meal?.videoUrl && (
                            <CustomBox className="w-full aspect-video rounded-xl overflow-hidden border border-border">
                                <iframe
                                    title="Video"
                                    src={toYoutubeEmbedUrl(meal.videoUrl)}
                                    className="w-full h-full"
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            </CustomBox>
                        )}
                    </CustomBox>

                    {meal?.mealPreparation && (
                        <>
                            <CustomTypography variant="h4" bold className="my-12">
                                Preparation
                            </CustomTypography>

                            <CustomTypography className="whitespace-pre-wrap break-all">
                                {meal.mealPreparation}
                            </CustomTypography>

                        </>
                    )}
                </CustomBox>
            )}


            {/*<MealCardMediaSection meal={meal} />*/}

            {ingredientFoodItems.length > 0 && (
                <CustomBox className="max-w-6xl w-full p-4">
                    <CustomDivider className="my-6" />

                    <CustomTypography
                        as="h3"
                        variant="h3"
                        className="mb-4"
                    >
                        Ingredients overview
                    </CustomTypography>

                    <CustomBox className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {ingredientFoodItems.map((fi) => (
                            <FoodItemCard
                                key={fi.id}
                                item={fi}
                                className="h-full"
                            />
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

    // 🔧 ADD THESE
    cardRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
    actionsAnchorRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
};

export default MealCard;
