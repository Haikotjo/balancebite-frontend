import { useEffect, useState } from "react";

/**
 * Shared floating actions logic.
 * @param {Object} params
 * @param {any} params.entity - meal/diet object; hook is inactive when falsy
 * @param {boolean} params.disabled - when true: never show floating actions
 * @param {React.RefObject<HTMLElement>} params.contentRef
 * @param {React.RefObject<HTMLElement>} params.cardRef
 * @param {React.RefObject<HTMLElement>} params.actionsAnchorRef
 */
function useFloatingActionsBase({
                                    entity,
                                    disabled = false,
                                    contentRef,
                                    cardRef,
                                    actionsAnchorRef,
                                }) {
    const [showFloatingActions, setShowFloatingActions] = useState(false);
    const [floatingStyle, setFloatingStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (!entity) return;

        if (disabled) {
            setShowFloatingActions(false);
            return;
        }

        const scrollEl = contentRef.current;
        const cardEl = cardRef.current;
        const anchorEl = actionsAnchorRef.current;

        if (!scrollEl || !cardEl || !anchorEl) return;

        const compute = () => {
            const scrollRect = scrollEl.getBoundingClientRect();
            const cardRect = cardEl.getBoundingClientRect();
            const anchorRect = anchorEl.getBoundingClientRect();

            const anchorOutOfView = anchorRect.bottom <= scrollRect.top + 4;
            const cardVisible =
                cardRect.bottom > scrollRect.top + 40 &&
                cardRect.top < scrollRect.bottom - 40;

            setShowFloatingActions(anchorOutOfView && cardVisible);
            setFloatingStyle({ left: cardRect.left, width: cardRect.width });
        };

        compute();
        scrollEl.addEventListener("scroll", compute, { passive: true });
        window.addEventListener("resize", compute);

        const ro = new ResizeObserver(compute);
        ro.observe(scrollEl);
        ro.observe(cardEl);

        return () => {
            scrollEl.removeEventListener("scroll", compute);
            window.removeEventListener("resize", compute);
            ro.disconnect();
        };
    }, [entity, disabled, contentRef, cardRef, actionsAnchorRef]);

    return { showFloatingActions, floatingStyle };
}

/**
 * Meal floating actions hook (keeps preview behavior).
 */
export function useMealFloatingActions({
                                           meal,
                                           isPreview,
                                           contentRef,
                                           cardRef,
                                           actionsAnchorRef,
                                       }) {
    return useFloatingActionsBase({
        entity: meal,
        disabled: !!isPreview,
        contentRef,
        cardRef,
        actionsAnchorRef,
    });
}

/**
 * Diet floating actions hook.
 */
export function useDietFloatingActions({
                                           diet,
                                           contentRef,
                                           cardRef,
                                           actionsAnchorRef,
                                       }) {
    return useFloatingActionsBase({
        entity: diet,
        disabled: false,
        contentRef,
        cardRef,
        actionsAnchorRef,
    });
}
