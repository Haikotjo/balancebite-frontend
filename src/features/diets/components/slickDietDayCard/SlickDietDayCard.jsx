// SlickDietDayCard — slick styled day card for use inside SlickDietCard

import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useModal } from "../../../../context/useModal.js";
import MealModal from "../../../meals/components/mealModal/MealModal.jsx";
import {
    Flame,
    Dumbbell,
    Wheat,
    Droplet,
    Candy,
    BookOpen,
    Carrot,
    Tag,
    Clock,
    ChevronDown,
    ChevronUp,
    UtensilsCrossed,
    ArrowUpRight,
} from "lucide-react";
import { formatPreparationTime } from "../../../../utils/helpers/formatPreparationTime.js";

// ── Day placeholder texts ─────────────────────────────────────────────────────
const DAY_PLACEHOLDERS = [
    "Every journey starts with a first step — and a first meal. Set the tone!",
    "Day two. You showed up. That's already the hard part done.",
    "Three days in — the rhythm is starting to click.",
    "Halfway there. Keep the momentum going!",
    "Day five — almost at the finish line. Stay the course.",
    "One more day to go. Make it count!",
    "The final day of the cycle. You've earned every bite.",
];

function getDayPlaceholder(index) {
    if (index < DAY_PLACEHOLDERS.length) return DAY_PLACEHOLDERS[index];
    return `Day ${index + 1} — fuel up and keep going.`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatLabel(str) {
    return str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\B\w/g, (c) => c.toLowerCase());
}

function getFirstImage(meal) {
    const sorted = Array.isArray(meal?.images) && meal.images.length > 0
        ? [...meal.images].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
        : [];
    return sorted[0]?.imageUrl ?? meal?.imageUrls?.[0] ?? null;
}

// ── Day macro tiles ───────────────────────────────────────────────────────────
function DayMacroTile({ icon: Icon, value, label, color }) {
    if (value == null) return null;
    return (
        <div className="flex flex-1 flex-col items-center py-1">
            <Icon className={`h-3.5 w-3.5 ${color} mb-0.5`} />
            <span className="text-xs font-bold text-content">{Math.round(value)}</span>
            <span className="text-[9px] text-content/50">{label}</span>
        </div>
    );
}

