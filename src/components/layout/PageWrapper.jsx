import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "./CustomBox.jsx";
import BackgroundGlow from "./BackgroundGlow.jsx";

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
export default function PageWrapper({ children, className = "", narrow = false, isHome = false }) {
    return (
        <CustomBox
            className={clsx(
                "relative isolate min-h-screen",
                // Mobile: ruimte voor vaste topbalk (56px) + horizontale padding
                // Desktop (md+): geen topbalk, kleine padding bovenaan
                !isHome && "pt-6 px-4",

                // Geen bottom bar meer op mobile
                !isHome && "pb-6 md:pb-20",

                // Desktop: ruimte voor dunne vaste sidebar (48px = w-12)
                "md:ml-12",

                // Additional classes passed in
                className
            )}
        >
            <BackgroundGlow />

            {/* Inner container centers and caps width */}
            <CustomBox className={clsx(
                "w-full",
                !isHome && "max-w-[1750px] mx-auto",
                narrow && !isHome && "max-w-screen-lg"
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
