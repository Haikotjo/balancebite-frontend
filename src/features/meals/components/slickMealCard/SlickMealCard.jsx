// SlickMealCard — immersive image card with expandable info panel
// Used alternating with MealCard in MealList

import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import { getMealImage } from "../../../homepage/utils/helpers/imageHelpers.js";
import SlickMealCardActions from "./SlickMealCardActions.jsx";
import { formatPrice } from "../../utils/helpers/formatPrice.js";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import { useModal } from "../../../../context/useModal.js";
import MealModal from "../mealModal/MealModal.jsx";

function formatLabel(str) {
    return str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\B\w/g, (c) => c.toLowerCase());
}

export default function SlickMealCard({ meal, isPinned = false }) {
    const [expanded, setExpanded] = useState(false);
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const [showAllChips, setShowAllChips] = useState(false);
    const navigate = useNavigate();
    const { openModal } = useModal();

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

    const description = meal?.mealDescription || meal?.description;
    const hasDescription = Boolean(description);
    const hasPrice = meal?.mealPrice !== undefined && meal?.mealPrice !== null;

    return (
        <div
            className={`
                overflow-hidden rounded-[28px] border shadow-2xl bg-surface
                transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                ${isPinned ? "border-yellow-500/70" : "border-content/10"}
            `}
        >
            {/* ── Image section ── */}
            <div className="relative min-h-[300px] overflow-hidden">
                {/* Background: image + gradients */}
                <img
                    src={getMealImage(meal)}
                    alt={meal?.name || "Meal"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Content layer */}
                <div className="relative flex h-full min-h-[300px] flex-col p-3">

                    {/* Row 1: chips + right badges */}
                    <div className="flex flex-wrap items-start gap-2">
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
                        <div className="ml-auto flex flex-col items-end gap-1.5">
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
                            {meal?.preparationTime && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                                    <Clock className="h-3 w-3" />
                                    {meal.preparationTime.replace("PT", "").toLowerCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Row 2: action buttons below tags */}
                    <div className="mt-2">
                        <SlickMealCardActions meal={meal} isPinned={isPinned} />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Row 3: title at bottom */}
                    <button
                        type="button"
                        onClick={() => openModal(<MealModal meal={meal} mode="view" />)}
                        className="text-left"
                    >
                        <h3 className="line-clamp-2 text-lg font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-opacity hover:opacity-80">
                            {meal?.name || "Untitled meal"}
                        </h3>
                    </button>
                </div>
            </div>

            {/* ── Macros + toggle — below image ── */}
            <div className="px-4 pt-2 pb-3">

                {/* 4-col macro grid */}
                <div className="mb-3 grid grid-cols-4 gap-1 md:gap-2 lg:gap-4">
                    <MacroTile icon={Flame}                 value={macros.Calories.total} color="text-rose-400"    />
                    <MacroTile icon={Dumbbell}              value={macros.Protein.total}  color="text-cyan-500"    />
                    <MacroTile icon={ChartColumnIncreasing} value={macros.Carbs.total}    color="text-emerald-500" />
                    <MacroTile icon={Droplet}               value={macros.Fats.total}     color="text-fuchsia-500" />
                </div>

                {/* More info toggle */}
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="
                        flex w-full items-center justify-center gap-1.5 rounded-2xl
                        border border-border bg-surface-sunken py-2 text-sm font-medium
                        text-content/60 transition-all duration-200
                        hover:border-primary/40 hover:bg-primary/5 hover:text-primary
                    "
                >
                    {expanded ? "Minder info" : "Meer info"}
                    <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* ── Expandable info panel ── */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div className="border-t border-border px-4 pb-4 pt-4 space-y-4">

                    {/* Description */}
                    {hasDescription && (
                        <p className="text-sm leading-relaxed text-content/70 line-clamp-4">
                            {description}
                        </p>
                    )}

                    {/* Ingredients */}
                    {topIngredients.length > 0 && (
                        <div>
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-content/40">
                                Ingrediënten
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {topIngredients.map((ing, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full border border-border bg-surface-sunken px-2.5 py-0.5 text-xs text-content/80"
                                    >
                                        {ing?.foodItem?.name || ing?.name || ""}
                                    </span>
                                ))}
                                {!showAllIngredients && extraCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowAllIngredients(true); }}
                                        className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary transition-colors hover:bg-primary/20"
                                    >
                                        +{extraCount} meer
                                    </button>
                                )}
                                {showAllIngredients && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setShowAllIngredients(false); }}
                                        className="rounded-full border border-border bg-surface-sunken px-2.5 py-0.5 text-xs text-content/50 transition-colors hover:text-content"
                                    >
                                        Toon minder
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fallback */}
                    {topIngredients.length === 0 && !hasDescription && (
                        <div className="flex items-center gap-2 text-content/40 text-sm">
                            <UtensilsCrossed className="h-4 w-4" />
                            <span>Geen details beschikbaar</span>
                        </div>
                    )}

                    {/* Navigate */}
                    <div className="flex justify-end pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(`/meals/${meal.id}`)}
                            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25"
                        >
                            Bekijk recept
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Compact macro tile ──────────────────────────────────────────────────────
function MacroTile({ icon: Icon, value, color }) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-sunken py-2.5 px-1">
            <Icon className={`h-6 w-6 ${color}`} />
            <span className="text-sm font-bold text-content">
                {value !== undefined && value !== null ? Math.round(value) : "–"}
            </span>
        </div>
    );
}

SlickMealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    isPinned: PropTypes.bool,
};

MacroTile.propTypes = {
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number,
    color: PropTypes.string.isRequired,
};
