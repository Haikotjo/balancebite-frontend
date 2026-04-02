// Animation config for homepage sections
export const sectionFade = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Shared chip styling — adapts to light and dark mode via content token
export const chipBaseClass =
    "inline-flex items-center gap-2 rounded-full border border-content/40 bg-content/5 px-3 py-1 text-xs font-medium backdrop-blur text-content dark:text-white";