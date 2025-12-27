// src/features/meals/hooks/useMealImageSlots.js
// Manages slots + primary selection. UI (chooser/modal) stays in the component.

import { useCallback, useMemo, useState } from "react";
import {createEmptySlots, extractFilesFromSlots} from "../helpers/mealImageHelpers.js";


export const useMealImageSlots = ({ maxSlots, onImagesChange }) => {
    const [slots, setSlots] = useState(() => createEmptySlots(maxSlots));
    const [primaryIndex, setPrimaryIndex] = useState(null);

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

            onImagesChange?.({
                imageFiles,
                replaceOrderIndexes,
                keepImageIds,
                primaryIndex: nextPrimarySlot ?? null,
            });
        },
        [onImagesChange]
    );

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

                next[slotIndex] = { file: null, previewUrl: null };

                let nextPrimary = primaryIndex;
                const nextFiles = extractFilesFromSlots(next);
                if (nextFiles.length === 0) nextPrimary = null;

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
        setSlots, // for initialImages effect (later)
        primaryIndex,
        setPrimaryIndex,

        filesArray,
        effectivePrimaryIndex,

        setSlotFile,
        clearSlot,
        setPrimaryBySlot,

        revokeBlobPreviewUrl, // for "clear all" UI block
        emitChange, // for initialImages effect (later)
    };
};
