// CreateMealFormCard.jsx
// WYSIWYG card with inline editors + robust local preview.
// Backend contract preserved: only your hook updates imageFile/imageUrl.

import { useState, useMemo, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CreateMealMealIngredients from "../createMealMealIngredients/CreateMealMealIngredients.jsx";
import CreateMealDropdowns from "../createMealDropdowns/MealDropdowns.jsx";

import { useCreateMeal } from "../../../../hooks/useCreateMeal.js";
import { mealSchema } from "../../../../utils/valadition/validationSchemas.js";

import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import MealImageUploader from "../createMealForm/mealImageUploader/MealImageUploader.jsx";
import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import { Pencil, Check } from "lucide-react";

const CreateMealFormCard = () => {
    // Inline editor toggles
    const [editName, setEditName] = useState(false);
    const [editDesc, setEditDesc] = useState(false);
    const [editIngr, setEditIngr] = useState(false);
    const [editTags, setEditTags] = useState(false);

    const [cameraError] = useState(null);

    // RHF + validation
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(mealSchema),
        defaultValues: {
            name: "",
            mealDescription: "",
            mealIngredients: [{ foodItemId: "", quantity: 0 }],
            mealTypes: [],
            cuisines: [],
            diets: [],
            preparationTime: "",
            imageFile: "", // managed by hook
            imageUrl: "",  // managed by hook
        },
    });

    // Domain hook (unchanged contract)
    const { onSubmit, handleImageChange, imageUrl: hookImageUrl, renderDialogs } = useCreateMeal();

    // Form values (from hook)
    const fileValue = watch("imageFile");
    const urlValue = (watch("imageUrl") || hookImageUrl || "").trim();
    const nameVal = watch("name") || "";
    const descVal = watch("mealDescription") || "";
    const ingrVal = watch("mealIngredients") || [];
    const typesVal = watch("mealTypes") || [];
    const cuisinesVal = watch("cuisines") || [];
    const dietsVal = watch("diets") || [];
    const prepVal = watch("preparationTime") || "";

    // ---------- LOCAL PREVIEW (authoritative for UI) ----------
    const [localPreview, setLocalPreview] = useState(null);
    const [localObjUrl, setLocalObjUrl] = useState(null);

    const setPreviewFromFile = (file) => {
        if (!(file instanceof File)) return;
        const url = URL.createObjectURL(file);
        if (localObjUrl) URL.revokeObjectURL(localObjUrl);
        setLocalObjUrl(url);
        setLocalPreview(url);
    };

    useEffect(() => {
        return () => {
            if (localObjUrl) URL.revokeObjectURL(localObjUrl);
        };
    }, [localObjUrl]);
    // ---------------------------------------------------------

    // Fallback preview from RHF if the hook sets a File
    const rhfFile = useMemo(() => {
        if (!fileValue) return null;
        if (fileValue instanceof File) return fileValue;
        if (Array.isArray(fileValue) && fileValue[0] instanceof File) return fileValue[0];
        if (typeof FileList !== "undefined" && fileValue instanceof FileList && fileValue.length > 0) {
            return fileValue[0];
        }
        return null;
    }, [fileValue]);

    const [rhfObjUrl, setRhfObjUrl] = useState(null);
    useEffect(() => {
        if (!rhfFile) {
            setRhfObjUrl(null);
            return;
        }
        const u = URL.createObjectURL(rhfFile);
        setRhfObjUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [rhfFile]);

    const hasName = (nameVal ?? "").trim().length > 0;
    const nameBtnLabel = editName ? "Done" : hasName ? "Edit" : "Set name";
    const { ref: nameRHFRef, ...nameReg } = register("name");
    const nameInputRef = useRef(null);

    const hasDesc = (descVal ?? "").trim().length > 0;
    const descBtnLabel = editDesc ? "Done" : hasDesc ? "Edit description" : "Set description";
    const { ref: descRHFRef, ...descReg } = register("mealDescription");
    const descInputRef = useRef(null);

    useEffect(() => {
        if (editName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [editName]);

    useEffect(() => {
        if (editDesc && descInputRef.current) {
            descInputRef.current.focus();
        }
    }, [editDesc]);

    // Enable submit
    const hasIngredient =
        Array.isArray(ingrVal) && ingrVal.some((ing) => ing?.foodItemId && String(ing.foodItemId).trim() !== "");

    const ingrBtnLabel = editIngr
        ? "Done"
        : hasIngredient
            ? "Add or edit ingredients"
            : "Add ingredients";

    // Has any tags or preparation time?
    const hasTagsOrTime =
        (Array.isArray(typesVal) && typesVal.length > 0) ||
        (Array.isArray(cuisinesVal) && cuisinesVal.length > 0) ||
        (Array.isArray(dietsVal) && dietsVal.length > 0) ||
        (prepVal ?? "").toString().trim().length > 0;

// Button label for tags/time
    const tagsBtnLabel = editTags
        ? "Done"
        : hasTagsOrTime
            ? "Edit or add tags & time"
            : "Set tags & time";

    // Preview priority:
    // 1) localPreview (set direct on user action)
    // 2) object URL from RHF file
    // 3) if imageFile is a string blob:/data: (rare) use it
    // 4) urlValue (http/https)
    const previewSrc =
        localPreview ||
        rhfObjUrl ||
        (typeof fileValue === "string" && (fileValue.startsWith("blob:") || fileValue.startsWith("data:"))
            ? fileValue
            : urlValue || null);

    // Meal-like object for macros preview
    const previewMeal = {
        id: "preview",
        name: nameVal || "Set meal name",
        mealDescription: descVal || "Add a short description...",
        mealIngredients: ingrVal,
        mealTypes: typesVal,
        cuisines: cuisinesVal,
        diets: dietsVal,
        preparationTime: prepVal,
        imageUrl: urlValue,
    };

    let macros = null;
    try {
        const calc = calculateMacrosPer100g(previewMeal);
        macros = buildMacrosObject(previewMeal, calc);
    } catch {
        macros = null;
    }

    return (
        <CustomBox
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            className="hidden md:flex max-w-4xl w-full mx-auto bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border border-border"
        >
            {/* Left: image + uploader panel */}
            <CustomBox className="lg:w-[50%] w-[48%] min-h-[360px] relative">
                {previewSrc ? (
                    <CustomImage src={previewSrc} alt="Meal preview" className="w-full h-full object-cover" />
                ) : (
                    <CustomBox className="w-full h-full bg-base-200 flex items-center justify-center p-3">
                        <span className="text-sm text-muted-foreground">No image selected</span>
                    </CustomBox>
                )}

                {/* RHF hidden wires (values set by hook) */}
                <input type="hidden" {...register("imageFile")} />
                <input type="hidden" {...register("imageUrl")} />

                {/* Controls panel */}
                <CustomBox className="absolute top-3 right-3 z-20 pointer-events-auto">
                    <CustomBox className="min-w-[280px] rounded-xl bg-cardLight/90 dark:bg-cardDark/90 shadow-lg p-3">
                        <MealImageUploader
                            imageUrl={urlValue}
                            onImageChange={(image, type) => {
                                // 1) LOCAL PREVIEW (fast, independent of hook)
                                if (type === "uploaded") {
                                    const file = image instanceof FileList ? image[0] : image;
                                    if (file instanceof File) setPreviewFromFile(file);
                                    // if some uploader hands back a data/blob URL string:
                                    if (typeof image === "string" && (image.startsWith("blob:") || image.startsWith("data:"))) {
                                        setLocalPreview(image);
                                    }
                                } else if (type === "captured") {
                                    // camera often returns a data URL
                                    if (typeof image === "string") setLocalPreview(image);
                                    if (image instanceof File) setPreviewFromFile(image);
                                } else if (type === "url") {
                                    setLocalPreview(image || "");
                                } else if (type === "reset") {
                                    if (localObjUrl) URL.revokeObjectURL(localObjUrl);
                                    setLocalObjUrl(null);
                                    setLocalPreview(null);
                                }

                                // 2) FORM/HOOK (single source of truth for backend)
                                const payload = type === "uploaded" && image instanceof FileList ? image[0] : image;
                                handleImageChange(payload, type, setValue);
                            }}
                            errors={errors}
                            register={register}
                        />
                    </CustomBox>
                </CustomBox>

                {prepVal ? (
                    <CustomBox className="absolute top-2 left-2">
                        <PreparationTimeIcon preparationTime={prepVal} layout="inline" />
                    </CustomBox>
                ) : null}
            </CustomBox>

            {/* Right: WYSIWYG content */}
            <CustomBox className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
                {/* Title */}
                <CustomBox className="flex items-start justify-between gap-3">
                    {!editName ? (
                        <CustomTypography className="text-4xl font-bold text-primary">
                            {nameVal || "Meal name"}
                        </CustomTypography>
                    ) : (
                        <CustomBox className="w-full max-w-xl">
                            <CustomTextField
                                label="Meal Name"
                                {...nameReg}                                        // RHF handlers
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                ref={(el) => { nameRHFRef(el); nameInputRef.current = el; }}  // beide refs
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        setEditName(false);    // waarde blijft in RHF
                                    }
                                }}
                            />
                        </CustomBox>
                    )}

                    <CustomButton
                        type="button"
                        variant="link"
                        onClick={() => setEditName(v => !v)}
                        className="shrink-0 flex items-center gap-1"
                    >
                        {editName ? <Check size={16} /> : <Pencil size={16} />}
                        {nameBtnLabel}
                    </CustomButton>
                </CustomBox>

                {cameraError && <ErrorDialog open onClose={() => {}} message={cameraError} type="error" />}
                {renderDialogs()}

                <CustomDivider className="my-6" />

                {/* Description */}
                {!editDesc ? (
                    <CustomBox>
                        <CustomTypography className="italic">
                            {descVal || "Add a short description..."}
                        </CustomTypography>

                        <CustomButton
                            type="button"
                            variant="link"
                            onClick={() => setEditDesc(true)}
                            className="mt-2 flex items-center gap-1"
                        >
                            <Pencil size={16} />
                            {descBtnLabel} {/* "Set description" of "Edit description" */}
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <CustomBox>
                        <CustomTextField
                            label="Meal Description"
                            {...descReg}
                            error={!!errors.mealDescription}
                            helperText={errors.mealDescription?.message}
                            multiline
                            rows={5}
                            ref={(el) => { descRHFRef(el); descInputRef.current = el; }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    setEditDesc(false);
                                }
                            }}
                        />
                        <CustomBox className="mt-2 flex justify-end">
                            <CustomButton
                                type="button"
                                variant="link"
                                onClick={() => setEditDesc(false)}
                                className="flex items-center gap-1"
                            >
                                <Check size={16} />
                                Done
                            </CustomButton>
                        </CustomBox>
                    </CustomBox>
                )}

                <CustomDivider className="my-6" />

                {/* Ingredients */}
                {!editIngr ? (
                    <CustomBox>
                        {hasIngredient ? (
                            <MealCardIngredients ingredients={ingrVal} />
                        ) : (
                            <CustomTypography className="text-muted-foreground">
                                No ingredients yet.
                            </CustomTypography>
                        )}

                        <CustomButton
                            type="button"
                            variant="link"
                            onClick={() => setEditIngr(true)}
                            className="mt-2 flex items-center gap-1"
                        >
                            <Pencil size={16} />
                            {ingrBtnLabel} {/* Add ingredients / Edit ingredients */}
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <Controller
                        name="mealIngredients"
                        control={control}
                        defaultValue={[{ foodItemId: "", quantity: 0 }]}
                        render={({ field: { onChange, value } }) => (
                            <CustomBox
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                        e.preventDefault();
                                        setEditIngr(false);
                                    }
                                }}
                            >
                                <CreateMealMealIngredients
                                    value={value}
                                    onChange={onChange}
                                    errors={errors.mealIngredients}
                                />
                                {errors.mealIngredients?.message && (
                                    <p className="text-error text-sm mt-1">
                                        {errors.mealIngredients.message}
                                    </p>
                                )}
                                <CustomBox className="mt-2 flex justify-end">
                                    <CustomButton
                                        type="button"
                                        variant="link"
                                        onClick={() => setEditIngr(false)}
                                        className="flex items-center gap-1"
                                    >
                                        <Check size={16} />
                                        Done
                                    </CustomButton>
                                </CustomBox>
                            </CustomBox>
                        )}
                    />
                )}


                <CustomDivider className="my-6" />

                {/* Macros */}
                {macros ? (
                    <MealCardMacrosSection macros={macros} />
                ) : (
                    <CustomTypography className="text-sm text-muted-foreground">
                        Macros will appear once ingredients are set.
                    </CustomTypography>
                )}

                <CustomDivider className="my-6" />

                {/* Tags & time */}
                {!editTags ? (
                    <CustomBox className="flex flex-col gap-3">
                        <MealCardMealTags
                            cuisines={cuisinesVal}
                            diets={dietsVal}
                            mealTypes={typesVal}
                            onFilter={() => {}}
                            forceExpand
                        />

                        <CustomButton
                            type="button"
                            variant="link"
                            onClick={() => setEditTags(true)}
                            className="flex items-center gap-1"
                        >
                            <Pencil size={16} />
                            {tagsBtnLabel} {/* Set tags & time / Edit or add tags & time */}
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <CustomBox
                        onKeyDown={(e) => {
                            // Ctrl/Cmd+Enter to finish editing (since dropdowns capture Enter)
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                setEditTags(false);
                            }
                        }}
                    >
                        <CreateMealDropdowns control={control} errors={errors} />

                        <CustomBox className="mt-2 flex justify-end">
                            <CustomButton
                                type="button"
                                variant="link"
                                onClick={() => setEditTags(false)}
                                className="flex items-center gap-1"
                            >
                                <Check size={16} />
                                Done
                            </CustomButton>
                        </CustomBox>
                    </CustomBox>
                )}


                {/* Footer */}
                <CustomBox className="mt-8 flex items-center justify-end gap-3">
                    <CustomButton type="button" variant="ghost">
                        Cancel
                    </CustomButton>
                    <CustomButton type="submit" className="bg-primary text-white" disabled={!(isValid && hasIngredient)}>
                        Upload Meal
                    </CustomButton>
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

export default CreateMealFormCard;
