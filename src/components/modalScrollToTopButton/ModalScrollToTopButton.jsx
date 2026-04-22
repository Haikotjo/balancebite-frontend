import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ArrowUpToLine } from "lucide-react";

const ModalScrollToTopButton = ({ targetRef }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = targetRef?.current;
        if (!el) return;
        const onScroll = () => setVisible(el.scrollTop > 200);
        el.addEventListener("scroll", onScroll);
        return () => el.removeEventListener("scroll", onScroll);
    }, [targetRef]);

    const scrollToTop = () => {
        targetRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="absolute bottom-4 left-4 z-[2147483003] flex items-center gap-1.5 rounded-full bg-primary/90 backdrop-blur-sm px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-emphasis hover:shadow-primary/40 hover:-translate-y-0.5"
        >
            <ArrowUpToLine className="h-4 w-4" />
            Top
        </button>
    );
};

ModalScrollToTopButton.propTypes = {
    targetRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default ModalScrollToTopButton;
