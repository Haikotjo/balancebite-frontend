// SlickMealCard — immersive image card with expandable info panel
// Used alternating with MealCard in MealList

import { useState, useContext, useMemo, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Flame,
    Dumbbell,
    ChartColumnIncreasing,
    Droplet,
    Wallet,
    Clock,
    ChevronDown,
    ChevronUp,
    ArrowUpRight,
    Pin,
    UtensilsCrossed,
    Users,
    UserPen,
    BookOpen,
    Carrot,
    ChefHat,
    PlayCircle,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Apple,
    Cherry,
    Beef,
    Banana,
} from "lucide-react";

import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import SlickMealCardActions from "./SlickMealCardActions.jsx";
import FoodItemCard from "../../../fooditem/components/foodItemCard/FoodItemCard.jsx";
import { formatPrice } from "../../utils/helpers/formatPrice.js";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import { useModal } from "../../../../context/useModal.js";
import MealModal from "../mealModal/MealModal.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";

const BG_FOOD_ICONS = [
    { Icon: Apple,  className: "top-3   left-6   rotate-12"  },
    { Icon: Cherry, className: "top-8   right-10 -rotate-6"  },
    { Icon: Banana, className: "top-1/3 left-3   rotate-45"  },
    { Icon: Beef,   className: "top-2/3 left-10  -rotate-6"  },
    { Icon: Carrot, className: "bottom-1/4 right-1/4 -rotate-20"},
];

function formatLabel(str) {
    return str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\B\w/g, (c) => c.toLowerCase());
}

