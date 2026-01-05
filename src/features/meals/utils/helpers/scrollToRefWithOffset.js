// src/utils/helpers/scrollToRefWithOffset.js
// Purpose: Smoothly scroll to a ref with an optional offset, supporting custom scroll containers.

/**
 * Find the nearest scrollable parent (overflow-y: auto|scroll).
 */
const getScrollParent = (node) => {
    let el = node?.parentElement;

    while (el) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;

        if (
            (overflowY === "auto" || overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight
        ) {
            return el;
        }

        el = el.parentElement;
    }

    return document.scrollingElement || document.documentElement;
};

/**
 * Scroll smoothly to a ref with a vertical offset.
 *
 * @param {React.RefObject} ref
 * @param {number} offset - Pixels above the target (e.g. for sticky headers)
 */
export const scrollToRefWithOffset = (ref, offset = 80) => {
    const target = ref?.current;
    if (!target) return;

    const scroller = getScrollParent(target);

    const targetTop = target.getBoundingClientRect().top;
    const scrollerTop =
        typeof scroller.getBoundingClientRect === "function"
            ? scroller.getBoundingClientRect().top
            : 0;

    const current = targetTop - scrollerTop;

    scroller.scrollTo({
        top: scroller.scrollTop + current - offset,
        behavior: "smooth",
    });
};
