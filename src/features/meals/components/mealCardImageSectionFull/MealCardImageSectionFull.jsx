// MealCardImageSectionFull.jsx
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MealImageCarousel from "../mealImageCarousel/MealImageCarousel.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealCardImageThumbnails from "../mealCardImageThumbnails/MealCardImageThumbnails.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { Timer } from "lucide-react";

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

                <CustomBox className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none z-30"/>

                <CustomBox className="absolute bottom-10 left-6 right-6 pointer-events-none z-40">
                    <CustomBox className="flex flex-col gap-2 mb-2">
                        {meal?.preparationTime && (
                            <CustomBox className="ml-6">
                                <CustomTypography
                                    as="span"
                                    variant="xsmallCard"
                                    italic
                                    bold
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 bg-primary/70 text-white border border-white tracking-[0.2em]"
                                >
                                    <Timer size={14} className="text-white" />
                                    {meal.preparationTime.replace("PT", "").toLowerCase()}
                                </CustomTypography>
                            </CustomBox>
                        )}

                        {meal?.mealPrice && (
                            <CustomBox className="mb-2 ml-2">
                                <CustomTypography
                                    as="span"
                                    variant="small"
                                    italic
                                    bold
                                    className="inline-flex justify-center rounded-full px-3 py-1 bg-price/50 text-white border border-white tracking-[0.1em]"
                                >
                                    € {meal.mealPrice.toFixed(2)}
                                </CustomTypography>
                            </CustomBox>
                        )}
                    </CustomBox>

                    <CustomTypography
                        variant="h1"
                        className="font-black text-white tracking-tighter leading-none drop-shadow-md"
                    >
                        {meal?.name}
                    </CustomTypography>
                </CustomBox>

                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-40 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem"/>
                </CustomBox>

                <CustomBox
                    className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-[100] pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="flex items-center justify-between w-full z-10">
                        <CustomBox
                            className={disableActions ? "pointer-events-none opacity-60" : ""}
                            aria-disabled={disableActions}
                        >
                            <CustomBox
                                ref={actionsAnchorRef}
                                className={`pl-4 pt-4 ${disableActions ? "pointer-events-none opacity-60" : ""}`}
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
