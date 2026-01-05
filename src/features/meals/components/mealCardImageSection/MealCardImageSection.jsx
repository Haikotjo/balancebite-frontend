import PropTypes from "prop-types";
import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";

import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import { ModalContext } from "../../../../context/ModalContext.jsx";
import MealModal from "../mealModal/MealModal.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import MealCardMacrosCompact from "../mealCardMacrosCompact/MealCardMacrosCompact.jsx";

import { toYoutubeEmbedUrl } from "../../utils/helpers/toYoutubeEmbedUrl.js";
import { getYoutubeId } from "../../utils/helpers/getYoutubeId.js";

const loadYouTubeIframeAPI = () => {
    // Load the YouTube IFrame API only once.
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (window.__ytApiPromise) return window.__ytApiPromise;

    window.__ytApiPromise = new Promise((resolve) => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => resolve();
    });

    return window.__ytApiPromise;
};

const MealCardImageSection = ({
                                  meal,
                                  viewMode = "page",
                                  showUpdateButton = true,
                                  isPinned = false,
                                  priceLabel,
                                  macros,
                              }) => {
    const imageSrc = getImageSrc(meal);
    const { openModal } = useContext(ModalContext);

    const videoId = getYoutubeId(meal?.videoUrl);

    // IMPORTANT: jsapi must be enabled to receive ENDED events
    const embedUrl = toYoutubeEmbedUrl(meal?.videoUrl, { autoplay: true, jsapi: true });

    const [showVideo, setShowVideo] = useState(Boolean(embedUrl));
    const iframeRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // Reset when meal changes / url changes
        setShowVideo(Boolean(embedUrl));
    }, [meal?.id, embedUrl]);

    useEffect(() => {
        // If no video shown, destroy player (cleanup)
        if (!showVideo && playerRef.current?.destroy) {
            playerRef.current.destroy();
            playerRef.current = null;
        }
    }, [showVideo]);

    useEffect(() => {
        // If no video, nothing to do
        if (!showVideo || !videoId) return;

        let cancelled = false;

        const initPlayer = async () => {
            await loadYouTubeIframeAPI();
            if (cancelled) return;

            // Destroy previous player if any
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }

            // Create a YT player to receive state events (ENDED)
            playerRef.current = new window.YT.Player(iframeRef.current, {
                videoId,
                events: {
                    onStateChange: (e) => {
                        // YT.PlayerState.ENDED === 0
                        if (e?.data === window.YT.PlayerState.ENDED) {
                            setShowVideo(false); // switch to image
                        }
                    },
                },
            });
        };

        initPlayer();

        return () => {
            cancelled = true;
        };
    }, [showVideo, videoId]);

    const handleImageClick = () => {
        openModal(<MealModal meal={meal} />, "meal", meal);
    };

    return (
        <CustomBox className="w-full flex flex-col justify-start shrink-0 gap-2">
            <CustomBox
                className={clsx(
                    "relative aspect-[4/3] w-full shadow-[8px_8px_12px_rgba(0,0,0,0.8)] overflow-hidden rounded-md cursor-pointer"
                )}
                onClick={handleImageClick}
            >
                {showVideo && embedUrl ? (
                    <iframe
                        ref={iframeRef}
                        title="Meal video"
                        src={embedUrl}
                        className="w-full h-full rounded-md"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <CustomImage
                        src={imageSrc}
                        alt={meal.name}
                        className="w-full h-full object-cover rounded-md"
                    />
                )}

                {/* OVERLAY TOP (prep-time + actions) */}
                <CustomBox
                    className="absolute top-1 w-full flex items-center justify-between px-2 py-1 z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="flex items-center mr-1">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                    </CustomBox>

                    <MealCardActionButtons
                        meal={meal}
                        showUpdateButton={showUpdateButton}
                        viewMode={viewMode}
                        isPinned={isPinned}
                    />
                </CustomBox>

                {/* RIGHT COLUMN: price + macros */}
                {(priceLabel || macros) && (
                    <CustomBox
                        className="absolute top-2 right-2 z-30 pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CustomBox className="inline-flex flex-col items-stretch gap-2">
                            {priceLabel && (
                                <CustomBox className="w-full">
                                    <CustomTypography
                                        as="span"
                                        variant="xsmallCard"
                                        bold
                                        className="w-full inline-flex justify-center rounded-full px-3 py-1 bg-black/55 backdrop-blur-sm text-white border border-white"
                                    >
                                        {priceLabel}
                                    </CustomTypography>
                                </CustomBox>
                            )}

                            {macros && (
                                <MealCardMacrosCompact
                                    macros={macros}
                                    vertical
                                    iconSize={18}
                                    textClassName="text-white"
                                    className="w-full text-white"
                                    rowClassName="flex flex-col gap-2 items-stretch w-full"
                                    itemClassName="w-full bg-black/55 backdrop-blur-sm rounded-md px-2 py-1"
                                />
                            )}
                        </CustomBox>
                    </CustomBox>
                )}

                {/* OVERLAY BOTTOM (creator info) */}
                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-0 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem" />
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

MealCardImageSection.propTypes = {
    meal: PropTypes.object.isRequired,
    showUpdateButton: PropTypes.bool,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]),
    isPinned: PropTypes.bool,
    priceLabel: PropTypes.string,
    macros: PropTypes.object,
};

export default MealCardImageSection;
