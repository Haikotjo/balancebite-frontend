import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomBox from "../layout/CustomBox";
import CustomIconButton from "../layout/CustomIconButton";

const ImageScrollSection = ({ images = [], scrollSpeed = 1 }) => {
    const scrollRef = useRef(null);
    const intervalRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [canScroll, setCanScroll] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const checkScroll = () => {
            setCanScroll(container.scrollWidth > container.clientWidth);
        };

        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [images]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const isSmallScreen = window.innerWidth < 1024;

        const startAutoScroll = () => {
            if (!isSmallScreen) return;
            intervalRef.current = setInterval(() => {
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft += scrollSpeed;
                }
            }, 100);
        };

        const stopAutoScroll = () => clearInterval(intervalRef.current);

        startAutoScroll();
        container.addEventListener("mouseenter", stopAutoScroll);
        container.addEventListener("mouseleave", startAutoScroll);

        return () => {
            stopAutoScroll();
            container.removeEventListener("mouseenter", stopAutoScroll);
            container.removeEventListener("mouseleave", startAutoScroll);
        };
    }, [scrollSpeed]);

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const handleDown = (e) => {
            e.preventDefault();
            isDown.current = true;
            slider.classList.add("cursor-grabbing");
            startX.current = e.pageX - slider.offsetLeft;
            scrollLeft.current = slider.scrollLeft;
        };

        const handleLeave = () => {
            isDown.current = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleUp = () => {
            isDown.current = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleMove = (e) => {
            if (!isDown.current) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX.current) * 2;
            slider.scrollLeft = scrollLeft.current - walk;
        };

        slider.addEventListener("mousedown", handleDown);
        slider.addEventListener("mouseleave", handleLeave);
        slider.addEventListener("mouseup", handleUp);
        slider.addEventListener("mousemove", handleMove);

        return () => {
            slider.removeEventListener("mousedown", handleDown);
            slider.removeEventListener("mouseleave", handleLeave);
            slider.removeEventListener("mouseup", handleUp);
            slider.removeEventListener("mousemove", handleMove);
        };
    }, []);

    const scroll = (direction) => {
        const scrollAmount = 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <CustomBox className="w-full overflow-hidden relative py-2">
            <CustomBox
                ref={scrollRef}
                className="flex gap-1 overflow-x-auto scrollbar-hide transition-all cursor-grab active:cursor-grabbing px-2"
            >
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`image-${index}`}
                        className="h-32 w-auto rounded-md object-cover shrink-0"
                    />
                ))}
            </CustomBox>

            {isLargeScreen && canScroll && (
                <>
                    <CustomIconButton
                        onClick={() => scroll("left")}
                        icon={<ChevronLeft size={20} className="text-white" />}
                        size={36}
                        className="absolute left-4 top-[60%] translate-y-[-50%] z-10"
                        useMotion={false}
                    />
                    <CustomIconButton
                        onClick={() => scroll("right")}
                        icon={<ChevronRight size={20} className="text-white" />}
                        size={36}
                        className="absolute right-4 top-[60%] translate-y-[-50%] z-10"
                        useMotion={false}
                    />
                </>
            )}
        </CustomBox>
    );
};

ImageScrollSection.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    scrollSpeed: PropTypes.number,
};

export default ImageScrollSection;
