// useMealImageSlots.js
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { createEmptySlots, extractFilesFromSlots } from "../helpers/mealImageHelpers.js";

export const useMealImageSlots = ({ maxSlots, onImagesChange, initialImages = [] }) => {
    const [slots, setSlots] = useState(() => createEmptySlots(maxSlots, true)); // with id
    const [primaryIndex, setPrimaryIndex] = useState(null);
    const didInitRef = useRef(false);

    const filesArray = useMemo(() => extractFilesFromSlots(slots), [slots]);

    const effectivePrimaryIndex = useMemo(() => {
        if (filesArray.length > 0 && primaryIndex == null) return 0;
        return primaryIndex;
    }, [filesArray.length, primaryIndex]);

    const revokeBlobPreviewUrl = useCallback((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    }, []);

    const emitChange = useCallback(
        (nextSlots, nextPrimarySlot) => {
            const keepImageIds = nextSlots.filter((s) => !s.file && s.id).map((s) => s.id);

            const replaceOrderIndexes = nextSlots
                .map((s, idx) => (s.file ? idx : null))
                .filter((v) => v !== null);

            const imageFiles = replaceOrderIndexes.map((idx) => nextSlots[idx].file);

            const primaryImageId =
                nextPrimarySlot != null ? (nextSlots[nextPrimarySlot]?.id ?? null) : null;

            onImagesChange?.({
                imageFiles,
                replaceOrderIndexes,
                keepImageIds,
                primaryIndex: nextPrimarySlot ?? null,
                primaryImageId,
            });
        },
        [onImagesChange]
    );

    // ✅ NEW: init from initialImages (moved from MealImageUploader)
    useEffect(() => {
        // ✅ Create flow: initialImages is empty -> do nothing (prevents loop + resets while typing)
        if (didInitRef.current) return;
        if (!initialImages || initialImages.length === 0) return;

        const next = createEmptySlots(maxSlots, true);
        const sorted = [...initialImages].sort((a, b) => a.orderIndex - b.orderIndex);

        sorted.slice(0, maxSlots).forEach((img, idx) => {
            next[idx] = { file: null, previewUrl: img.imageUrl, id: img.id };
        });

        setSlots(next);

        const slice = sorted.slice(0, maxSlots);
        const pIdx = slice.findIndex((i) => i.primary);
        setPrimaryIndex(pIdx !== -1 ? pIdx : (slice.length ? 0 : null));

        // ❌ NIET emitChange hier (dat veroorzaakt loops)
        didInitRef.current = true;
    }, [maxSlots, initialImages]); // geen emitChange / JSON.stringify

    const setSlotFile = useCallback(
        (slotIndex, file) => {
            setSlots((prev) => {
                const next = [...prev];

                revokeBlobPreviewUrl(next[slotIndex]?.previewUrl);

                const previewUrl = file ? URL.createObjectURL(file) : null;
                next[slotIndex] = { ...next[slotIndex], file, previewUrl };

                emitChange(next, primaryIndex);
                return next;
            });
        },
        [emitChange, primaryIndex, revokeBlobPreviewUrl]
    );

    const clearSlot = useCallback(
        (slotIndex) => {
            setSlots((prev) => {
                const next = [...prev];

                revokeBlobPreviewUrl(next[slotIndex]?.previewUrl);

                // remove slot content (and id so it's NOT kept)
                next[slotIndex] = { file: null, previewUrl: null, id: null };

                let nextPrimary = primaryIndex;

                // if you removed a slot before the primary, primary shifts left
                if (nextPrimary != null && slotIndex < nextPrimary) {
                    nextPrimary = nextPrimary - 1;
                }

                // if you removed the primary slot itself, pick first filled slot
                if (nextPrimary != null && slotIndex === nextPrimary) {
                    const firstFilled = next.findIndex((s) => !!s.file || !!s.previewUrl);
                    nextPrimary = firstFilled !== -1 ? firstFilled : null;
                }

                // if no images left
                if (next.every((s) => !s.file && !s.previewUrl)) {
                    nextPrimary = null;
                }

                setPrimaryIndex(nextPrimary);
                emitChange(next, nextPrimary);
                return next;
            });
        },
        [emitChange, primaryIndex, revokeBlobPreviewUrl]
    );


    const setPrimaryBySlot = useCallback(
        (slotIndex) => {
            const isFilled = !!slots[slotIndex]?.file || !!slots[slotIndex]?.previewUrl;
            if (!isFilled) return;

            setPrimaryIndex(slotIndex);
            emitChange(slots, slotIndex);
        },
        [emitChange, slots]
    );

    return {
        slots,
        setSlots,
        primaryIndex,
        setPrimaryIndex,

        filesArray,
        effectivePrimaryIndex,

        setSlotFile,
        clearSlot,
        setPrimaryBySlot,

        revokeBlobPreviewUrl,
        emitChange,
    };
};