export default function SlickMealCard({ meal, isPinned = false, initialExpanded = false, viewMode = "list", scrollContainerRef }) {
    const isFullView = viewMode === "modal" || viewMode === "page";
    const [expanded, setExpanded] = useState(initialExpanded);
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const [showAllChips, setShowAllChips] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showFloatingActions, setShowFloatingActions] = useState(false);
    const [floatingPos, setFloatingPos] = useState({ top: 8, left: 8 });
    const actionsAnchorRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (!isFullView) return;
        const anchorEl = actionsAnchorRef.current;
        const scrollEl = scrollContainerRef?.current ?? null;
        if (!anchorEl) return;

        const updatePos = () => {
            if (scrollEl) {
                const root = scrollEl.getBoundingClientRect();
                setFloatingPos({ top: root.top + 8, left: root.left + 8 });
            } else {
                // page mode: position relative to the card itself
                const card = cardRef.current;
                if (!card) return;
                const rect = card.getBoundingClientRect();
                setFloatingPos({ top: Math.max(rect.top + 8, 8), left: rect.left + 8 });
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => { setShowFloatingActions(!entry.isIntersecting); updatePos(); },
            { root: scrollEl, threshold: 0 }
        );
        observer.observe(anchorEl);

        const scrollTarget = scrollEl || window;
        scrollTarget.addEventListener("scroll", updatePos, { passive: true });
        window.addEventListener("resize", updatePos);

        return () => {
            observer.disconnect();
            scrollTarget.removeEventListener("scroll", updatePos);
            window.removeEventListener("resize", updatePos);
        };
    }, [isFullView, scrollContainerRef]);

    const carouselItems = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];
        if (arr.length > 0) {
            return [...arr]
                .sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0))
                .map((img) => img?.imageUrl?.trim())
                .filter(Boolean);
        }
        return (Array.isArray(meal?.imageUrls) ? meal.imageUrls : [])
            .map((u) => (u ?? "").trim())
            .filter(Boolean);
    }, [meal?.images, meal?.imageUrls]);

    const activeImageSrc = carouselItems.length > 0
        ? carouselItems[Math.min(activeImageIndex, carouselItems.length - 1)]
        : getImageSrc(meal);

    const prevImage = (e) => { e.stopPropagation(); setActiveImageIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length); };
    const nextImage = (e) => { e.stopPropagation(); setActiveImageIndex((i) => (i + 1) % carouselItems.length); };
    const navigate = useNavigate();
    const location = useLocation();
    const { openModal } = useModal();
    const { setFilters, setPage } = useContext(UserMealsContext);

    const handleCreatorClick = (e) => {
        e.stopPropagation();
        if (!meal?.createdBy?.id) return;
        const filters = { creatorId: meal.createdBy.id, creatorUserName: meal.createdBy.userName };
        if (location.pathname !== "/meals") {
            navigate("/meals", { state: { filtersFromRedirect: filters } });
        } else {
            setFilters(filters);
            setPage(1);
        }
    };

    const defaultChips = [
        ...(meal?.cuisines?.slice(0, 1).map((v) => ({ label: v, color: "border-cyan-400/50 text-cyan-300 bg-cyan-400/10" })) || []),
        ...(meal?.diets?.slice(0, 1).map((v) => ({ label: v, color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10" })) || []),
        ...(meal?.mealTypes?.slice(0, 1).map((v) => ({ label: v, color: "border-fuchsia-400/50 text-fuchsia-300 bg-fuchsia-400/10" })) || []),
    ];
    const allChips = [
        ...(meal?.cuisines?.map((v) => ({ label: v, color: "border-cyan-400/50 text-cyan-300 bg-cyan-400/10" })) || []),
        ...(meal?.diets?.map((v) => ({ label: v, color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10" })) || []),
        ...(meal?.mealTypes?.map((v) => ({ label: v, color: "border-fuchsia-400/50 text-fuchsia-300 bg-fuchsia-400/10" })) || []),
    ];
    const visibleChips = showAllChips ? allChips : defaultChips;
    const extraChipCount = allChips.length - defaultChips.length;

    const macros = buildMacrosObject(meal, calculateMacrosPer100g(meal));

    const allIngredients = meal?.mealIngredients || [];
    const topIngredients = showAllIngredients ? allIngredients : allIngredients.slice(0, 5);
    const extraCount = allIngredients.length - 5;

    const getIngredientLabel = (ing, full = false) => {
        const raw = ing?.foodItem?.name || ing?.name || "";
        const name = full ? raw : raw.replace(/\s*\(.*?\)\s*$/, "").trim();
        const qty = ing?.quantity;
        return qty ? `${name} · ${qty}g` : name;
    };

    const ingredientFoodItems = useMemo(() => {
        const arr = Array.isArray(meal?.mealIngredients) ? meal.mealIngredients : [];
        return Array.from(new Map(arr.map(mi => mi?.foodItem).filter(fi => fi?.id).map(fi => [fi.id, fi])).values());
    }, [meal?.mealIngredients]);

    const description = meal?.mealDescription || meal?.description;
    const hasDescription = Boolean(description);
    const hasPrice = meal?.mealPrice !== undefined && meal?.mealPrice !== null;
    const hasPreparation = Boolean(meal?.mealPreparation);

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/);
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
        const vimeo = url.match(/vimeo\.com\/(\d+)/);
        if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
        return url;
    };

    return (
        <div
            ref={cardRef}
            className={`
                rounded-[28px] border shadow-2xl bg-surface
                transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                ${isPinned ? "border-yellow-500/70" : "border-content/10"}
            `}
        >
            {/* Floating actions — stays within the modal's visible area */}
            {isFullView && showFloatingActions && (
                <div
                    className="fixed z-[2147483002] rounded-2xl border border-border bg-surface/90 backdrop-blur-sm shadow-xl p-2"
                    style={{ top: floatingPos.top, left: floatingPos.left }}
                >
                    <SlickMealCardActions meal={meal} isPinned={isPinned} viewMode={viewMode} />
                </div>
            )}

            {/* ── Image section ── */}
            <div className={`relative overflow-hidden rounded-t-[28px] ${isFullView ? "min-h-[420px]" : "min-h-[300px]"}`}>
                {/* Background: image + gradients */}
                <img
                    src={activeImageSrc}
                    alt={meal?.name || "Meal"}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Carousel nav */}
                {carouselItems.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 w-8 h-8 text-white hover:bg-black/60 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 w-8 h-8 text-white hover:bg-black/60 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                            {carouselItems.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                                    className={`rounded-full transition-all duration-300 ${i === activeImageIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/45 hover:bg-white/70"}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Content layer */}
                <div className="relative flex h-full min-h-[300px] flex-col px-3 pt-3 pb-0.5">

                    {/* Right badges — absolute so they don't affect chip/button flow */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        {isPinned && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/60 bg-yellow-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-300 backdrop-blur-sm">
                                <Pin className="h-3 w-3" />
                                Pinned
                            </span>
                        )}
                        {hasPrice && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/50 bg-orange-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-orange-300 backdrop-blur-sm">
                                <Wallet className="h-3 w-3" />
                                {formatPrice(meal.mealPrice)}
                            </span>
                        )}
                        {meal?.servings > 1 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/50 bg-sky-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300 backdrop-blur-sm">
                                <Users className="h-3 w-3" />
                                {meal.servings} serving{meal.servings !== 1 ? "s" : ""}
                            </span>
                        )}
                        {meal?.preparationTime && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                                <Clock className="h-3 w-3" />
                                {meal.preparationTime.replace("PT", "").toLowerCase()}
                            </span>
                        )}
                    </div>

                    {/* Row 1: chips */}
                    <div className="flex flex-wrap items-start gap-2 pr-24">
                        {visibleChips.map(({ label, color }, i) => (
                            <span
                                key={i}
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${color}`}
                            >
                                {formatLabel(label)}
                            </span>
                        ))}
                        {!showAllChips && extraChipCount > 0 && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setShowAllChips(true); }}
                                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                            >
                                +{extraChipCount}
                            </button>
                        )}
                        {showAllChips && allChips.length > defaultChips.length && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setShowAllChips(false); }}
                                className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                            >
                                <ChevronUp className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Row 2: action buttons always directly below chips */}
                    <div className="relative z-20 mt-2" ref={actionsAnchorRef}>
                        <SlickMealCardActions meal={meal} isPinned={isPinned} viewMode={viewMode} />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Row 3: title at bottom */}
                    {viewMode === "page" ? (
                        <h3 className="line-clamp-2 text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            {meal?.name || "Untitled meal"}
                        </h3>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openModal(<MealModal meal={meal} mode="view" />)}
                            className="text-left"
                        >
                            <h3 className="line-clamp-2 text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-opacity hover:opacity-80">
                                {meal?.name || "Untitled meal"}
                            </h3>
                        </button>
                    )}

                    {/* Creator + save count */}
                    {meal?.createdBy?.userName && (
                        <div className="mt-1 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleCreatorClick}
                                className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
                            >
                                <UserPen className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">{meal.createdBy.userName}</span>
                            </button>
                            {meal.isTemplate && meal.saveCount > 0 && (
                                <span className="flex items-center gap-1 text-white/85 text-xs">
                                    <Users className="h-3.5 w-3.5" />
                                    {meal.saveCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Macros — below image ── */}
            <div className={`relative px-3 ${isFullView ? "pt-2 pb-3" : "pt-1.5 pb-3"}`}>
                <div className={`flex items-center ${isFullView ? "mb-3" : ""}`}>
                    <MacroTile icon={Flame}                 value={macros.Calories.total} per100g={macros.Calories.per100g} color="text-rose-400"    compact={!isFullView} />
                    <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                    <MacroTile icon={Dumbbell}              value={macros.Protein.total}  per100g={macros.Protein.per100g}  color="text-cyan-500"    compact={!isFullView} />
                    <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                    <MacroTile icon={ChartColumnIncreasing} value={macros.Carbs.total}    per100g={macros.Carbs.per100g}    color="text-emerald-500" compact={!isFullView} />
                    <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                    <MacroTile icon={Droplet}               value={macros.Fats.total}     per100g={macros.Fats.per100g}     color="text-fuchsia-500" compact={!isFullView} />
                </div>
                {!isFullView && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-content transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                )}
            </div>

            {/* ── Expandable info panel (list mode) ── */}
            {!isFullView && <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="relative px-4 pb-4 pt-4 space-y-4 overflow-hidden">
                    {/* Decorative food icons */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                        {BG_FOOD_ICONS.map(({ Icon, className }, i) => (
                            <Icon key={i} className={`absolute h-14 w-14 text-content/[0.08] ${className}`} />
                        ))}
                    </div>

                    {/* Description */}
                    {hasDescription && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Description</span>
                            </div>
                            <div
                                className="flex gap-3 items-start cursor-pointer"
                                onClick={() => setShowFullDescription(v => !v)}
                            >
                                <BookOpen className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <p className={`text-sm leading-relaxed text-content/75 italic ${showFullDescription ? "" : "line-clamp-3"}`}>
                                    {description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Ingredients */}
                    {topIngredients.length > 0 && (
                        <div className="relative rounded-2xl border border-content/8 px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">
                                    Ingredients
                                </span>
                                <span className="text-[10px] font-semibold text-primary/60">
                                    {allIngredients.length}
                                </span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <Carrot className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <div
                                    className="flex flex-wrap gap-1.5 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); setShowAllIngredients(v => !v); }}
                                >
                                    {topIngredients.map((ing, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full border border-border bg-surface-sunken px-2.5 py-0.5 text-xs text-content/80"
                                        >
                                            {getIngredientLabel(ing, showAllIngredients)}
                                        </span>
                                    ))}
                                    {!showAllIngredients && extraCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setShowAllIngredients(true); }}
                                            className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
                                        >
                                            +{extraCount} more ({allIngredients.length} total)
                                        </button>
                                    )}
                                    {showAllIngredients && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setShowAllIngredients(false); }}
                                            className="rounded-full border border-border bg-surface-sunken px-2.5 py-0.5 text-xs text-content/50 transition-colors hover:text-content"
                                        >
                                            <ChevronUp className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preparation */}
                    {hasPreparation && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">
                                    Preparation
                                </span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <ChefHat className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <p className="text-sm leading-relaxed text-content/75 whitespace-pre-line">
                                    {meal.mealPreparation}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Fallback */}
                    {topIngredients.length === 0 && !hasDescription && (
                        <div className="flex items-center gap-2 text-content/40 text-sm">
                            <UtensilsCrossed className="h-4 w-4" />
                            <span>No details available</span>
                        </div>
                    )}

                    {/* Video */}
                    {meal?.videoUrl && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Video</span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <PlayCircle className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <div className="w-full aspect-video rounded-xl overflow-hidden">
                                    <iframe
                                        src={getEmbedUrl(meal.videoUrl)}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Meal video"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preparation video */}
                    {meal?.preparationVideoUrl && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Preparation video</span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <PlayCircle className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <div className="w-full aspect-video rounded-xl overflow-hidden">
                                    <iframe
                                        src={getEmbedUrl(meal.preparationVideoUrl)}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Preparation video"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Source URL */}
                    {meal?.sourceUrl && (
                        <a
                            href={meal.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs text-content/40 hover:text-primary transition-colors w-fit"
                        >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                                {(() => { try { return new URL(meal.sourceUrl).hostname.replace(/^www\./, ""); } catch { return meal.sourceUrl; } })()}
                            </span>
                        </a>
                    )}

                    {/* Navigate */}
                    <div className="flex justify-end pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(`/meal/${meal.id}`)}
                            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25"
                        >
                            View meal
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>}

            {/* ── Full view content (modal / page) ── */}
            {isFullView && (
                <div className="relative border-t border-border px-4 pb-4 pt-4 overflow-hidden">
                    {/* Background food icons */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                        {BG_FOOD_ICONS.map(({ Icon, className }, i) => (
                            <Icon key={i} className={`absolute h-14 w-14 text-content/[0.08] ${className}`} />
                        ))}
                    </div>

                    {/* Two-column grid on lg */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">

                        {/* Left: description + ingredients */}
                        <div className="space-y-4">
                            {hasDescription && (
                                <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Description</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <BookOpen className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                        <p className="text-sm leading-relaxed text-content/75 italic">{description}</p>
                                    </div>
                                </div>
                            )}

                            {allIngredients.length > 0 && (
                                <div className="relative rounded-2xl border border-content/8 px-4 pb-4 pt-5">
                                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Ingredients</span>
                                        <span className="text-[10px] font-semibold text-primary/60">{allIngredients.length}</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <Carrot className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                        <div className="flex flex-wrap gap-1.5">
                                            {allIngredients.map((ing, i) => (
                                                <span key={i} className="rounded-full border border-border bg-surface-sunken px-2.5 py-0.5 text-xs text-content/80">
                                                    {getIngredientLabel(ing, true)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: tags + preparation */}
                        <div className="space-y-4">
                            {allChips.length > 0 && (
                                <div className="relative rounded-2xl border border-content/8 px-4 pb-4 pt-5">
                                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {allChips.map(({ label, color }, i) => (
                                            <span key={i} className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${color}`}>
                                                {formatLabel(label)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasPreparation && (
                                <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
                                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Preparation</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <ChefHat className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                        <p className="text-sm leading-relaxed text-content/75 whitespace-pre-line">{meal.mealPreparation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Videos — full width */}
                    {meal?.videoUrl && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5 mt-4">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Video</span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <PlayCircle className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <div className="w-full aspect-video rounded-xl overflow-hidden">
                                    <iframe src={getEmbedUrl(meal.videoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Meal video" />
                                </div>
                            </div>
                        </div>
                    )}
                    {meal?.preparationVideoUrl && (
                        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5 mt-4">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Preparation video</span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <PlayCircle className="h-7 w-7 shrink-0 text-primary/60 mt-0.5" />
                                <div className="w-full aspect-video rounded-xl overflow-hidden">
                                    <iframe src={getEmbedUrl(meal.preparationVideoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Preparation video" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Source */}
                    <div className="flex items-center pt-4 mt-2">
                        {meal?.sourceUrl && (
                            <a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-content/40 hover:text-primary transition-colors">
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                <span>{(() => { try { return new URL(meal.sourceUrl).hostname.replace(/^www\./, ""); } catch { return meal.sourceUrl; } })()}</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ── Ingredient overview (modal / page) ── */}
            {isFullView && ingredientFoodItems.length > 0 && (
                <div className="relative mx-4 mb-4 rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-6 pt-5">
                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Ingredient overview</span>
                        <span className="text-[10px] font-semibold text-primary/60">{ingredientFoodItems.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ingredientFoodItems.map((fi) => (
                            <FoodItemCard key={fi.id} item={fi} className="h-full" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Compact macro tile ──────────────────────────────────────────────────────
function MacroTile({ icon: Icon, value, per100g, color, compact = false }) {
    return (
        <div className={`flex flex-1 items-center ${compact ? "gap-1.5 px-2 py-1" : "gap-2 px-2 py-2"}`}>
            <Icon className={`shrink-0 ${compact ? "h-4 w-4" : "h-6 w-6"} ${color}`} />
            <div className="flex flex-col">
                <span className={`font-bold leading-tight text-content ${compact ? "text-sm" : "text-sm"}`}>
                    {value !== undefined && value !== null ? Math.round(value) : "–"}
                </span>
                {per100g != null && (
                    <span className="text-[10px] leading-none text-content/40">
                        {per100g}/100g
                    </span>
                )}
            </div>
        </div>
    );
}

SlickMealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
    initialExpanded: PropTypes.bool,
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
    scrollContainerRef: PropTypes.shape({ current: PropTypes.any }),
};

MacroTile.propTypes = {
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number,
    per100g: PropTypes.number,
    color: PropTypes.string.isRequired,
    compact: PropTypes.bool,
};
