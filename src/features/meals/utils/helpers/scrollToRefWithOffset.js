// src/utils/helpers/scrollToRefWithOffset.js
// Purpose: Smoothly scroll to a ref with an optional offset, supporting custom scroll containers.

export const scrollToRefWithOffset = (ref, offset = 100) => {
    if (!ref?.current) return;

    requestAnimationFrame(() => {
        setTimeout(() => {
            const element = ref.current;

            const scrollContainer = element.closest("[data-scroll-container]");

            if (scrollContainer) {
                const containerTop = scrollContainer.getBoundingClientRect().top;
                const elementTop = element.getBoundingClientRect().top;

                scrollContainer.scrollTo({
                    top: scrollContainer.scrollTop + (elementTop - containerTop) - offset,
                    behavior: "smooth",
                });
            } else {
                const y =
                    element.getBoundingClientRect().top +
                    window.pageYOffset -
                    offset;

                window.scrollTo({
                    top: y,
                    behavior: "smooth",
                });
            }
        }, 120);
    });
};
