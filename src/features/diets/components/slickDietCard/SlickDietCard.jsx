// SlickDietCard — immersive image card with expandable info panel
// Mirrors SlickMealCard structure but for diet plans

import { useState, useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
    Flame,
    Dumbbell,
    Wheat,
    Droplet,
    Candy,
    ChevronDown,
    ChevronUp,
    ArrowUpRight,
    Pin,
    Users,
    UserPen,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Salad,
    Leaf,
    Heart,
} from "lucide-react";

import SlickDietCardActions from "./SlickDietCardActions.jsx";
import SlickDietDayCard from "../slickDietDayCard/SlickDietDayCard.jsx";
import DietModal from "../dietmodal/DietModal.jsx";
import InsightPanel from "../../../../components/insightPanel/InsightPanel.jsx";
import { getGenericDietInsight, getPersonalizedDietInsight } from "../../../../utils/helpers/nutritionInsightHelpers.js";
import { UserDietsContext } from "../../../../context/UserDietContext.jsx";
import { useModal } from "../../../../context/useModal.js";

// ── Inline MacroTile ──────────────────────────────────────────────────────────
function MacroTile({ icon: Icon, value, color, label }) {
    if (value == null) return null;
    return (
        <div className="flex flex-1 flex-col items-center py-2.5">
            <Icon className={`h-4 w-4 ${color} mb-0.5`} />
            <span className="text-sm font-bold text-content">
                {Math.round(value)}
            </span>
            {label && (
                <span className="text-[10px] text-content/50 mt-0.5">{label}</span>
            )}
        </div>
    );
}

MacroTile.propTypes = {
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number,
    color: PropTypes.string.isRequired,
    label: PropTypes.string,
};

// ── Decorative background icons ───────────────────────────────────────────────
const BG_DIET_ICONS = [
    { Icon: Salad,       className: "top-3   left-6   rotate-12"   },
    { Icon: CalendarDays,className: "top-8   right-10 -rotate-6"  },
    { Icon: Salad,       className: "top-1/3 left-3   rotate-45"   },
    { Icon: CalendarDays,className: "top-2/3 left-10  -rotate-6"  },
    { Icon: Salad,       className: "bottom-1/4 right-1/4 -rotate-20" },
];

function getDietPlaceholder(dayCount) {
    if (dayCount === 0) return "A blank canvas — no days planned yet. Every great diet starts somewhere.";
    if (dayCount === 1) return "A focused single-day plan. Sometimes one perfect day is all you need.";
    if (dayCount === 2) return `A compact ${dayCount}-day plan. Short, sharp, and straight to the point.`;
    if (dayCount === 3) return "Three days of intentional eating. A great way to reset and recharge.";
    if (dayCount === 7) return "A full week of structured nutrition — seven days to build a habit that sticks.";
    if (dayCount <= 5) return `A ${dayCount}-day plan built to keep things fresh without overwhelming you.`;
    if (dayCount <= 14) return `${dayCount} days of planned meals — enough variety to stay motivated and on track.`;
    if (dayCount <= 30) return `An ambitious ${dayCount}-day program. Consistency over this stretch can make a real difference.`;
    return `A ${dayCount}-day journey. That kind of commitment takes serious dedication — respect.`;
}

function formatLabel(str) {
    return str
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\B\w/g, (c) => c.toLowerCase());
}

