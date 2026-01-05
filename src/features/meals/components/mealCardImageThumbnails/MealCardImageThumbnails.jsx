// MealCardImageThumbnails.jsx
// Purpose: Renders clickable image thumbnails for the active carousel image.

import PropTypes from "prop-types";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

const MealCardImageThumbnails = ({
                                     images = [],
                                     videoThumbnailUrl = null, // NEW (optioneel)
                                     activeIndex = 0,
                                     onChangeIndex,
                                     disableActions = false,
                                     className = "",
                                 }) => {
    const items = [
        ...(videoThumbnailUrl ? [{ type: "video", url: videoThumbnailUrl }] : []),
        ...images.map((url) => ({ type: "image", url })),
    ];

    if (items.length <= 1) return null;

    return (
        <CustomBox
            className={[
                "flex sm:px-20 justify-between overflow-x-auto m-2 mt-4",
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
                        className={isActive ? "ring-2 ring-primary" : "ring-1 ring-border"}
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