DayMacroTile.propTypes = {
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number,
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

// ── Single meal row ───────────────────────────────────────────────────────────
function MealRow({ meal, viewMode }) {
    const [open, setOpen] = useState(false);
    const { openModal } = useModal();
    const imageSrc = getFirstImage(meal);

    const handleOpenMeal = (e) => {
        e.stopPropagation();
        if (viewMode === "modal" || viewMode === "page") {
            window.open(`/meal/${meal.id}`, "_blank", "noopener,noreferrer");
        } else {
            openModal(<MealModal meal={meal} />, "meal", { id: meal.id });
        }
    };

    const cuisineChips = (meal.cuisines ?? []).map((v) => ({
        label: v, color: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
    }));
    const dietChips = (meal.diets ?? []).map((v) => ({
        label: v, color: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
    }));
    const typeChips = (meal.mealTypes ?? []).map((v) => ({
        label: v, color: "border-fuchsia-400/40 text-fuchsia-300 bg-fuchsia-400/10",
    }));
    const allTags = [...cuisineChips, ...dietChips, ...typeChips];

    return (
        <div className="rounded-2xl border border-cyan-400/30 overflow-hidden">
            {/* ── Meal header row ── */}
            <div
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-content/[0.03] transition-colors"
                onClick={() => setOpen((v) => !v)}
            >
                {/* Thumbnail */}
                <div
                    className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-surface-sunken cursor-pointer"
                    onClick={handleOpenMeal}
                >
                    {imageSrc ? (
                        <img src={imageSrc} alt={meal.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <UtensilsCrossed className="h-5 w-5 text-content/30" />
                        </div>
                    )}
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content truncate">{meal.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {meal.preparationTime && (
                            <span className="flex items-center gap-1 text-[10px] text-content/50">
                                <Clock className="h-3 w-3" />
                                {formatPreparationTime(meal.preparationTime)}
                            </span>
                        )}
                        {meal.totalCalories != null && (
                            <span className="flex items-center gap-1 text-[10px] text-rose-400">
                                <Flame className="h-3 w-3" />
                                {Math.round(meal.totalCalories)} kcal
                            </span>
                        )}
                        {meal.totalProtein != null && (
                            <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                                <Dumbbell className="h-3 w-3" />
                                {Math.round(meal.totalProtein)}g
                            </span>
                        )}
                        {meal.totalCarbs != null && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                <Wheat className="h-3 w-3" />
                                {Math.round(meal.totalCarbs)}g
                            </span>
                        )}
                        {meal.totalFat != null && (
                            <span className="flex items-center gap-1 text-[10px] text-fuchsia-400">
                                <Droplet className="h-3 w-3" />
                                {Math.round(meal.totalFat)}g
                            </span>
                        )}
                    </div>
                </div>

                {/* Toggle */}
                <ChevronDown className={`h-4 w-4 text-content/40 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </div>

            {/* ── Expanded content ── */}
            <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-4 pt-3 space-y-5 bg-surface-sunken">

                    {/* Full macro row */}
                    <div>
                        <div className="flex items-stretch rounded-xl border border-content/8 bg-surface-sunken overflow-hidden">
                            <DayMacroTile icon={Flame}                 label="Kcal"    value={meal.totalCalories}  color="text-rose-400"    />
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <DayMacroTile icon={Dumbbell}              label="Protein"  value={meal.totalProtein}   color="text-cyan-500"    />
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <DayMacroTile icon={Wheat} label="Carbs"    value={meal.totalCarbs}     color="text-emerald-500" />
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <DayMacroTile icon={Droplet}               label="Fat"      value={meal.totalFat}       color="text-fuchsia-500" />
                        </div>
                        {meal.totalSugars != null && (
                            <div className="mt-2 flex gap-2">
                                <div className="flex items-center gap-1.5 rounded-full border border-content/8 bg-surface-sunken px-2.5 py-1">
                                    <Candy className="h-3 w-3 text-pink-400" />
                                    <span className="text-[11px] text-content/70">
                                        Sugars: <span className="font-semibold text-content">{Math.round(meal.totalSugars)}</span>g
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {meal.mealDescription && (
                        <div className="relative rounded-xl border border-violet-400/35 bg-violet-400/[0.09] px-3 pb-3 pt-4">
                            <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 border border-violet-400/30">
                                <BookOpen className="h-2.5 w-2.5 text-violet-400" />
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-violet-400">Description</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <BookOpen className="h-4 w-4 shrink-0 text-violet-400/70 mt-0.5" />
                                <p className="text-xs leading-relaxed text-content/80 italic">{meal.mealDescription}</p>
                            </div>
                        </div>
                    )}

                    {/* Ingredients */}
                    {meal.mealIngredients?.length > 0 && (
                        <div className="relative rounded-xl border border-emerald-400/35 bg-emerald-400/[0.09] px-3 pb-3 pt-4">
                            <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 border border-emerald-400/30">
                                <Carrot className="h-2.5 w-2.5 text-emerald-400" />
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400">Ingredients</span>
                                <span className="text-[9px] font-semibold text-emerald-400/70">{meal.mealIngredients.length}</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Carrot className="h-4 w-4 shrink-0 text-emerald-400/70 mt-0.5" />
                                <div className="flex flex-wrap gap-1">
                                    {meal.mealIngredients.map((ing, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full border border-border bg-surface-sunken px-2 py-0.5 text-[10px] text-content/80"
                                        >
                                            {ing.foodItemName ?? ing.foodItem?.name} — {ing.quantity}g
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <div className="relative rounded-xl border border-amber-400/35 bg-amber-400/[0.09] px-3 pb-3 pt-4">
                            <div className="absolute -top-2.5 left-3 flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 border border-amber-400/30">
                                <Tag className="h-2.5 w-2.5 text-amber-400" />
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400">Tags</span>
                            </div>
                            <div className="flex gap-2 items-start">
                                <Tag className="h-4 w-4 shrink-0 text-amber-400/70 mt-0.5" />
                                <div className="flex flex-wrap gap-1.5">
                                    {allTags.map(({ label, color }, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${color}`}
                                        >
                                            {formatLabel(label)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View meal button */}
                    <div className="flex justify-end pt-1">
                        <button
                            type="button"
                            onClick={handleOpenMeal}
                            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-md hover:shadow-primary/25"
                        >
                            View meal
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

MealRow.propTypes = {
    meal: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        mealDescription: PropTypes.string,
        preparationTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        totalCalories: PropTypes.number,
        totalProtein: PropTypes.number,
        totalCarbs: PropTypes.number,
        totalFat: PropTypes.number,
        totalSugars: PropTypes.number,
        mealIngredients: PropTypes.array,
        mealTypes: PropTypes.array,
        cuisines: PropTypes.array,
        diets: PropTypes.array,
        images: PropTypes.array,
        imageUrls: PropTypes.array,
    }).isRequired,
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
};

