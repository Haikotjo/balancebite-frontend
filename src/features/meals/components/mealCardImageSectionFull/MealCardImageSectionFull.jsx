// MealCardImageSectionFull.jsx
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealImageCarousel from "../mealImageCarousel/MealImageCarousel.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealCardImageThumbnails from "../mealCardImageThumbnails/MealCardImageThumbnails.jsx";

const getYoutubeId = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);

        if (u.hostname.includes("youtu.be")) {
            const id = u.pathname.replace("/", "");
            return id || null;
        }

        if (u.hostname.includes("youtube.com")) {
            return u.searchParams.get("v");
        }

        return null;
    } catch {
        return null;
    }
};

const MealCardImageSectionFull = ({
                                      meal,
                                      viewMode = "page",
                                      onClose,
                                      disableActions = false,
                                      actionsAnchorRef,
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

    const primaryIndex = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];
        if (arr.length === 0) return 0;

        const sorted = [...arr].sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0));
        const idx = sorted.findIndex((img) => img?.primary && img?.imageUrl?.trim());
        return idx >= 0 ? idx : 0;
    }, [meal?.images]);

    const hasVideo = Boolean(meal?.videoUrl);

    const items = useMemo(() => {
        const list = [];
        if (hasVideo) list.push({ type: "video", url: meal.videoUrl });
        images.forEach((u) => list.push({ type: "image", url: u }));
        return list;
    }, [hasVideo, meal?.videoUrl, images]);

    const initialIndex = hasVideo ? 0 : primaryIndex;
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    useEffect(() => {
        setActiveIndex(initialIndex);
    }, [initialIndex, meal?.id, hasVideo, images.length]);

    const videoId = getYoutubeId(meal?.videoUrl);
    const videoThumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    return (
        <>
            <CustomBox className="h-80 md:h-96 lg:h-[28rem] flex-none relative w-full">
                <MealImageCarousel
                    items={items}
                    alt={meal?.name ?? ""}
                    className="w-full h-full"
                    activeIndex={activeIndex}
                    onChangeIndex={setActiveIndex}
                    disableActions={disableActions}
                />

                <CustomBox
                    className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="flex items-center justify-between w-full z-10">
                        {meal?.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}

                        <CustomBox
                            className={disableActions ? "pointer-events-none opacity-60" : ""}
                            aria-disabled={disableActions}
                        >
                            <CustomBox
                                ref={actionsAnchorRef}
                                className={disableActions ? "pointer-events-none opacity-60" : ""}
                                aria-disabled={disableActions}
                            >
                                <MealCardActionButtons
                                    meal={meal}
                                    showUpdateButton={true}
                                    viewMode={viewMode}
                                    onClose={onClose}
                                />
                            </CustomBox>
                        </CustomBox>
                    </CustomBox>
                </CustomBox>

                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem" />
                </CustomBox>
            </CustomBox>

            <MealCardImageThumbnails
                images={images}
                videoThumbnailUrl={videoThumbUrl}
                activeIndex={activeIndex}
                onChangeIndex={setActiveIndex}
                disableActions={disableActions}
            />
        </>
    );
};

MealCardImageSectionFull.propTypes = {
    meal: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onClose: PropTypes.func,
    disableActions: PropTypes.bool,
    actionsAnchorRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
};

export default MealCardImageSectionFull;
