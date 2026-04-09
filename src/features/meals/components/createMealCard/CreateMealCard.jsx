// CreateMealCard — create-meal form styled as a SlickMealCard
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
    Flame, Dumbbell, ChartColumnIncreasing, Droplet,
    Clock, Users, BookOpen, Carrot, ChefHat, PlayCircle,
    ExternalLink, Apple, Cherry, Beef, Banana,
    Plus, X, Check, ImagePlus, Camera, ArrowBigUp, Link2,
} from "lucide-react";

import { mealSchema } from "../../../../utils/valadition/validationSchemas.js";
import { useCreateMeal } from "../../../../hooks/useCreateMeal.js";
import { useModal } from "../../../../context/useModal.js";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { cancelMealApi, getMappedFoodSources, searchFoodItemsByName } from "../../../../services/apiService.js";
import useFoodItems from "../../../../hooks/useFoodItems.js";
import MealModal from "../mealModal/MealModal.jsx";
import useUserProfile from "../../../profile/utils/hooks/useUserProfile.js";

import {
    mealTypesOptions,
    cuisinesOptions,
    dietsOptions,
} from "../../utils/helpers/dropdownOptionsMealsTypes.js";
import { preparationTimeOptions } from "../../utils/helpers/dropdownOptionsMealsTime.js";

// ── Constants ─────────────────────────────────────────────────────────────────

const BG_FOOD_ICONS = [
    { Icon: Apple,  className: "top-3   left-6   rotate-12" },
    { Icon: Cherry, className: "top-8   right-10 -rotate-6" },
    { Icon: Banana, className: "top-1/3 left-3   rotate-45" },
    { Icon: Beef,   className: "top-2/3 left-10  -rotate-6" },
];

const CHIP_COLORS = {
    mealTypes: "border-fuchsia-400/50 text-fuchsia-300 bg-fuchsia-400/10",
    cuisines:  "border-cyan-400/50    text-cyan-300    bg-cyan-400/10",
    diets:     "border-emerald-400/50 text-emerald-300 bg-emerald-400/10",
};

