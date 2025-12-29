// MealImageCarousel.jsx
import PropTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Reuse your placeholders (same logic as getImageSrc)
const placeholderImages = import.meta.glob("/src/assets/images/placeholder/*.webp", { eager: true });
const placeholders = Object.values(placeholderImages).map((img) => img.default);

// MealImageCarousel.jsx
const MealImageCarousel = ({
                               meal,
                               alt = "",
                               className = "",
                               activeIndex,
                               onChangeIndex,
                               disableActions = false,
                           }) => {
    const images = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];
        if (arr.length > 0) {
            return [...arr]
                .sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0))
                .map((img) => img?.imageUrl?.trim())
                .filter(Boolean);
        }
        const urls = Array.isArray(meal?.imageUrls) ? meal.imageUrls : [];
        return urls.map((u) => (u ?? "").trim()).filter(Boolean);
    }, [meal?.images, meal?.imageUrls]);

    const safeIndex = images.length > 0 ? Math.min(Math.max(activeIndex ?? 0, 0), images.length - 1) : 0;

    const src = useMemo(() => {
        if (images.length > 0) return images[safeIndex] ?? images[0];
        if (placeholders.length > 0) return placeholders[Math.floor(Math.random() * placeholders.length)];
        return "/fallback.jpg";
    }, [images, safeIndex]);

    const hasNav = images.length > 1;

    const prev = () => {
        if (disableActions) return;
        onChangeIndex?.((safeIndex - 1 + images.length) % images.length);
    };

    const next = () => {
        if (disableActions) return;
        onChangeIndex?.((safeIndex + 1) % images.length);
    };

    return (
        <CustomBox className={className}>
            <CustomBox className="relative w-full h-full">
                <CustomImage src={src} alt={alt} className="w-full h-full object-cover" />

                {hasNav && (
                    <>
                        <CustomBox className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                            <CustomIconButton
                                icon={<ChevronLeft />}
                                onClick={prev}
                                bgColor="bg-[rgba(0,0,0,0.5)]"
                                sizeClassName="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9"
                                iconSize={18}
                                className="text-white"
                                useMotion
                            />
                        </CustomBox>

                        <CustomBox className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                            <CustomIconButton
                                icon={<ChevronRight />}
                                onClick={next}
                                bgColor="bg-[rgba(0,0,0,0.5)]"
                                sizeClassName="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9"
                                iconSize={18}
                                className="text-white"
                                useMotion
                            />
                        </CustomBox>
                        {/* Counter */}
                        <CustomBox
                            className="
        absolute
        bottom-8
        lg:bottom-24
        left-1/2
        -translate-x-1/2
        rounded-full
        px-2 py-1
        bg-black/45
        text-white
        text-xs
    "
                        >
                            {safeIndex + 1}/{images.length}
                        </CustomBox>

                        {/* Desktop thumbnails overlay (lg+) */}
                        <CustomBox
                            className={[
                                "hidden lg:block absolute bottom-8 left-0 right-0 p-2",
                                disableActions ? "pointer-events-none opacity-60" : "",
                            ].join(" ")}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CustomBox className="flex gap-6 justify-between overflow-x-auto">
                                {images.map((url, idx) => {
                                    const isActive = idx === safeIndex;

                                    return (
                                        <CustomIconButton
                                            key={`${url}-${idx}`}
                                            icon={
                                                <CustomImage
                                                    src={url}
                                                    alt=""
                                                    className={[
                                                        "w-16 h-12 object-cover rounded-lg",
                                                        isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                                                    ].join(" ")}
                                                />
                                            }
                                            onClick={() => {
                                                if (disableActions) return;
                                                onChangeIndex?.(idx);
                                            }}
                                            bgColor="bg-transparent"
                                            sizeClassName="w-16 h-12"
                                            disableScale
                                            useMotion={false}
                                            className={isActive ? "ring-2 ring-white" : "ring-1 ring-white/40"}
                                        />
                                    );
                                })}
                            </CustomBox>
                        </CustomBox>

                    </>

                )}
            </CustomBox>
        </CustomBox>
    );
};

MealImageCarousel.propTypes = {
    meal: PropTypes.object.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    activeIndex: PropTypes.number,
    onChangeIndex: PropTypes.func,
    disableActions: PropTypes.bool,
};

export default MealImageCarousel;
