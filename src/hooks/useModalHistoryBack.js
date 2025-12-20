import { useCallback, useEffect, useRef } from "react";

/**
 * useModalHistoryBack
 * - Pushes 1 history state when open (guarded for StrictMode)
 * - Back/back-swipe triggers onHistoryBack (if provided) else onRequestClose
 * - UI close calls requestClose() -> history.back() -> popstate -> closes once
 */
export default function useModalHistoryBack({
                                                isOpen,
                                                onRequestClose,
                                                onHistoryBack,
                                                disabled = false,
                                                stateKey = "bb_modal",
                                            }) {
    const pushedRef = useRef(false);
    const closingFromPopRef = useRef(false);

    const pushHistoryState = useCallback(() => {
        if (pushedRef.current) return;

        const currentState = window.history.state || {};
        if (currentState.__modal === true && currentState.__key === stateKey) {
            pushedRef.current = true;
            return;
        }

        window.history.pushState({ ...currentState, __modal: true, __key: stateKey }, "");
        pushedRef.current = true;
    }, [stateKey]);

    const requestClose = useCallback(() => {
        if (!isOpen) return;

        // UI close: go back one history step; popstate handler will close
        if (pushedRef.current && !closingFromPopRef.current) {
            window.history.back();
            return;
        }

        // Fallback
        onRequestClose?.("ui");
    }, [isOpen, onRequestClose]);

    useEffect(() => {
        if (!isOpen || disabled) return;

        pushHistoryState();

        const onPopState = async () => {
            const state = window.history.state || {};

            // If the new current state is NOT the modal marker, we just navigated back out of the modal.
            // In that case we should close/cancel if the modal is open.
            if (!isOpen) return;

            // If we had pushed a modal marker, Back will bring us to a state without that marker.
            // So we close/cancel when marker is absent.
            const isModalState = state.__modal === true && state.__key === stateKey;

            if (isModalState) return; // still "inside" modal history state, do nothing

            closingFromPopRef.current = true;

            if (onHistoryBack) {
                await onHistoryBack();
            } else {
                onRequestClose?.("history");
            }

            pushedRef.current = false;

            setTimeout(() => {
                closingFromPopRef.current = false;
            }, 0);
        };


        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [isOpen, disabled, pushHistoryState, onRequestClose, onHistoryBack, stateKey]);


    useEffect(() => {
        if (!isOpen) {
            pushedRef.current = false;
            closingFromPopRef.current = false;
        }
    }, [isOpen]);

    return { requestClose };
}
