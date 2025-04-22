// src/components/scrollToTopButton/ScrollToTopButton.jsx
import { useState, useEffect } from "react";
import { ChevronsUp } from "lucide-react";
import CustomIconButton from "../layout/CustomIconButton.jsx";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    // Show when scrolled down 200px
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 200);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <CustomIconButton
            onClick={scrollToTop}
            icon={<ChevronsUp size={20} />}
            bgColor="bg-primary"
            className="fixed bottom-20 right-5 z-50"
            size={30}
        />
    );
};

export default ScrollToTopButton;
