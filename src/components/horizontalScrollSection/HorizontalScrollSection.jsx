import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import CustomBox from "../layout/CustomBox";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import { twMerge } from "tailwind-merge";
import { useDragScroll } from "../../hooks/useDragScroll.js";

const HorizontalScrollSection = ({
                                     title,
                                     items,
                                     renderItem,
                                     onTitleClick,
                                     className = "",
                                     autoScroll = false,
                                     scrollSpeed = 1,
                                     autoScrollDirection = "right"
                                 }) => {
    const scrollRef = useRef(null);
    const intervalRef = useRef(null);

    useDragScroll(scrollRef);

    const [canScroll, setCanScroll] = useState(false);

    const scroll = (direction) => {
        const scrollAmount = 300;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const checkScroll = () => {
            setCanScroll(slider.scrollWidth > slider.clientWidth);
        };

        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [items]);

    useEffect(() => {
        if (!autoScroll) return;

        const container = scrollRef.current;
        if (!container) return;

        const isSmallScreen = window.innerWidth < 1024;

        const startAutoScroll = () => {
            if (!isSmallScreen) return;
            if (intervalRef.current) return;

            intervalRef.current = setInterval(() => {
                if (autoScrollDirection === "right") {
                    // ✔ content naar rechts
                    if (container.scrollLeft <= 0) {
                        container.scrollLeft = container.scrollWidth - container.clientWidth;
                    } else {
                        container.scrollLeft -= scrollSpeed;
                    }
                } else {
                    // ✔ content naar links
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                        container.scrollLeft = 0;
                    } else {
                        container.scrollLeft += scrollSpeed;
                    }
                }
            }, 100);
        };

        const stopAutoScroll = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        startAutoScroll();
        container.addEventListener("mouseenter", stopAutoScroll);
        container.addEventListener("mouseleave", startAutoScroll);

        return () => {
            stopAutoScroll();
            container.removeEventListener("mouseenter", stopAutoScroll);
            container.removeEventListener("mouseleave", startAutoScroll);
        };
    }, [autoScroll, scrollSpeed, autoScrollDirection, items.length]);


    return (
        <CustomBox className={twMerge("w-full my-6", className)}>
            {title && (
                <CustomTypography
                    as="h2"
                    variant="h4"
                    className="mb-2 px-2 text-left text-base sm:text-lg md:text-xl"
                >
                    {onTitleClick ? (
                        <CustomBox
                            onClick={onTitleClick}
                            className="ml-10 inline-flex items-center gap-1 cursor-pointer hover:underline hover:text-primary dark:hover:text-primary"
                        >
                            {title}
                            <ArrowRight size={18} />
                        </CustomBox>
                    ) : (
                        <CustomBox className="ml-10">{title}</CustomBox>
                    )}
                </CustomTypography>
            )}

            <CustomBox className="relative py-2 rounded-xl">
                <CustomBox
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1 cursor-grab active:cursor-grabbing"
                >
                    {items.map((item, index) => (
                        <CustomBox key={index} className="shrink-0">
                            {renderItem(item)}
                        </CustomBox>
                    ))}
                </CustomBox>

                {canScroll && (
                    <CustomBox className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                        <CustomIconButton
                            icon={<ChevronLeft />}
                            onClick={() => scroll("left")}
                            bgColor="bg-[rgba(0,0,0,0.5)]"
                            sizeClassName="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9"
                            iconSize={18}
                            className="text-white"
                            useMotion
                        />
                    </CustomBox>
                )}

                {canScroll && (
                    <CustomBox className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                        <CustomIconButton
                            icon={<ChevronRight />}
                            onClick={() => scroll("right")}
                            bgColor="bg-[rgba(0,0,0,0.5)]"
                            sizeClassName="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9"
                            iconSize={18}
                            className="text-white"
                            useMotion
                        />
                    </CustomBox>
                )}

            </CustomBox>
        </CustomBox>
    );
};

HorizontalScrollSection.propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    onTitleClick: PropTypes.func,
    className: PropTypes.string,
    autoScroll: PropTypes.bool,
    scrollSpeed: PropTypes.number,
    autoScrollDirection: PropTypes.oneOf(["left", "right"]),
};

export default HorizontalScrollSection;
