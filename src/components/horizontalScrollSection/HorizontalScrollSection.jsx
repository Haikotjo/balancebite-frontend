import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, ArrowRight  } from "lucide-react";
import CustomBox from "../layout/CustomBox";
import {useEffect, useRef, useState} from "react";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";

const HorizontalScrollSection = ({ title, items, renderItem, onTitleClick }) => {
    const scrollRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

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
            const walk = (x - startX.current) * 2; // scrollsnelheid
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

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const checkScroll = () => {
            setCanScroll(slider.scrollWidth > slider.clientWidth);
        };

        checkScroll();

        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [items]); // opnieuw checken bij verandering van items


    return (
        <CustomBox className="w-full my-6 ">

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

            <CustomBox className="relative py-2 bg-softIvory/50 dark:bg-cardDark rounded-xl">

                <CustomBox
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto scrollbar-hide px-8 py-2"
                >
                    {items.map((item, index) => (
                        <CustomBox key={index} className="shrink-0">
                            {renderItem(item)}
                        </CustomBox>
                    ))}
                </CustomBox>


                {canScroll && (
                    <CustomIconButton
                        onClick={() => scroll("left")}
                        icon={<ChevronLeft size={20} className="text-white" />}
                        size={36}
                        className="absolute left-2 top-[50%] translate-y-[-50%] z-10"
                        useMotion={false}
                    />
                )}

                {canScroll && (
                    <CustomIconButton
                        onClick={() => scroll("right")}
                        icon={<ChevronRight size={20} className="text-white" />}

                        size={36}
                        className="absolute right-2 top-[50%] translate-y-[-50%] z-10"
                        useMotion={false}
                    />
                )}



            </CustomBox>
        </CustomBox>
    );
};

HorizontalScrollSection.propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    onTitleClick: PropTypes.func, // optional
};


export default HorizontalScrollSection;
