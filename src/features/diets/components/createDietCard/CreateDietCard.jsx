// CreateDietCard — create-diet form styled as a SlickDietCard
import { useState, useEffect, useRef, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CalendarDays, Salad, BookOpen, Plus, X, Search,
    ChevronDown, ChevronUp, Flame, Dumbbell, Wheat, Droplet, UtensilsCrossed,
} from "lucide-react";

import { createDietPlanSchema } from "../../../../utils/valadition/validationSchemas.js";
import { useCreateDiet } from "../../utils/hooks/useCreateDiet.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { useFetchMeals } from "../../../../hooks/useFetchMeals.js";

// ── Constants ──────────────────────────────────────────────────────────────────

const BG_DIET_ICONS = [
    { Icon: Salad,        className: "top-3   left-6   rotate-12" },
    { Icon: CalendarDays, className: "top-8   right-10 -rotate-6" },
    { Icon: Salad,        className: "top-1/3 left-3   rotate-45" },
    { Icon: CalendarDays, className: "top-2/3 left-10  -rotate-6" },
];

const MEAL_TYPE_CHIPS = [
    { value: "BREAKFAST", label: "Breakfast", emoji: "🌅" },
    { value: "LUNCH",     label: "Lunch",     emoji: "☀️" },
    { value: "DINNER",    label: "Dinner",    emoji: "🌙" },
    { value: "SNACK",     label: "Snack",     emoji: "🍿" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function avg(arr) {
    const vals = arr.filter(v => v != null);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

// ── MacroTile (matches SlickDietCard style) ────────────────────────────────────

function MacroTile({ icon: Icon, value, color, label }) {
    return (
        <div className="flex flex-1 flex-col items-center py-2.5">
            <Icon className={`h-4 w-4 ${color} mb-0.5`} />
            <span className="text-sm font-bold text-content">
                {value != null ? value : "–"}
            </span>
            {label && <span className="text-[10px] text-content/50 mt-0.5">{label}</span>}
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CreateDietCard() {
    const { user } = useContext(AuthContext);

    const { mealOptions: allMealOptions, loading: allLoading } = useFetchMeals("/meals");
    const { mealOptions: myMealOptions,  loading: myLoading  } = useFetchMeals("/users/meals");

    const [scope,          setScope]          = useState("all");
    const [activeMealType, setActiveMealType] = useState(null);

    const mealsLoading    = scope === "my" ? myLoading  : allLoading;
    const baseMealOptions = scope === "my" ? myMealOptions : allMealOptions;
    const mealOptions     = activeMealType
        ? baseMealOptions.filter(o => o.mealTypes?.includes(activeMealType))
        : baseMealOptions;

    const {
        register, control, handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createDietPlanSchema),
        defaultValues: {
            name: "",
            dietDescription: "",
            dietDays: [{ dayLabel: "", dietDayDescription: "" }],
        },
    });

    const { fields: dayFields, append, remove } = useFieldArray({ control, name: "dietDays" });
    const { days, loading, renderDialogs, handleChangeMealId, addDay, removeDay, addMealId, removeMeal, onSubmit } =
        useCreateDiet(null, append, remove);

    const dayCount     = dayFields.length;
    const allDaysValid = days.every(d => d.mealIds.filter(id => id.trim() !== "").length >= 2);
    const canSubmit    = isValid && allDaysValid && !loading;

    // Live collage from unique selected meal images
    const selectedImageUrls = days
        .flatMap(d => d.mealIds)
        .filter(id => id.trim() !== "")
        .reduce((acc, id) => {
            const opt = baseMealOptions.find(o => o.value === id);
            if (opt?.imageUrl && !acc.includes(opt.imageUrl)) acc.push(opt.imageUrl);
            return acc;
        }, []);

    // Live daily averages — average kcal/protein/carbs/fat per day
    const dailyAvgs = days.map(d => {
        const meals = d.mealIds
            .filter(id => id.trim() !== "")
            .map(id => baseMealOptions.find(o => o.value === id))
            .filter(Boolean);
        return {
            calories: meals.reduce((s, m) => s + (m.calories ?? 0), 0) || null,
            protein:  meals.reduce((s, m) => s + (m.protein  ?? 0), 0) || null,
            carbs:    meals.reduce((s, m) => s + (m.carbs    ?? 0), 0) || null,
            fat:      meals.reduce((s, m) => s + (m.fat      ?? 0), 0) || null,
        };
    });
    const liveAvg = {
        calories: avg(dailyAvgs.map(d => d.calories)),
        protein:  avg(dailyAvgs.map(d => d.protein)),
        carbs:    avg(dailyAvgs.map(d => d.carbs)),
        fat:      avg(dailyAvgs.map(d => d.fat)),
    };
    const hasLiveData = liveAvg.calories != null;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl mx-auto pb-16">
            {renderDialogs()}

            <div className="rounded-[28px] border border-content/10 shadow-2xl bg-surface">

                {/* ── Image / header section ────────────────────────── */}
                <div className="relative overflow-hidden rounded-t-[28px] min-h-[300px]">

                    {/* Background: live collage or gradient */}
                    {selectedImageUrls.length === 0 ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-sunken to-surface">
                            <div className="absolute inset-0 pointer-events-none select-none">
                                {BG_DIET_ICONS.map(({ Icon, className }, i) => (
                                    <Icon key={i} className={`absolute h-16 w-16 text-content/[0.06] ${className}`} />
                                ))}
                            </div>
                        </div>
                    ) : selectedImageUrls.length === 1 ? (
                        <img src={selectedImageUrls[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    ) : selectedImageUrls.length === 2 ? (
                        <div className="absolute inset-0 flex gap-0.5">
                            <img src={selectedImageUrls[0]} alt="" className="h-full w-1/2 object-cover" />
                            <img src={selectedImageUrls[1]} alt="" className="h-full w-1/2 object-cover" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex gap-0.5">
                            <img src={selectedImageUrls[0]} alt="" className="h-full w-3/5 object-cover" />
                            <div className="flex flex-col gap-0.5 w-2/5">
                                <img src={selectedImageUrls[1]} alt="" className="h-1/3 w-full object-cover" />
                                <img src={selectedImageUrls[2] ?? selectedImageUrls[1]} alt="" className="h-1/3 w-full object-cover" />
                                <div className="relative h-1/3 w-full">
                                    <img src={selectedImageUrls[3] ?? selectedImageUrls[2]} alt="" className="h-full w-full object-cover" />
                                    {selectedImageUrls.length > 4 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                                            <span className="text-white font-bold text-xl drop-shadow">+{selectedImageUrls.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    <div className="relative flex h-full min-h-[300px] flex-col px-3 pt-3 pb-2">
                        {/* Day count badge */}
                        <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-semibold text-white/80 backdrop-blur-sm">
                                <CalendarDays className="h-3 w-3" />
                                {dayCount} day{dayCount !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="flex-1" />

                        {/* Diet name */}
                        <div>
                            <input
                                type="text"
                                maxLength={100}
                                placeholder="Diet name"
                                {...register("name")}
                                className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/35 outline-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                            />
                            {errors.name && <p className="text-xs text-rose-400 mt-0.5">{errors.name.message}</p>}
                        </div>
                        {user?.userName && <p className="mt-1 text-xs text-white/55">{user.userName}</p>}
                    </div>
                </div>

                {/* ── Daily averages (mirrors SlickDietCard) ─────────── */}
                <div className="px-4 pt-3 pb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-content/50 mb-2">
                        {hasLiveData ? `Daily averages — ${dayCount}-day diet` : `Daily averages — add meals to calculate`}
                    </p>
                    <div className="flex items-stretch rounded-xl border border-content/8 bg-surface-sunken overflow-hidden">
                        <MacroTile icon={Flame}    label="Kcal"    value={liveAvg.calories} color="text-rose-400"    />
                        <div className="w-px self-stretch bg-border shrink-0" />
                        <MacroTile icon={Dumbbell} label="Protein" value={liveAvg.protein}  color="text-cyan-500"    />
                        <div className="w-px self-stretch bg-border shrink-0" />
                        <MacroTile icon={Wheat}    label="Carbs"   value={liveAvg.carbs}    color="text-emerald-500" />
                        <div className="w-px self-stretch bg-border shrink-0" />
                        <MacroTile icon={Droplet}  label="Fat"     value={liveAvg.fat}       color="text-fuchsia-500" />
                    </div>
                </div>

                {/* ── Form body ──────────────────────────────────────── */}
                <div className="relative border-t border-border px-4 pb-6 pt-6 space-y-5">
                    <div className="absolute inset-0 pointer-events-none select-none">
                        {BG_DIET_ICONS.map(({ Icon, className }, i) => (
                            <Icon key={i} className={`absolute h-14 w-14 text-content/[0.06] ${className}`} />
                        ))}
                    </div>

                    {/* Meals loading skeleton */}
                    {mealsLoading && (
                        <div className="space-y-4 animate-pulse">
                            <p className="text-sm text-content/40 italic">
                                Loading<span className="inline-flex gap-0.5 ml-0.5">
                                    <span className="animate-bounce [animation-delay:0ms]">.</span>
                                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                                </span>
                            </p>
                            <div className="h-4 w-32 rounded-full bg-content/[0.06]" />
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="rounded-2xl border border-content/8 px-4 pb-4 pt-5 space-y-3">
                                    <div className="h-10 rounded-xl bg-content/[0.06]" />
                                    <div className="h-16 rounded-xl bg-content/[0.06]" />
                                    <div className="h-16 rounded-xl bg-content/[0.06]" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!mealsLoading && (
                        <>
                            {/* Description */}
                            <Section label="Description" hint="Short introduction to the diet (max 1000 chars)" icon={BookOpen}>
                                <textarea
                                    rows={3}
                                    maxLength={1000}
                                    placeholder="Describe your diet plan…"
                                    {...register("dietDescription")}
                                    className="w-full resize-none rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors italic"
                                />
                                {errors.dietDescription && <p className="text-xs text-error">{errors.dietDescription.message}</p>}
                            </Section>

                            {/* Filter bar */}
                            <div className="space-y-2">
                                <div className="flex gap-1.5">
                                    {["all", "my"].map(s => (
                                        <button key={s} type="button" onClick={() => setScope(s)}
                                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                                scope === s
                                                    ? "border-primary/50 bg-primary/15 text-primary"
                                                    : "border-border text-content/45 hover:border-content/30 hover:text-content/70"
                                            }`}
                                        >
                                            <UtensilsCrossed className="h-3 w-3" />
                                            {s === "all" ? "All meals" : "My meals"}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                    {MEAL_TYPE_CHIPS.map(t => (
                                        <button key={t.value} type="button"
                                            onClick={() => setActiveMealType(v => v === t.value ? null : t.value)}
                                            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                                activeMealType === t.value
                                                    ? "border-primary/50 bg-primary/15 text-primary"
                                                    : "border-border text-content/45 hover:border-content/30 hover:text-content/70"
                                            }`}
                                        >
                                            <span>{t.emoji}</span> {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Days */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-primary/50" />
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Days</span>
                                    <span className="text-[10px] font-bold text-rose-400">required · min 2 meals per day</span>
                                </div>

                                {dayFields.map((field, dayIndex) => {
                                    const dayData     = days[dayIndex];
                                    const mealIds     = dayData?.mealIds ?? [""];
                                    const filledCount = mealIds.filter(id => id.trim() !== "").length;
                                    const isLast      = dayIndex === dayFields.length - 1;
                                    const dayMacros   = dailyAvgs[dayIndex];

                                    return (
                                        <div key={field.id}>
                                            <DaySection
                                                dayIndex={dayIndex}
                                                register={register}
                                                mealIds={mealIds}
                                                mealOptions={mealOptions}
                                                allMealOptions={baseMealOptions}
                                                filledCount={filledCount}
                                                dayMacros={dayMacros}
                                                canRemoveDay={dayFields.length > 1}
                                                onRemoveDay={() => removeDay(dayIndex)}
                                                onChangeMeal={(mi, val) => handleChangeMealId(dayIndex, mi, val)}
                                                onAddMeal={() => addMealId(dayIndex)}
                                                onRemoveMeal={(mi) => removeMeal(dayIndex, mi)}
                                            />
                                            {isLast && (
                                                <button type="button" onClick={addDay}
                                                    className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs text-content/40 hover:border-primary/40 hover:text-primary transition-colors"
                                                >
                                                    <Plus className="h-3.5 w-3.5" /> Add day
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                {!allDaysValid && (
                                    <p className="text-xs text-error">Each day needs at least 2 meals.</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={!canSubmit}
                                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {loading && (
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                    )}
                                    {loading ? "Creating…" : "Create Diet"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

// ── DaySection ─────────────────────────────────────────────────────────────────

function DaySection({
    dayIndex, register, mealIds, mealOptions, allMealOptions,
    filledCount, dayMacros, canRemoveDay, onRemoveDay,
    onChangeMeal, onAddMeal, onRemoveMeal,
}) {
    const [collapsed, setCollapsed] = useState(false);
    const hasMacros = dayMacros?.calories != null;

    return (
        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-emerald-500/5 via-transparent to-primary/5 px-4 pb-4 pt-5">
            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary/50" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">Day {dayIndex + 1}</span>
                {filledCount >= 2
                    ? <span className="text-[10px] font-bold text-emerald-400">{filledCount} meals</span>
                    : <span className="text-[10px] font-bold text-rose-400">min 2 meals</span>
                }
            </div>

            <div className="absolute -top-3 right-4 flex items-center gap-1">
                <button type="button" onClick={() => setCollapsed(v => !v)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-surface border border-border text-content/40 hover:text-content transition-colors"
                >
                    {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                </button>
                {canRemoveDay && (
                    <button type="button" onClick={onRemoveDay}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-surface border border-border text-content/35 hover:bg-error/10 hover:text-error hover:border-error/30 transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {!collapsed && (
                <div className="space-y-3 mt-1">
                    <input type="text" maxLength={50} placeholder="Day label (optional, e.g. Monday)"
                        {...register(`dietDays.${dayIndex}.dayLabel`)}
                        className="w-full rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
                    />
                    <textarea rows={2} maxLength={1000} placeholder="Day description (optional)"
                        {...register(`dietDays.${dayIndex}.dietDayDescription`)}
                        className="w-full resize-none rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors italic"
                    />

                    <div className="space-y-2">
                        {mealIds.map((id, mealIndex) => (
                            <MealSlot
                                key={mealIndex}
                                value={id}
                                mealOptions={mealOptions}
                                allMealOptions={allMealOptions}
                                onChange={(val) => onChangeMeal(mealIndex, val)}
                                onRemove={() => onRemoveMeal(mealIndex)}
                                canRemove={mealIds.length > 1}
                                placeholder={mealIndex < 2 ? `Meal ${mealIndex + 1} (required)` : `Meal ${mealIndex + 1} (optional)`}
                            />
                        ))}
                        <button type="button" onClick={onAddMeal}
                            disabled={mealIds.some(id => id.trim() === "")}
                            className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs text-content/40 hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Plus className="h-3.5 w-3.5" /> Add meal
                        </button>
                    </div>

                    {/* Day macro bar */}
                    {hasMacros && (
                        <div className="flex items-stretch rounded-xl border border-content/8 bg-surface-sunken overflow-hidden mt-1">
                            <div className="flex flex-1 flex-col items-center py-2">
                                <Flame className="h-3.5 w-3.5 text-rose-400 mb-0.5" />
                                <span className="text-xs font-bold text-content">{dayMacros.calories}</span>
                                <span className="text-[10px] text-content/50">kcal</span>
                            </div>
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <div className="flex flex-1 flex-col items-center py-2">
                                <Dumbbell className="h-3.5 w-3.5 text-cyan-500 mb-0.5" />
                                <span className="text-xs font-bold text-content">{dayMacros.protein ?? "–"}</span>
                                <span className="text-[10px] text-content/50">protein</span>
                            </div>
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <div className="flex flex-1 flex-col items-center py-2">
                                <Wheat className="h-3.5 w-3.5 text-emerald-500 mb-0.5" />
                                <span className="text-xs font-bold text-content">{dayMacros.carbs ?? "–"}</span>
                                <span className="text-[10px] text-content/50">carbs</span>
                            </div>
                            <div className="w-px self-stretch bg-border shrink-0" />
                            <div className="flex flex-1 flex-col items-center py-2">
                                <Droplet className="h-3.5 w-3.5 text-fuchsia-500 mb-0.5" />
                                <span className="text-xs font-bold text-content">{dayMacros.fat ?? "–"}</span>
                                <span className="text-[10px] text-content/50">fat</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── MealSlot ───────────────────────────────────────────────────────────────────
// Shows a rich meal card when selected, search input when empty

function MealSlot({ value, mealOptions, allMealOptions, onChange, onRemove, canRemove, placeholder }) {
    const [query,  setQuery]  = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Look up in allMealOptions so the card still shows when a filter hides the meal
    const selected = allMealOptions.find(o => o.value === value);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = mealOptions
        .filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 50);

    // ── Selected: show mini meal card ──
    if (selected) {
        return (
            <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-surface-sunken overflow-hidden">
                {selected.imageUrl ? (
                    <img src={selected.imageUrl} alt="" className="h-14 w-14 shrink-0 object-cover" />
                ) : (
                    <div className="h-14 w-14 shrink-0 flex items-center justify-center bg-content/[0.06]">
                        <Salad className="h-6 w-6 text-content/20" />
                    </div>
                )}
                <div className="flex-1 min-w-0 py-1">
                    <p className="text-sm font-semibold text-content/80 truncate">{selected.label}</p>
                    {selected.calories != null && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-semibold">
                            <Flame className="h-3 w-3" />{selected.calories} kcal
                        </span>
                    )}
                </div>
                {canRemove && (
                    <button type="button" onClick={onRemove}
                        className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-content/30 hover:bg-error/10 hover:text-error transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        );
    }

    // ── Empty: show search input ──
    return (
        <div ref={containerRef} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-content/30 pointer-events-none" />
            <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full h-10 rounded-xl border border-border bg-surface-sunken pl-8 pr-3 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
            />
            {isOpen && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-52 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
                    {filtered.map(opt => (
                        <button key={opt.value} type="button"
                            onMouseDown={() => { onChange(opt.value); setQuery(""); setIsOpen(false); }}
                            className="flex w-full items-center gap-2 px-3 py-2 hover:bg-content/10 text-left"
                        >
                            {opt.imageUrl ? (
                                <img src={opt.imageUrl} alt="" className="h-8 w-8 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="h-8 w-8 rounded-lg bg-content/[0.06] flex items-center justify-center shrink-0">
                                    <Salad className="h-4 w-4 text-content/20" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-content/80 truncate">{opt.label}</p>
                                {opt.calories != null && (
                                    <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-0.5">
                                        <Flame className="h-2.5 w-2.5" />{opt.calories} kcal
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Section ────────────────────────────────────────────────────────────────────

function Section({ label, hint, icon: Icon, children }) {
    return (
        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-primary/50" />}
                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">{label}</span>
                <span className="text-[10px] text-content/25">optional</span>
            </div>
            {hint && <p className="mb-2 text-[11px] text-content/35">{hint}</p>}
            {children}
        </div>
    );
}
