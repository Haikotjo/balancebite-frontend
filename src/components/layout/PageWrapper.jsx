import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "./CustomBox.jsx";

/**
 * PageWrapper
 *
 * Purpose:
 * - Ensures page content sits next to the fixed sidebar on desktop.
 * - Ensures page content stays above the fixed bottom bar on mobile.
 * - Applies consistent page paddings.
 *
 * Assumptions:
 * - Desktop sidebar has a fixed width of 72px.
 * - Mobile bottom bar has a fixed height of 72px.
 * - Uses iOS safe-area inset for devices with rounded corners.
 *
 * Props:
 * - children: React nodes to render inside the wrapper.
 * - className: optional extra Tailwind classes.
 * - narrow: when true, constrains content width and centers it.
 */
export default function PageWrapper({ children, className = "", narrow = false }) {
    return (
        <CustomBox
            className={clsx(
                // Base page paddings (top + horizontal)
                "min-h-screen pt-6 sm:pt-10 px-4",

                // Mobile: reserve space for bottom bar (72px) + safe area.
                // Desktop (md+): remove bottom padding because sidebar is left, not bottom.
                "pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-0",

                // Desktop: leave space for fixed left sidebar (72px)
                "md:ml-[72px]",

                // Additional classes passed in
                className
            )}
        >
            {/* Inner container centers and caps width */}
            <CustomBox className={clsx(
                "w-full max-w-[1750px] mx-auto", // cap to 1800px and center
                narrow && "max-w-screen-lg"     // optional narrower layout
            )}>
                {children}
            </CustomBox>
        </CustomBox>
    );
}

PageWrapper.propTypes = {
    /** Content to render inside the wrapper. */
    children: PropTypes.node.isRequired,
    /** Additional Tailwind classes for custom layouts. */
    className: PropTypes.string,
    /** Constrain content width and center it. */
    narrow: PropTypes.bool,
};
