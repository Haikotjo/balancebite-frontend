import { useEffect, useState } from "react";

const useIsLargeScreen = () => {
    const [isLarge, setIsLarge] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth >= 1024; // Tailwind 'lg' breakpoint
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsLarge(window.innerWidth >= 1024);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isLarge;
};

export default useIsLargeScreen;
