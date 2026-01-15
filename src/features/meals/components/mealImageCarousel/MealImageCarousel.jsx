// MealImageCarousel.jsx
import PropTypes from "prop-types";
import { useMemo } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toYoutubeEmbedUrl } from "../../utils/helpers/toYoutubeEmbedUrl.js"; // pas pad aan

const placeholderImages = import.meta.glob("/src/assets/images/placeholder/*.webp", { eager: true });
const placeholders = Object.values(placeholderImages).map((img) => img.default);

const MealImageCarousel = ({
                               items = [],
                               alt = "",
                               className = "",
                               activeIndex,
                               onChangeIndex,
                               disableActions = false,
                           }) => {
    const safeIndex = items.length > 0
        ? Math.min(Math.max(activeIndex ?? 0, 0), items.length - 1)
        : 0;

    const item = items[safeIndex];
    const hasNav = items.length > 1;

    const prev = () => {
        if (disableActions || items.length < 2) return;
        onChangeIndex?.((safeIndex - 1 + items.length) % items.length);
    };

    const next = () => {
        if (disableActions || items.length < 2) return;
        onChangeIndex?.((safeIndex + 1) % items.length);
    };

    const imageSrc = useMemo(() => {
        if (item?.type === "image" && item.url) return item.url;
        if (placeholders.length > 0) return placeholders[Math.floor(Math.random() * placeholders.length)];
        return "/fallback.jpg";
    }, [item]);

    return (
        <CustomBox className={className}>
            <CustomBox className="relative w-full h-full overflow-hidden">
                {item?.type === "video" ? (
                    <iframe
                        title="Meal video"
                        src={toYoutubeEmbedUrl(item.url)}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <>
                        <CustomImage
                            src={imageSrc}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                        />
                        <CustomImage
                            src={imageSrc}
                            alt={alt}
                            className="relative z-10 w-full h-full object-contain"
                        />
                    </>
                )}

                {hasNav && (
                    <>
                        <CustomBox className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
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

                        <CustomBox className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
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

                        <CustomBox className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 bg-black/60 text-white text-xs z-20">
                            {safeIndex + 1}/{items.length}
                        </CustomBox>
                    </>
                )}
            </CustomBox>
        </CustomBox>
    );
};

MealImageCarousel.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(["image", "video"]).isRequired,
            url: PropTypes.string,
        })
    ),
    alt: PropTypes.string,
    className: PropTypes.string,
    activeIndex: PropTypes.number,
    onChangeIndex: PropTypes.func,
    disableActions: PropTypes.bool,
};

export default MealImageCarousel;