// ── Main component ────────────────────────────────────────────────────────────
export default function SlickDietDayCard({ day, viewMode = "list", index = 0 }) {
    const [showDesc, setShowDesc] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const descRef = useRef(null);

    useEffect(() => {
        const el = descRef.current;
        if (!el) return;
        setIsClamped(el.scrollHeight > el.clientHeight);
    }, [day.dietDayDescription]);

    const hasDescription = Boolean(day.dietDayDescription);
    const placeholder = getDayPlaceholder(index);

    return (
        <div className="rounded-2xl border border-content/10 bg-surface overflow-hidden mb-4">

            {/* ── Day header ── */}
            <div className="px-4 pt-4 pb-3">
                <h3 className="text-base font-bold text-content">{day.dayLabel}</h3>
            </div>

            {/* ── Day macro strip ── */}
            <div className="flex items-stretch border-y border-border/40">
                <DayMacroTile icon={Flame}                 label="Kcal"    value={day.totalCalories} color="text-rose-400"    />
                <div className="w-px self-stretch bg-border shrink-0" />
                <DayMacroTile icon={Dumbbell}              label="Protein"  value={day.totalProtein}  color="text-cyan-500"    />
                <div className="w-px self-stretch bg-border shrink-0" />
                <DayMacroTile icon={Wheat} label="Carbs"    value={day.totalCarbs}    color="text-emerald-500" />
                <div className="w-px self-stretch bg-border shrink-0" />
                <DayMacroTile icon={Droplet}               label="Fat"      value={day.totalFat}      color="text-fuchsia-500" />
            </div>

            {/* Sugars pill */}
            {day.totalSugars != null && (
                <div className="px-4 pt-2 pb-0 flex gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-content/8 bg-surface-sunken px-2.5 py-1">
                        <Candy className="h-3 w-3 text-pink-400" />
                        <span className="text-[11px] text-content/70">
                            Sugars: <span className="font-semibold text-content">{Math.round(day.totalSugars)}</span>g
                        </span>
                    </div>
                </div>
            )}

            <div className="px-4 pb-4 pt-6 space-y-6">
                {/* ── Day description ── */}
                <div className="relative rounded-2xl border border-violet-400/35 bg-violet-400/[0.09] px-4 pb-4 pt-5">
                    <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 border border-violet-400/30">
                        <BookOpen className="h-3 w-3 text-violet-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Day description</span>
                    </div>
                    <div className="flex gap-3 items-start">
                        <BookOpen className="h-5 w-5 shrink-0 text-violet-400/70 mt-0.5" />
                        {hasDescription ? (
                            <div className="flex-1">
                                <p
                                    ref={descRef}
                                    className={`text-sm leading-relaxed text-content/75 italic ${showDesc ? "" : "line-clamp-2"}`}
                                >
                                    {day.dietDayDescription}
                                </p>
                                {(isClamped || showDesc) && (
                                    <button
                                        type="button"
                                        onClick={() => setShowDesc((v) => !v)}
                                        className="mt-1 flex items-center gap-1 text-[10px] text-content/40 hover:text-primary transition-colors"
                                    >
                                        {showDesc
                                            ? <><ChevronUp className="h-3 w-3" /> Show less</>
                                            : <><ChevronDown className="h-3 w-3" /> Show more</>
                                        }
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed text-content/40 italic">{placeholder}</p>
                        )}
                    </div>
                </div>

                {/* ── Meals ── */}
                {day.meals?.length > 0 ? (
                    <div className="relative rounded-2xl border border-orange-400/35 bg-orange-400/[0.09] px-4 pb-4 pt-5 space-y-2">
                        <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 border border-orange-400/30">
                            <UtensilsCrossed className="h-3 w-3 text-orange-400" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">Meals</span>
                            <span className="text-[10px] font-semibold text-orange-400/70">{day.meals.length}</span>
                        </div>
                        {day.meals.map((meal, i) => (
                            <MealRow key={meal.id ?? i} meal={meal} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-content/40 text-sm py-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span>No meals planned for this day</span>
                    </div>
                )}
            </div>
        </div>
    );
}

SlickDietDayCard.propTypes = {
    day: PropTypes.shape({
        dayLabel: PropTypes.string,
        dietDayDescription: PropTypes.string,
        totalCalories: PropTypes.number,
        totalProtein: PropTypes.number,
        totalCarbs: PropTypes.number,
        totalFat: PropTypes.number,
        totalSugars: PropTypes.number,
        meals: PropTypes.array,
    }).isRequired,
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
    index: PropTypes.number,
};
