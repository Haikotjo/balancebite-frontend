// MealCardMediaSection.jsx
// Purpose: Renders meal videos (preparation/video).

import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { toYoutubeEmbedUrl } from "../../utils/helpers/toYoutubeEmbedUrl.js";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";
import {PlayCircle, Video} from "lucide-react";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

const MealCardMediaSection = ({ meal, prepVideoRef }) => {
    const hasAnyVideo = Boolean(meal?.preparationVideoUrl || meal?.videoUrl);
    if (!hasAnyVideo) return null;

    return (
        <CustomBox className="w-full">
            <CustomBox
                ref={meal?.preparationVideoUrl ? prepVideoRef : null}
                className="grid grid-cols-1 gap-8 w-full"
            >
                {meal?.preparationVideoUrl && (
                    <CustomBox className="flex flex-col">
                        <MetricHeader
                            title="Preparation video"
                            subtitle="Step by step"
                            icon={Video}
                            variant="meal"
                        />
                        <CustomDivider className="mb-4"></CustomDivider>
                        <CustomBox className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-black/10 dark:border-white/10 shadow-xl">
                            <iframe
                                title="Preparation video"
                                src={toYoutubeEmbedUrl(meal.preparationVideoUrl)}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </CustomBox>
                    </CustomBox>
                )}

                {meal?.videoUrl && (
                    <CustomBox className="flex flex-col">
                        <MetricHeader
                            title="Meal video"
                            subtitle="Showcase"
                            icon={PlayCircle}
                            variant="meal"
                        />
                        <CustomDivider className="mb-4"></CustomDivider>
                        <CustomBox className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-black/10 dark:border-white/10 shadow-xl">
                            <iframe
                                title="Meal video"
                                src={toYoutubeEmbedUrl(meal.videoUrl)}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </CustomBox>
                    </CustomBox>
                )}
            </CustomBox>
        </CustomBox>
    );
};

MealCardMediaSection.propTypes = {
    meal: PropTypes.object.isRequired,
    prepVideoRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ]),
};

export default MealCardMediaSection;
