// MealCardImageThumbnails.jsx
// Purpose: Renders clickable image thumbnails for the active carousel image.

import PropTypes from "prop-types";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

const MealCardImageThumbnails = ({
                                     images = [],
                                     videoThumbnailUrl = null,
                                     activeIndex = 0,
                                     onChangeIndex,
                                     disableActions = false,
                                     className = "",
                                 }) => {
    // 1. Zorg dat de volgorde hier EXACT gelijk is aan je Carousel (Images eerst, Video laatst)
    const items = [
        ...images.map((url) => ({ type: "image", url })),
        ...(videoThumbnailUrl ? [{ type: "video", url: videoThumbnailUrl }] : []),
    ];

    if (items.length <= 1) return null;

    return (
        <CustomBox
            className={[
                "flex justify-center gap-3 overflow-x-hidden m-2 mt-4",
                disableActions ? "pointer-events-none opacity-60" : "",
                className,
            ].join(" ")}
        >
            {items.map((item, idx) => {
                const isActive = idx === activeIndex;

                return (
                    <CustomIconButton
                        key={`${item.type}-${item.url}-${idx}`}
                        icon={
                            <CustomImage
                                src={item.url}
                                alt=""
                                className={[
                                    "w-16 h-12 object-cover rounded-lg",
                                    isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
                                ].join(" ")}
                            />
                        }
                        onClick={() => onChangeIndex?.(idx)}
                        bgColor="bg-transparent"
                        sizeClassName="w-16 h-12"
                        disableScale
                        useMotion={false}
                        // 3. Ring styling iets subtieler voor een strakker resultaat
                        className={isActive ? "ring-2 ring-primary border-none" : "ring-1 ring-black/10 dark:ring-white/10"}
                    />
                );
            })}
        </CustomBox>
    );
};


MealCardImageThumbnails.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    videoThumbnailUrl: PropTypes.string,
    activeIndex: PropTypes.number,
    onChangeIndex: PropTypes.func,
    disableActions: PropTypes.bool,
    className: PropTypes.string,
};


export default MealCardImageThumbnails;
