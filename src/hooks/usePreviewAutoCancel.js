import { useCallback, useEffect, useRef } from "react";

/**
 * usePreviewAutoCancel
 * Ensures: if preview modal closes/unmounts WITHOUT confirm -> run onCancel(meal)
 * Handles React 18 StrictMode dev double-invoke via "armed" tick.
 */
export default function usePreviewAutoCancel({ meal, isPreview, onCancel }) {
    const confirmedRef = useRef(false);
    const cancelledRef = useRef(false);
    const armedRef = useRef(false);

    // Reset flags when a new meal opens
    useEffect(() => {
        if (!meal) return;
        confirmedRef.current = false;
        cancelledRef.current = false;
        armedRef.current = false;
    }, [meal?.id]);

    // Arm after first tick (avoids StrictMode dev fake cleanup)
    useEffect(() => {
        if (!meal || !isPreview) return;

        const t = setTimeout(() => {
            armedRef.current = true;
        }, 0);

        return () => clearTimeout(t);
    }, [meal?.id, isPreview]);

    const markConfirmed = useCallback(() => {
        confirmedRef.current = true;
    }, []);

    const markCancelled = useCallback(() => {
        cancelledRef.current = true;
    }, []);

    useEffect(() => {
        if (!meal || !isPreview) return;

        return () => {
            if (!armedRef.current) return;
            if (confirmedRef.current) return;
            if (cancelledRef.current) return;

            try {
                void onCancel?.(meal);
            } catch (err) {
                console.error("Auto-cancel failed:", err);
            }
        };
    }, [meal, isPreview, onCancel]);

    return { markConfirmed, markCancelled };
}