const TAG_GROUPS = [
    { group: "mealTypes", label: "Meal type", options: mealTypesOptions },
    { group: "cuisines",  label: "Cuisine",   options: cuisinesOptions  },
    { group: "diets",     label: "Diet",      options: dietsOptions     },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function CreateMealCard() {
    const { token, user } = useContext(AuthContext);
    const { userData } = useUserProfile(token);
    const hasFoodSource = !!userData?.foodSource;

    const navigate      = useNavigate();
    const { openModal } = useModal();
    const { onSubmit, handleImagesChange, renderDialogs } = useCreateMeal({ preview: true });

    const [photos,             setPhotos]             = useState([]); // [{url, file|null}]
    const [activeIdx,          setActiveIdx]          = useState(0);
    const [replaceIdx,         setReplaceIdx]         = useState(null); // null=append, number=replace
    const [showPhotoMenu,      setShowPhotoMenu]      = useState(false);
    const [showImageUrl,       setShowImageUrl]       = useState(false);
    const [imageUrlValue,      setImageUrlValue]      = useState("");
    const [showTagPicker,      setShowTagPicker]      = useState(false);
    const [showPrepTime,       setShowPrepTime]       = useState(false);
    const [foodSourceOptions,  setFoodSourceOptions]  = useState([]);

    const fileInputRef   = useRef(null);
    const cameraInputRef = useRef(null);
    const tagPickerRef   = useRef(null);
    const tagBtnRef      = useRef(null);
    const prepTimeRef    = useRef(null);

    useEffect(() => { getMappedFoodSources().then(setFoodSourceOptions); }, []);

    // Close prep time on outside click (tag picker handles its own close via portal)
    useEffect(() => {
        const handler = (e) => {
            if (prepTimeRef.current && !prepTimeRef.current.contains(e.target)) setShowPrepTime(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const {
        register, control, handleSubmit, setValue, watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: (values, context, options) => {
            const cleaned = {
                ...values,
                mealIngredients: (values.mealIngredients || []).filter(
                    ing => ing.foodItemId && String(ing.foodItemId).trim() !== ""
                ),
            };
            return yupResolver(mealSchema)(cleaned, context, options);
        },
        defaultValues: {
            name: "", mealDescription: "",
            mealIngredients: [{ foodItemId: "", quantity: 0 }],
            mealTypes: [], cuisines: [], diets: [],
            preparationTime: "",
            imageFiles: [], primaryIndex: null,
            videoUrl: "", sourceUrl: "", preparationVideoUrl: "",
            mealPreparation: "", servings: 1,
        },
    });

    const mealTypes        = watch("mealTypes")       || [];
    const cuisines         = watch("cuisines")        || [];
    const diets            = watch("diets")           || [];
    const preparationTime  = watch("preparationTime");
    const servings         = watch("servings");
    const mealIngredients  = watch("mealIngredients") || [];
    const foodSource       = watch("foodSource");

    const hasIngredient = mealIngredients.some(
        (ing) => ing.foodItemId && ing.foodItemId.toString().trim() !== ""
    );

    // Chips display
    const allChips = [
        ...mealTypes.map(v => ({ label: v.label || v, group: "mealTypes", value: v.value || v })),
        ...cuisines .map(v => ({ label: v.label || v, group: "cuisines",  value: v.value || v })),
        ...diets    .map(v => ({ label: v.label || v, group: "diets",     value: v.value || v })),
    ];

    const isTagSelected = useCallback((group, optionValue) => {
        const map = { mealTypes, cuisines, diets };
        return (map[group] || []).some(v => (v.value || v) === optionValue);
    }, [mealTypes, cuisines, diets]);

    const toggleTag = useCallback((group, optionValue, optionLabel) => {
        const map = { mealTypes, cuisines, diets };
        const current = map[group] || [];
        const exists  = current.some(v => (v.value || v) === optionValue);
        setValue(
            group,
            exists
                ? current.filter(v => (v.value || v) !== optionValue)
                : [...current, { value: optionValue, label: optionLabel }],
            { shouldValidate: true }
        );
    }, [mealTypes, cuisines, diets, setValue]);

    const removeChip = (group, value) => {
        const map = { mealTypes, cuisines, diets };
        setValue(group, (map[group] || []).filter(v => (v.value || v) !== value), { shouldValidate: true });
    };

    const applyPhoto = (url, file) => {
        setPhotos(prev => {
            let next;
            if (replaceIdx !== null) {
                next = prev.map((p, i) => i === replaceIdx ? { url, file } : p);
            } else {
                if (prev.length >= 4) return prev;
                next = [...prev, { url, file }];
                setActiveIdx(next.length - 1);
            }
            const files = next.filter(p => p.file).map(p => p.file);
            if (files.length) handleImagesChange(files, 0, setValue);
            return next;
        });
        setReplaceIdx(null);
    };

    const removePhoto = (i) => {
        setPhotos(prev => {
            const next = prev.filter((_, idx) => idx !== i);
            setActiveIdx(ai => Math.min(ai, Math.max(next.length - 1, 0)));
            const files = next.filter(p => p.file).map(p => p.file);
            handleImagesChange(files.length ? files : [], 0, setValue);
            return next;
        });
    };

    // Image upload
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        applyPhoto(URL.createObjectURL(file), file);
        // reset input so same file can be re-selected
        e.target.value = "";
    };

    // Image from URL
    const handleImageUrl = async () => {
        const urlStr = imageUrlValue.trim();
        if (!urlStr) return;
        try {
            const resp = await fetch(urlStr);
            const blob = await resp.blob();
            const file = new File([blob], "photo-from-url", { type: blob.type || "image/jpeg" });
            applyPhoto(URL.createObjectURL(file), file);
        } catch {
            applyPhoto(urlStr, null);
        }
        setShowImageUrl(false);
        setImageUrlValue("");
    };

    // Submit → preview modal
    const submitAndPreview = async (values) => {
        const createdMeal = await onSubmit(values);
        if (!createdMeal?.id) return;
        const tok = localStorage.getItem("accessToken");
        openModal(
            <MealModal
                meal={createdMeal}
                mode="preview"
                onCancel={async (meal) => { await cancelMealApi(meal.id, tok); }}
                onConfirm={(meal)  => { navigate(`/meal/${meal.id}`); }}
            />
        );
    };

    const prepTimeLabel = preparationTimeOptions.find(o => o.value === preparationTime)?.label;

    return (
        <form onSubmit={handleSubmit(submitAndPreview)} className="w-full max-w-3xl mx-auto pb-16">
            {renderDialogs()}

            <div className="rounded-[28px] border border-content/10 shadow-2xl bg-surface">

                {/* ── Image / header section ────────────────────────────── */}
                <div className="relative overflow-hidden rounded-t-[28px] min-h-[320px]">

                    {/* Hidden file inputs */}
                    <input ref={fileInputRef}   type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

                    {/* Background */}
                    {photos.length === 0 ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-sunken to-surface">
                            <div className="absolute inset-0 pointer-events-none select-none">
                                {BG_FOOD_ICONS.map(({ Icon, className }, i) => (
                                    <Icon key={i} className={`absolute h-16 w-16 text-content/[0.06] ${className}`} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <img
                            src={photos[activeIdx]?.url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    )}

                    <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    {/* Content layer */}
                    <div className="relative flex h-full min-h-[320px] flex-col px-3 pt-3 pb-2">
                        {/* Add photo button — only icon + text area is clickable */}
                        {photos.length === 0 && !showPhotoMenu && !showImageUrl && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                                <button
                                    type="button"
                                    onClick={() => { setReplaceIdx(null); setShowPhotoMenu(true); }}
                                    className="pointer-events-auto flex flex-col items-center gap-2 rounded-2xl px-6 py-4 text-content/25 hover:text-content/50 transition-colors"
                                >
                                    <ImagePlus className="h-10 w-10" />
                                    <span className="text-sm font-medium">Add a photo</span>
                                    <span className="text-xs opacity-60">(optional)</span>
                                </button>
                            </div>
                        )}

                        {/* Photo source menu */}
                        {showPhotoMenu && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-t-[28px]">
                                <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-black/70 p-5 backdrop-blur-md min-w-[200px]">
                                    <p className="text-[11px] text-white/45 text-center mb-1 uppercase tracking-widest">Add photo from</p>
                                    <button
                                        type="button"
                                        onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                    >
                                        <ImagePlus className="h-4 w-4 text-white/60" /> Gallery / file
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowPhotoMenu(false); cameraInputRef.current?.click(); }}
                                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Camera className="h-4 w-4 text-white/60" /> Camera
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowPhotoMenu(false); setShowImageUrl(true); }}
                                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Link2 className="h-4 w-4 text-white/60" /> URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPhotoMenu(false)}
                                        className="mt-1 text-xs text-white/30 hover:text-white/60 transition-colors text-center"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* URL input overlay */}
                        {showImageUrl && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-t-[28px]">
                                <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-black/70 p-5 backdrop-blur-md w-72">
                                    <p className="text-[11px] text-white/45 uppercase tracking-widest">Paste image URL</p>
                                    <input
                                        type="url"
                                        autoFocus
                                        value={imageUrlValue}
                                        onChange={e => setImageUrlValue(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleImageUrl(); } }}
                                        placeholder="https://…"
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleImageUrl}
                                            className="flex-1 rounded-xl bg-white/15 py-2 text-sm font-medium text-white hover:bg-white/25 transition-colors"
                                        >
                                            Use this URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowImageUrl(false); setImageUrlValue(""); }}
                                            className="rounded-xl px-3 py-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change photo button (only when image is set) */}
                        {photos.length > 0 && (
                            <button
                                type="button"
                                onClick={() => { setReplaceIdx(activeIdx); setShowPhotoMenu(true); }}
                                className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white/70 backdrop-blur-sm hover:bg-black/60 hover:text-white transition-colors"
                            >
                                <Camera className="h-3 w-3" /> Change photo
                            </button>
                        )}

                        {/* Thumbnail strip */}
                        {photos.length > 0 && (
                            <div className="absolute bottom-24 left-3 z-10 flex items-center gap-1.5">
                                {photos.map((photo, i) => (
                                    <div key={i} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setActiveIdx(i)}
                                            className={`h-9 w-9 rounded-lg overflow-hidden border-2 transition-all ${
                                                i === activeIdx ? "border-white" : "border-white/30 opacity-60 hover:opacity-90"
                                            }`}
                                        >
                                            <img src={photo.url} alt="" className="h-full w-full object-cover" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white/80 hover:text-white transition-colors"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ))}
                                {photos.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => { setReplaceIdx(null); setShowPhotoMenu(true); }}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-white/30 bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 text-white/50" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Right badges */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">

                            {/* Prep time */}
                            <div className="flex flex-col items-end gap-0.5">
                            <div ref={prepTimeRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPrepTime(v => !v)}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm transition-colors ${
                                        preparationTime
                                            ? "border-white/20 bg-black/50 text-white"
                                            : "border-white/20 bg-black/40 text-white hover:text-white/55"
                                    }`}
                                >
                                    <Clock className="h-3 w-3" />
                                    {preparationTime ? prepTimeLabel : "Prep time"}
                                </button>
                                {showPrepTime && (
                                    <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
                                        {preparationTime && (
                                            <button
                                                type="button"
                                                onClick={() => { setValue("preparationTime", ""); setShowPrepTime(false); }}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error/10"
                                            >
                                                <X className="h-3 w-3" /> Clear
                                            </button>
                                        )}
                                        {preparationTimeOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => { setValue("preparationTime", opt.value); setShowPrepTime(false); }}
                                                className={`flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-content/10 ${preparationTime === opt.value ? "text-primary font-semibold" : "text-content/70"}`}
                                            >
                                                {opt.label}
                                                {preparationTime === opt.value && <Check className="h-3 w-3" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5">
                                <span className="text-[10px] text-white italic">(optional) set prep time</span>
                                <ArrowBigUp className="h-3 w-3 shrink-0 -rotate-45 text-white" />
                            </div>
                            </div>

                            {/* Servings */}
                            <div className="flex flex-col items-end gap-0.5">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/50 bg-sky-400/20 px-3 py-0 backdrop-blur-sm">
                                    <Users className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                                    <Controller
                                        name="servings"
                                        control={control}
                                        defaultValue={1}
                                        render={({ field }) => <ServingsInput field={field} />}
                                    />
                                    <span className="text-xs font-semibold text-sky-200">
                                        {servings > 1 ? "servings" : "serving"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <span className="text-[10px] text-white italic">(optional) set servings</span>
                                    <ArrowBigUp className="h-3 w-3 shrink-0 -rotate-45 text-white" />
                                </div>
                                {errors.servings && (
                                    <p className="text-[9px] text-rose-400">{errors.servings.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Chips + empty placeholder */}
                        <div className={`flex flex-wrap items-start gap-2 pr-28 ${photos.length > 0 ? "mt-8" : "mt-10 sm:mt-0"}`}>
                            {allChips.map(({ label, group, value }) => (
                                <span
                                    key={`${group}-${value}`}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${CHIP_COLORS[group]}`}
                                >
                                    {label}
                                    <button
                                        type="button"
                                        onClick={() => removeChip(group, value)}
                                        className="ml-0.5 opacity-70 hover:opacity-100"
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </button>
                                </span>
                            ))}
                            <button
                                ref={tagBtnRef}
                                type="button"
                                onClick={() => setShowTagPicker(v => !v)}
                                className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/55 backdrop-blur-sm hover:bg-white/20 hover:text-white transition-colors"
                            >
                                <Plus className="h-3 w-3" /> Tags
                            </button>
                        </div>

                        {/* Arrow hint below chips */}
                        <div className="mt-1.5 flex items-start gap-1.5 pl-0.5">
                            <ArrowBigUp className="h-4 w-4 shrink-0 rotate-45 text-white mt-0.5" />
                            <div className="text-[11px] italic text-white flex flex-col sm:flex-row sm:gap-1">
                                <span>(optional) Add meal type,</span>
                                <span>cuisine or diet</span>
                            </div>
                        </div>

                        <div className="flex-1" />

                        {/* Meal name */}
                        <div>
                            <div className="flex items-center gap-1 mb-0.5">
                                <span className="text-[10px] italic text-white">
                                    meal name <span className="font-bold not-italic uppercase">(required)</span>
                                </span>
                                <ArrowBigUp className="h-3 w-3 shrink-0 rotate-[225deg] text-white" />
                            </div>
                            <input
                                type="text"
                                maxLength={100}
                                placeholder="Meal name"
                                {...register("name")}
                                className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/35 outline-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-400 mt-0.5">{errors.name.message}</p>
                            )}
                        </div>

                        {user?.userName && (
                            <p className="mt-1 text-xs text-white/55">{user.userName}</p>
                        )}
                    </div>
                </div>

                {/* ── Tag picker portal ────────────────────────────────── */}
                <TagPickerPortal
                    isOpen={showTagPicker}
                    anchorRef={tagBtnRef}
                    containerRef={tagPickerRef}
                    onClose={() => setShowTagPicker(false)}
                    tagGroups={TAG_GROUPS}
                    isTagSelected={isTagSelected}
                    toggleTag={toggleTag}
                    chipColors={CHIP_COLORS}
                />

                {/* ── Macros placeholder ────────────────────────────────── */}
                <div className="px-3 pt-1.5 pb-2">
                    <div className="flex items-center">
                        <MacroTile icon={Flame}                 color="text-rose-400"    label="Calories" />
                        <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                        <MacroTile icon={Dumbbell}              color="text-cyan-500"    label="Protein"  />
                        <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                        <MacroTile icon={ChartColumnIncreasing} color="text-emerald-500" label="Carbs"    />
                        <div className="w-px self-stretch bg-border mx-1 shrink-0" />
                        <MacroTile icon={Droplet}               color="text-fuchsia-500" label="Fats"     />
                    </div>
                    <p className="mt-1 text-center text-[10px] text-content">
                        Calculated after saving meal
                    </p>
                </div>

                {/* ── Form sections ─────────────────────────────────────── */}
                <div className="relative border-t border-border px-4 pb-6 pt-6 space-y-5">
                    <div className="absolute inset-0 pointer-events-none select-none">
                        {BG_FOOD_ICONS.map(({ Icon, className }, i) => (
                            <Icon key={i} className={`absolute h-14 w-14 text-content/[0.06] ${className}`} />
                        ))}
                    </div>

                    {/* Ingredients — required */}
                    <Section label="Ingredients" required icon={Carrot}>
                        <Controller
                            name="mealIngredients"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <IngredientsEditor
                                    value={value}
                                    onChange={onChange}
                                    foodSource={foodSource}
                                    error={errors.mealIngredients?.message}
                                />
                            )}
                        />
                    </Section>

                    {/* Description — optional */}
                    <Section label="Description" hint="Short introduction to the meal (max 1000 chars)" icon={BookOpen}>
                        <textarea
                            rows={3}
                            maxLength={1000}
                            placeholder="Describe your meal…"
                            {...register("mealDescription")}
                            className="w-full resize-none rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors italic"
                        />
                        {errors.mealDescription && (
                            <p className="text-xs text-error">{errors.mealDescription.message}</p>
                        )}
                    </Section>

                    {/* Store filter — conditional */}
                    {!hasFoodSource && (
                        <Section label="Store" hint="Filter available ingredients by supermarket">
                            <Controller
                                name="foodSource"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        value={field.value || ""}
                                        onChange={e => field.onChange(e.target.value || undefined)}
                                        className="w-full rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 outline-none focus:border-primary/40 transition-colors"
                                    >
                                        <option value="">No store filter</option>
                                        {foodSourceOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                )}
                            />
                        </Section>
                    )}

                    {/* Preparation — optional */}
                    <Section label="Preparation" hint="Step-by-step instructions (max 20 000 chars)" icon={ChefHat}>
                        <textarea
                            rows={5}
                            maxLength={20000}
                            placeholder="Describe how to prepare this meal…"
                            {...register("mealPreparation")}
                            className="w-full resize-none rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
                        />
                        {errors.mealPreparation && (
                            <p className="text-xs text-error">{errors.mealPreparation.message}</p>
                        )}
                    </Section>

                    {/* Meal video — optional */}
                    <Section label="Meal video" hint="YouTube or Vimeo link to a video of the finished meal" icon={PlayCircle}>
                        <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=…"
                            {...register("videoUrl")}
                            className="w-full rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
                        />
                        {errors.videoUrl && (
                            <p className="text-xs text-error">{errors.videoUrl.message}</p>
                        )}
                    </Section>

                    {/* Preparation video — optional */}
                    <Section label="Preparation video" hint="YouTube or Vimeo link to a preparation video" icon={PlayCircle}>
                        <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=…"
                            {...register("preparationVideoUrl")}
                            className="w-full rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
                        />
                        {errors.preparationVideoUrl && (
                            <p className="text-xs text-error">{errors.preparationVideoUrl.message}</p>
                        )}
                    </Section>

                    {/* Source URL — optional */}
                    <Section label="Source" hint="Link to the original recipe" icon={ExternalLink}>
                        <input
                            type="url"
                            placeholder="https://…"
                            {...register("sourceUrl")}
                            className="w-full rounded-xl border border-border bg-surface-sunken px-3 py-2 text-sm text-content/80 placeholder-content/30 outline-none focus:border-primary/40 transition-colors"
                        />
                        {errors.sourceUrl && (
                            <p className="text-xs text-error">{errors.sourceUrl.message}</p>
                        )}
                    </Section>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={!(isValid && hasIngredient)}
                            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-emphasis hover:shadow-lg hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Preview &amp; Save
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

