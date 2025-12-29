import PropTypes from "prop-types";
import { useMemo } from "react";

import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

import { getImageSrc } from "../../utils/helpers/getImageSrc.js";

/**
 * Media section for MealCard:
 * - Shows extra images (excluding primary)
 * - Shows preparationVideoUrl and videoUrl (muted by default)
 * - Shows sourceUrl link
 * - Shows mealPreparation text
 */
const MealCardMediaSection = ({ meal }) => {
    const primaryImageUrl = useMemo(() => getImageSrc(meal), [meal]);

    const extraImages = useMemo(() => {
        const arr = Array.isArray(meal?.images) ? meal.images : [];

        // Prefer structured images array (with orderIndex), fallback to imageUrls
        if (arr.length > 0) {
            const sorted = [...arr].sort((a, b) => (a?.orderIndex ?? 0) - (b?.orderIndex ?? 0));
            return sorted
                .map((img) => img?.imageUrl)
                .filter(Boolean)
                .filter((url) => url !== primaryImageUrl);
        }

        const urls = Array.isArray(meal?.imageUrls) ? meal.imageUrls : [];
        return urls.filter(Boolean).filter((url) => url !== primaryImageUrl);
    }, [meal?.images, meal?.imageUrls, primaryImageUrl]);

    const toSafeLinkText = (url) => {
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./, "");
        } catch {
            return url;
        }
    };

    const toYoutubeEmbedUrl = (url) => {
        if (!url) return null;

        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, "");

            // youtu.be/<id>
            if (host === "youtu.be") {
                const id = u.pathname.replace("/", "").trim();
                if (!id) return null;
                return `https://www.youtube.com/embed/${id}?mute=1&rel=0&modestbranding=1`;
            }

            // youtube.com/watch?v=<id>
            if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
                const v = u.searchParams.get("v");
                if (!v) return null;
                return `https://www.youtube.com/embed/${v}?mute=1&rel=0&modestbranding=1`;
            }

            // youtube.com/embed/<id> -> keep
            if (host === "youtube.com" && u.pathname.startsWith("/embed/")) {
                const id = u.pathname.split("/embed/")[1]?.split("/")[0];
                if (!id) return null;
                return `https://www.youtube.com/embed/${id}?mute=1&rel=0&modestbranding=1`;
            }

            return null;
        } catch {
            return null;
        }
    };

    const renderVideoBlock = (label, url) => {
        if (!url) return null;

        const ytEmbed = toYoutubeEmbedUrl(url);

        return (
            <CustomBox className="w-full">
                <CustomTypography variant="h4" bold className="mb-2">
                    {label}
                </CustomTypography>

                {ytEmbed ? (
                    <CustomBox className="w-full aspect-video rounded-xl overflow-hidden border border-border">
                        <iframe
                            title={label}
                            src={ytEmbed}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                        />
                    </CustomBox>
                ) : (
                    <CustomBox className="w-full">
                        {/* Fallback for non-YouTube URLs */}
                        <CustomBox className="rounded-xl border border-border p-3">
                            <CustomTypography className="text-sm opacity-80">
                                Video link:
                            </CustomTypography>
                            <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline break-all"
                            >
                                {url}
                            </a>
                        </CustomBox>
                    </CustomBox>
                )}
            </CustomBox>
        );
    };

    const hasAny =
        extraImages.length > 0 ||
        !!meal?.preparationVideoUrl ||
        !!meal?.videoUrl ||
        !!meal?.sourceUrl ||
        !!meal?.mealPreparation;

    if (!hasAny) return null;

    return (
        <CustomBox className="max-w-6xl w-full p-4">



                {(meal?.preparationVideoUrl || meal?.videoUrl) && <CustomDivider className="my-6" />}

                <CustomBox className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderVideoBlock("Preparation video", meal?.preparationVideoUrl)}
                    {renderVideoBlock("Video", meal?.videoUrl)}
                </CustomBox>

                {meal?.sourceUrl && (
                    <>
                        <CustomDivider className="my-6" />
                        <CustomBox>
                            <CustomTypography variant="h4" bold className="mb-2">
                                Source
                            </CustomTypography>
                            <a
                                href={meal.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline break-all"
                            >
                                {toSafeLinkText(meal.sourceUrl)}
                            </a>
                        </CustomBox>
                    </>
                )}

                {meal?.mealPreparation && (
                    <>
                        <CustomDivider className="my-6" />
                        <CustomBox>
                            <CustomTypography variant="h4" bold className="mb-2">
                                Preparation
                            </CustomTypography>
                            <CustomBox className="rounded-lg bg-black/5 dark:bg-white/5 p-4">
                                <CustomTypography className="whitespace-pre-wrap">
                                    {meal.mealPreparation}
                                </CustomTypography>
                            </CustomBox>
                        </CustomBox>
                    </>
                )}

        </CustomBox>
    );

};

MealCardMediaSection.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCardMediaSection;
