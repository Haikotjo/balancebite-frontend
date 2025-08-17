// CreateMealFormCard.jsx
// WYSIWYG card with inline editors + safe image preview.
// Backend contract preserved: the hook alone updates imageFile (File) / imageUrl (string).

import { useState, useMemo, useEffect } from "react";
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

    // Track form values (driven by the hook)
    const fileValue = watch("imageFile");
    const urlValue = (watch("imageUrl") || hookImageUrl || "").trim();

    const nameVal = watch("name") || "";
    const descVal = watch("mealDescription") || "";
    const ingrVal = watch("mealIngredients") || [];
    const typesVal = watch("mealTypes") || [];
    const cuisinesVal = watch("cuisines") || [];
    const dietsVal = watch("diets") || [];
    const prepVal = watch("preparationTime") || "";

    // --- Preview from RHF state only (no extra setValue here) ---
    const fileCandidate = useMemo(() => {
        if (!fileValue) return null;
        if (fileValue instanceof File) return fileValue;
        if (Array.isArray(fileValue) && fileValue[0] instanceof File) return fileValue[0];
        if (typeof FileList !== "undefined" && fileValue instanceof FileList && fileValue.length > 0) {
            return fileValue[0];
        }
        return null;
    }, [fileValue]);

    const [objUrl, setObjUrl] = useState(null);
    useEffect(() => {
        if (!fileCandidate) {
            setObjUrl(null);
            return;
        }
        const u = URL.createObjectURL(fileCandidate);
        setObjUrl(u);
        return () => URL.revokeObjectURL(u);
    }, [fileCandidate]);

    const previewSrc = objUrl || (urlValue ? urlValue : null);
    // ------------------------------------------------------------

    // Enable submit
    const hasIngredient =
        Array.isArray(ingrVal) && ingrVal.some((ing) => ing?.foodItemId && String(ing.foodItemId).trim() !== "");

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
                                // Preview stays in sync because we derive it from RHF state.
                                // Delegate ALL updates to your existing hook (same as CreateMealForm).
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
                            {nameVal || "Set meal name"}
                        </CustomTypography>
                    ) : (
                        <CustomBox className="w-full max-w-xl">
                            <CustomTextField
                                label="Meal Name"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </CustomBox>
                    )}

                    <CustomButton
                        type="button"
                        variant="ghost"
                        onClick={() => setEditName((v) => !v)}
                        className="shrink-0"
                    >
                        {editName ? "Done" : "Set name"}
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
                        <CustomButton type="button" variant="ghost" onClick={() => setEditDesc(true)} className="mt-2">
                            Edit description
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <CustomBox>
                        <CustomTextField
                            label="Meal Description"
                            {...register("mealDescription")}
                            error={!!errors.mealDescription}
                            helperText={errors.mealDescription?.message}
                            multiline
                            rows={5}
                        />
                        <CustomBox className="mt-2 flex justify-end">
                            <CustomButton type="button" variant="ghost" onClick={() => setEditDesc(false)}>
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
                            <CustomTypography className="text-muted-foreground">No ingredients yet.</CustomTypography>
                        )}
                        <CustomButton type="button" variant="ghost" onClick={() => setEditIngr(true)} className="mt-2">
                            {hasIngredient ? "Edit ingredients" : "Add ingredients"}
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <Controller
                        name="mealIngredients"
                        control={control}
                        defaultValue={[{ foodItemId: "", quantity: 0 }]}
                        render={({ field: { onChange, value } }) => (
                            <CustomBox>
                                <CreateMealMealIngredients value={value} onChange={onChange} errors={errors.mealIngredients} />
                                {errors.mealIngredients?.message && (
                                    <p className="text-error text-sm mt-1">{errors.mealIngredients.message}</p>
                                )}
                                <CustomBox className="mt-2 flex justify-end">
                                    <CustomButton type="button" variant="ghost" onClick={() => setEditIngr(false)}>
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
                        <CustomButton type="button" variant="ghost" onClick={() => setEditTags(true)}>
                            Edit tags & time
                        </CustomButton>
                    </CustomBox>
                ) : (
                    <CustomBox>
                        <CreateMealDropdowns control={control} errors={errors} />
                        <CustomBox className="mt-2 flex justify-end">
                            <CustomButton type="button" variant="ghost" onClick={() => setEditTags(false)}>
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