// ── ServingsInput ─────────────────────────────────────────────────────────────

function ServingsInput({ field }) {
    const [raw, setRaw] = useState(String(field.value ?? 1));
    return (
        <input
            type="number"
            min={1}
            max={99}
            value={raw}
            onFocus={e => e.target.select()}
            onChange={e => setRaw(e.target.value)}
            onBlur={() => {
                const n = parseInt(raw, 10);
                const clamped = isNaN(n) || n < 1 ? 1 : Math.min(n, 99);
                setRaw(String(clamped));
                field.onChange(clamped);
            }}
            className="w-12 bg-transparent border-0 text-white text-sm font-bold outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
    );
}

// ── TagPickerPortal ───────────────────────────────────────────────────────────

function TagPickerPortal({ isOpen, anchorRef, containerRef, onClose, tagGroups, isTagSelected, toggleTag, chipColors }) {
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!isOpen || !anchorRef.current) return;
        const rect    = anchorRef.current.getBoundingClientRect();
        const W       = window.innerWidth;
        const H       = window.innerHeight;
        const dropW   = 288; // w-72
        const dropH   = 380; // approximate max height
        const margin  = 8;

        const left = Math.min(rect.left, W - dropW - margin);
        const top  = rect.bottom + dropH + margin > H
            ? Math.max(rect.top - dropH - 6, margin)   // flip upward
            : rect.bottom + 6;

        setPos({ top, left: Math.max(left, margin) });
    }, [isOpen, anchorRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (
                containerRef.current && !containerRef.current.contains(e.target) &&
                anchorRef.current && !anchorRef.current.contains(e.target)
            ) onClose();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, anchorRef, containerRef, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            ref={containerRef}
            className="fixed z-[2147483640] w-72 rounded-2xl border border-border bg-surface shadow-xl p-4 space-y-3"
            style={{ top: pos.top, left: pos.left }}
        >
            <div className="flex justify-end -mt-1 -mr-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-content/40 hover:bg-content/10 hover:text-content transition-colors"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
            {tagGroups.map(({ group, label, options }) => (
                <div key={group}>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-content/40">{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {options.map(opt => {
                            const selected = isTagSelected(group, opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => toggleTag(group, opt.value, opt.label)}
                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                                        selected ? chipColors[group] : "border-border text-content/50 hover:border-content/30 hover:text-content/70"
                                    }`}
                                >
                                    {selected && <Check className="h-2.5 w-2.5" />}
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>,
        document.body
    );
}

// ── IngredientsEditor ─────────────────────────────────────────────────────────

function IngredientsEditor({ value, onChange, foodSource, error }) {
    const { options: baseOptions, isLoading } = useFoodItems(foodSource);
    const searchTimers = useRef({});
    const [rowResults, setRowResults] = useState({});

    const flatBase = Array.isArray(baseOptions)
        ? baseOptions.flat().filter(item => item?.id)
        : [];

    const getOptions = (i) => {
        const results = rowResults[i];
        const pool = results ?? flatBase;
        const existingIds = value.map(r => r.foodItemId).filter(Boolean);
        return pool.filter(item =>
            !existingIds.includes(String(item.id)) || String(item.id) === String(value[i]?.foodItemId)
        );
    };

    const handleSearch = (i, query) => {
        if (query.length < 2) {
            setRowResults(prev => { const n = { ...prev }; delete n[i]; return n; });
            return;
        }
        clearTimeout(searchTimers.current[i]);
        searchTimers.current[i] = setTimeout(async () => {
            try {
                const data = await searchFoodItemsByName(query);
                setRowResults(prev => ({ ...prev, [i]: data }));
            } catch { /* ignore */ }
        }, 350);
    };

    const addRow    = () => onChange([...value, { foodItemId: "", quantity: 0 }]);
    const removeRow = (i) => {
        onChange(value.filter((_, idx) => idx !== i));
        setRowResults(prev => { const n = { ...prev }; delete n[i]; return n; });
    };
    const updateRow = (i, updated) => {
        const next = [...value]; next[i] = updated; onChange(next);
    };

    if (isLoading) return <p className="text-xs text-content/40 py-2">Loading ingredients…</p>;

    return (
        <div className="space-y-2">
            {value.map((row, i) => (
                <IngredientRow
                    key={i}
                    row={row}
                    onChange={updated => updateRow(i, updated)}
                    onRemove={() => removeRow(i)}
                    canRemove={value.length > 1}
                    options={getOptions(i)}
                    onSearch={q => handleSearch(i, q)}
                />
            ))}
            <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-1.5 text-xs text-content/40 transition-colors hover:border-primary/40 hover:text-primary"
            >
                <Plus className="h-3.5 w-3.5" /> Add ingredient
            </button>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
}

// ── IngredientRow ─────────────────────────────────────────────────────────────

function IngredientRow({ row, onChange, onRemove, canRemove, options, onSearch }) {
    const [query,  setQuery]  = useState(row.foodItemName || "");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleQueryChange = (e) => {
        const q = e.target.value;
        setQuery(q);
        if (row.foodItemId) onChange({ ...row, foodItemId: "", foodItemName: "" });
        onSearch(q);
        setIsOpen(true);
    };

    const selectItem = (item) => {
        const quantity = item.gramWeight ?? row.quantity ?? 0;
        console.log("[IngredientRow] selected:", item.name, "| gramWeight:", item.gramWeight, "| quantity set to:", quantity);
        setQuery(item.name);
        onChange({ ...row, foodItemId: String(item.id), foodItemName: item.name, quantity });
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="flex items-center gap-2">
            {/* Food item search */}
            <div className="relative flex-1">
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search ingredient…"
                    className={`w-full h-10 rounded-xl border bg-surface-sunken px-3 text-sm text-content/80 placeholder-content/30 outline-none transition-colors ${
                        row.foodItemId ? "border-primary/30" : "border-border focus:border-primary/40"
                    }`}
                />
                {isOpen && options.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl">
                        {options.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onMouseDown={() => selectItem(item)}
                                className="flex w-full items-start px-3 py-2 text-sm text-content/80 hover:bg-content/10 text-left"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Quantity */}
            <div className="flex h-10 items-center gap-1 rounded-xl border border-border bg-surface-sunken px-2">
                <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={row.quantity || ""}
                    onChange={e => onChange({ ...row, quantity: e.target.value === "" ? 0 : Number(e.target.value) })}
                    onFocus={e => e.target.select()}
                    className="w-12 bg-transparent border-0 text-sm text-content/80 placeholder-content/30 outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-content/40">g</span>
            </div>

            {/* Remove */}
            {canRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-content/35 transition-colors hover:bg-error/10 hover:text-error"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({ label, required, hint, icon: Icon, children }) {
    return (
        <div className="relative rounded-2xl border border-content/8 bg-gradient-to-br from-primary/5 via-transparent to-fuchsia-500/5 px-4 pb-4 pt-5">
            <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-surface px-2 py-0.5">
                {Icon && <Icon className="h-3.5 w-3.5 text-primary/50" />}
                <span className="text-[10px] font-semibold uppercase tracking-widest text-content/40">{label}</span>
                {required
                    ? <span className="text-[10px] font-bold text-rose-400">required</span>
                    : <span className="text-[10px] text-content/25">optional</span>
                }
            </div>
            {hint && <p className="mb-2 text-[11px] text-content/35">{hint}</p>}
            {children}
        </div>
    );
}

// ── MacroTile (placeholder) ───────────────────────────────────────────────────

function MacroTile({ icon: Icon, color, label }) {
    return (
        <div className="flex flex-1 items-center gap-1.5 px-2 py-1.5">
            <Icon className={`shrink-0 h-4 w-4 ${color}`} />
            <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight text-content/30">–</span>
                <span className="text-[10px] leading-none text-content/25">{label}</span>
            </div>
        </div>
    );
}
