// src/components/scrollToTopButton/ScrollToTopButton.jsx
import { useState, useEffect } from "react";
import { ChevronsUp } from "lucide-react";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * ScrollToTopButton
 *
 * A floating action button that appears once the user scrolls down
 * more than 200px. When clicked, it smoothly scrolls the window back to the top.
 *
 * Designed with CustomIconButton and CustomBox for easy React Native migration.
 *
 * @component
 * @returns {JSX.Element|null} The scroll-to-top button or null when not visible.
 */
const ScrollToTopButton = () => {
    // State to control visibility of the button
    const [visible, setVisible] = useState(false);

    // Register scroll listener on mount, unregister on unmount
    useEffect(() => {
        const onScroll = () => {
            // Show button when user has scrolled more than 200px
            setVisible(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /**
     * Scroll the window to the top smoothly.
     */
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Don't render anything if button shouldn't be visible
    if (!visible) return null;

    return (
        <CustomBox className="fixed bottom-14 sm:bottom-10 right-5 z-50">
            {/*
              CustomIconButton handles touch animation and theming.
              ChevronsUp icon size chosen for clarity.
            */}
            <CustomIconButton
                onClick={scrollToTop}
                icon={<ChevronsUp size={20} className="text-white" />}
                bgColor="bg-primary"
                size={30}
            />
        </CustomBox>
    );
};

export default ScrollToTopButton;