export default function SlickDietCard({
    diet,
    isPinned = false,
    initialExpanded = false,
    viewMode = "list",
    scrollContainerRef,
}) {
    const isFullView = viewMode === "modal" || viewMode === "page";
    const [expanded, setExpanded] = useState(initialExpanded);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showAllChips, setShowAllChips] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showFloatingActions, setShowFloatingActions] = useState(false);
    const [floatingPos, setFloatingPos] = useState({ top: 8, left: 8 });
    const actionsAnchorRef = useRef(null);
    const cardRef = useRef(null);

    const { setCreatorIdFilter, setActiveOption } = useContext(UserDietsContext);
    const { openModal } = useModal();
    const navigate = useNavigate();

    // ── Floating action bar (modal / page) ────────────────────────────────────
    useEffect(() => {
        if (!isFullView) return;
        const anchorEl = actionsAnchorRef.current;
        const scrollEl = scrollContainerRef?.current ?? null;
        if (!anchorEl) return;

        const updatePos = () => {
            const isMobile = window.innerWidth < 768;
            const minLeft = isMobile ? 64 : 8;
            if (scrollEl) {
                const root = scrollEl.getBoundingClientRect();
                setFloatingPos({ top: root.top + 8, left: Math.max(root.left + 8, minLeft) });
            } else {
                const card = cardRef.current;
                if (!card) return;
                const rect = card.getBoundingClientRect();
                setFloatingPos({ top: Math.max(rect.top + 8, 8), left: Math.max(rect.left + 8, minLeft) });
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

    // ── Images: first image per meal across all diet days ────────────────────
    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60";

    const carouselItems = (diet.dietDays ?? []).flatMap((day) =>
        (day.meals ?? []).map((m) => {
            // images[] takes priority (sorted by orderIndex), then imageUrls[]
            const sorted = Array.isArray(m.images) && m.images.length > 0
                ? [...m.images].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                : [];
            return sorted[0]?.imageUrl ?? m.imageUrls?.[0] ?? null;
        }).filter(Boolean)
    );

    const activeImageSrc = carouselItems.length > 0
        ? carouselItems[Math.min(activeImageIndex, carouselItems.length - 1)]
        : FALLBACK_IMAGE;

    const prevImage = (e) => { e.stopPropagation(); setActiveImageIndex((i) => (i - 1 + carouselItems.length) % carouselItems.length); };
    const nextImage = (e) => { e.stopPropagation(); setActiveImageIndex((i) => (i + 1) % carouselItems.length); };

    // ── Chips from diet.diets array ───────────────────────────────────────────
    const allChips = (diet.diets ?? []).map((v) => ({
        label: v,
        color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
    }));
    const defaultChips = allChips.slice(0, 2);
    const visibleChips = showAllChips ? allChips : defaultChips;
    const extraChipCount = allChips.length - defaultChips.length;

    const hasDescription = Boolean(diet.dietDescription);
    const dayCount = diet.dietDays?.length ?? 0;

    const handleCreatorClick = (e) => {
        e.stopPropagation();
        if (!diet?.createdBy?.id) return;
        setCreatorIdFilter(diet.createdBy.id);
        setActiveOption("All Diets");
        if (!window.location.pathname.includes("/diets")) {
            navigate("/diets");
        }
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
                    className="fixed z-[2147483002] rounded-2xl border border-border bg-none dark:bg-surface/90 backdrop-blur-sm shadow-xl p-1"
                    style={{ top: floatingPos.top, left: floatingPos.left }}
                >
                    <SlickDietCardActions diet={diet} isPinned={isPinned} viewMode={viewMode} />
                </div>
            )}

            {/* ── Image section ── */}
            <div className={`relative overflow-hidden rounded-t-[28px] ${isFullView ? "min-h-[420px]" : "min-h-[300px]"}`}>

                {/* Background: collage in list mode, carousel in full view */}
                {isFullView ? (
                    /* ── Carousel (modal / page) ── */
                    <>
                        <img
                            src={activeImageSrc}
                            alt={diet?.name || "Diet"}
                            className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                        />
                        {carouselItems.length > 1 && (
                            <>
                                <button type="button" onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 w-8 h-8 text-white hover:bg-black/60 transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 w-8 h-8 text-white hover:bg-black/60 transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                    {carouselItems.map((_, i) => (
                                        <button key={i} type="button" onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                                            className={`rounded-full transition-all duration-300 ${i === activeImageIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/45 hover:bg-white/70"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    /* ── Collage (list mode) ── */
                    <div className="absolute inset-0 flex gap-0.5">
                        {carouselItems.length === 0 && (
                            <img src={FALLBACK_IMAGE} alt="Diet" className="h-full w-full object-cover" />
                        )}
                        {carouselItems.length === 1 && (
                            <img src={carouselItems[0]} alt="Diet" className="h-full w-full object-cover" />
                        )}
                        {carouselItems.length === 2 && (
                            <>
                                <img src={carouselItems[0]} alt="" className="h-full w-1/2 object-cover" />
                                <img src={carouselItems[1]} alt="" className="h-full w-1/2 object-cover" />
                            </>
                        )}
                        {carouselItems.length >= 3 && (
                            <>
                                {/* Left: one big image */}
                                <img src={carouselItems[0]} alt="" className="h-full w-3/5 object-cover" />
                                {/* Right: three stacked */}
                                <div className="flex flex-col gap-0.5 w-2/5">
                                    <img src={carouselItems[1]} alt="" className="h-1/3 w-full object-cover" />
                                    <img src={carouselItems[2] ?? carouselItems[1]} alt="" className="h-1/3 w-full object-cover" />
                                    <div className="relative h-1/3 w-full">
                                        <img src={carouselItems[3] ?? carouselItems[2]} alt="" className="h-full w-full object-cover" />
                                        {carouselItems.length > 4 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1px]">
                                                <span className="text-white font-bold text-xl drop-shadow">+{carouselItems.length - 4}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Content layer */}
                <div className="relative flex h-full min-h-[300px] flex-col px-3 pt-3 pb-0.5">

                    {/* Right badges */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        {isPinned && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/60 bg-yellow-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-yellow-300 backdrop-blur-sm">
                                <Pin className="h-3 w-3" />
                                Pinned
                            </span>
                        )}
                        {dayCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                                <CalendarDays className="h-3 w-3" />
                                {dayCount} day{dayCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {/* Row 1: diet-type chips */}
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

                    {/* Row 2: action buttons */}
                    <div className="relative z-20 mt-2" ref={actionsAnchorRef}>
                        <SlickDietCardActions diet={diet} isPinned={isPinned} viewMode={viewMode} />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Row 3: title at bottom */}
                    {isFullView ? (
                        <h3 className="line-clamp-2 text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            {diet?.name || "Untitled diet"}
                        </h3>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openModal(<DietModal diet={diet} isPinned={isPinned} />, "diet", { id: diet.id })}
                            className="text-left"
                        >
                            <h3 className="line-clamp-2 text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-opacity hover:opacity-80">
                                {diet?.name || "Untitled diet"}
                            </h3>
                        </button>
                    )}

                    {/* Creator + save count */}
                    {diet?.createdBy?.userName && (
                        <div className="mt-1 flex items-center justify-between mb-1">
                            <button
                                type="button"
                                onClick={handleCreatorClick}
                                className="flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
                            >
                                <UserPen className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">{diet.createdBy.userName}</span>
                            </button>
                            {diet.saveCount > 0 && (
                                <span className="flex items-center gap-1 text-white/85 text-xs">
                                    <Users className="h-3.5 w-3.5" />
                                    {diet.saveCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Daily averages — always visible, prominent ── */}
            <div className="px-4 pt-3 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-content/50 mb-2">
                    Daily averages — {dayCount}-day diet
                </p>
                <div className="flex items-stretch rounded-xl border border-content/8 bg-surface-sunken overflow-hidden">
                    <MacroTile icon={Flame}                 label="Kcal"    value={diet.avgCalories} color="text-rose-400"    />
                    <div className="w-px self-stretch bg-border shrink-0" />
                    <MacroTile icon={Dumbbell}              label="Protein"  value={diet.avgProtein}  color="text-cyan-500"    />
                    <div className="w-px self-stretch bg-border shrink-0" />
                    <MacroTile icon={Wheat} label="Carbs"    value={diet.avgCarbs}    color="text-emerald-500" />
                    <div className="w-px self-stretch bg-border shrink-0" />
                    <MacroTile icon={Droplet}               label="Fat"      value={diet.avgFat}      color="text-fuchsia-500" />
                </div>
                {diet.avgSugars != null && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 rounded-full border border-content/8 bg-surface-sunken px-2.5 py-1">
                            <Candy className="h-3 w-3 text-pink-400" />
                            <span className="text-[11px] text-content/70">
                                Sugars: <span className="font-semibold text-content">{Math.round(diet.avgSugars)}</span>g
                            </span>
                        </div>
                    </div>
                )}
                {(diet.flagHighFiber === true || diet.flagLowSugar === true || diet.flagLowUnhealthyFats === true) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {diet.flagHighFiber === true && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                <Leaf className="h-2.5 w-2.5" /> High fiber
                            </span>
                        )}
                        {diet.flagLowSugar === true && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/50 bg-sky-400/10 px-2 py-0.5 text-[10px] font-semibold text-sky-400">
                                <Candy className="h-2.5 w-2.5" /> Low sugar
                            </span>
                        )}
                        {diet.flagLowUnhealthyFats === true && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                                <Heart className="h-2.5 w-2.5" /> Low sat fat
                            </span>
                        )}
                    </div>
                )}
                <InsightPanel
                    item={diet}
                    getGenericInsight={getGenericDietInsight}
                    getPersonalizedInsight={getPersonalizedDietInsight}
                    labels={{ automated: "Diet insight", personalized: "Diet · personalised" }}
                />
            </div>

            {/* ── Expandable info panel (list mode) ── */}
            {!isFullView && (
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <div className="relative px-4 pb-4 pt-4 space-y-4 overflow-hidden">
                        {/* Decorative icons */}
                        <div className="absolute inset-0 pointer-events-none select-none">
                            {BG_DIET_ICONS.map(({ Icon, className }, i) => (
                                <Icon key={i} className={`absolute h-14 w-14 text-content/[0.08] ${className}`} />
                            ))}
                        </div>

                        {/* Description */}
                        {hasDescription && (
                            <div className="relative rounded-2xl border border-violet-400/35 bg-violet-400/[0.09] px-4 pb-4 pt-5">
                                <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 border border-violet-400/30">
                                    <BookOpen className="h-3 w-3 text-violet-400" />
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Description</span>
                                </div>
                                <div
                                    className="flex gap-3 items-start cursor-pointer"
                                    onClick={() => setShowFullDescription((v) => !v)}
                                >
                                    <BookOpen className="h-6 w-6 shrink-0 text-violet-400/70 mt-0.5" />
                                    <p className={`text-sm leading-relaxed text-content/80 italic ${showFullDescription ? "" : "line-clamp-3"}`}>
                                        {diet.dietDescription}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Day summaries */}
                        {diet.dietDays?.length > 0 && (
                            <div className="relative rounded-2xl border border-emerald-400/35 bg-emerald-400/[0.09] px-4 pb-4 pt-5">
                                <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 border border-emerald-400/30">
                                    <CalendarDays className="h-3 w-3 text-emerald-400" />
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Days</span>
                                    <span className="text-[10px] font-semibold text-emerald-400/70">{dayCount}</span>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <CalendarDays className="h-6 w-6 shrink-0 text-emerald-400/70 mt-0.5" />
                                    <div className="flex flex-col gap-1.5 w-full">
                                        {diet.dietDays.map((day) => (
                                            <span
                                                key={day.id}
                                                className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-xs w-fit"
                                            >
                                                {day.dayLabel} — {day.meals?.length ?? 0} meal{(day.meals?.length ?? 0) !== 1 ? "s" : ""}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fallback */}
                        {!hasDescription && diet.dietDays?.length === 0 && (
                            <div className="flex items-center gap-2 text-content/40 text-sm">
                                <CalendarDays className="h-4 w-4" />
                                <span>No details available</span>
                            </div>
                        )}

                        {/* Navigate */}
                        <div className="flex justify-end pt-1">
                            <button
                                type="button"
                                onClick={() => window.open(`/diet/${diet.id}`, "_blank", "noopener,noreferrer")}
                                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25"
                            >
                                View diet
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Expand/collapse toggle (list mode) ── */}
            {!isFullView && (
                <div className="relative h-3">
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-content transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                    </button>
                </div>
            )}

            {/* ── Full view content (modal / page) ── */}
            {isFullView && (
                <div className="relative px-4 pb-4 pt-4 overflow-hidden">
                    {/* Background icons */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                        {BG_DIET_ICONS.map(({ Icon, className }, i) => (
                            <Icon key={i} className={`absolute h-14 w-14 text-content/[0.08] ${className}`} />
                        ))}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <div className="relative rounded-2xl border border-violet-400/35 bg-violet-400/[0.09] px-4 pb-4 pt-5">
                            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5 border border-violet-400/30">
                                <BookOpen className="h-3 w-3 text-violet-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Description</span>
                            </div>
                            <div className="flex gap-3 items-start">
                                <BookOpen className="h-6 w-6 shrink-0 text-violet-400/70 mt-0.5" />
                                {hasDescription ? (
                                    <p className="text-sm leading-relaxed text-content/80 italic">{diet.dietDescription}</p>
                                ) : (
                                    <p className="text-sm leading-relaxed text-content/40 italic">{getDietPlaceholder(dayCount)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Diet days */}
                    {diet.dietDays?.map((day, i) => (
                        <SlickDietDayCard key={day.id} day={day} viewMode={viewMode} index={i} />
                    ))}

                    {/* Navigate — only in modal, not on the page itself */}
                    {viewMode === "modal" && (
                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => window.open(`/diet/${diet.id}`, "_blank", "noopener,noreferrer")}
                                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25"
                            >
                                View diet
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

SlickDietCard.propTypes = {
    diet: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string,
        dietDescription: PropTypes.string,
        isRestricted: PropTypes.bool,
        saveCount: PropTypes.number,
        diets: PropTypes.arrayOf(PropTypes.string),
        avgCalories: PropTypes.number,
        avgProtein: PropTypes.number,
        avgCarbs: PropTypes.number,
        avgFat: PropTypes.number,
        createdBy: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            userName: PropTypes.string,
        }),
        avgSugars: PropTypes.number,
        dietDays: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                dayLabel: PropTypes.string,
                dietDayDescription: PropTypes.string,
                totalCalories: PropTypes.number,
                totalProtein: PropTypes.number,
                totalCarbs: PropTypes.number,
                totalFat: PropTypes.number,
                totalSugars: PropTypes.number,
                meals: PropTypes.array,
            })
        ),
    }).isRequired,
    isPinned: PropTypes.bool,
    initialExpanded: PropTypes.bool,
    viewMode: PropTypes.oneOf(["list", "modal", "page"]),
    scrollContainerRef: PropTypes.shape({ current: PropTypes.any }),
};
