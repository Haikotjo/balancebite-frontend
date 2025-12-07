// useIsSmallScreen.js
import { useEffect, useState } from "react";

const useIsSmallScreen = () => {
    const [isSmall, setIsSmall] = useState(() => {
        if (typeof window !== "undefined" && window.matchMedia) {
            return window.matchMedia("(max-width: 640px)").matches;
        }
        return false; // safe default for SSR
    });

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQuery = window.matchMedia("(max-width: 640px)");

        const handleChange = (event) => {
            setIsSmall(event.matches);
        };

        // Subscribe to changes
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isSmall;
};

export default useIsSmallScreen;
