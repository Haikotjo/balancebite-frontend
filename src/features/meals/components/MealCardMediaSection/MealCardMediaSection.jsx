// MealCardMediaSection.jsx
// Purpose: Renders meal videos (preparation/video).

import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { toYoutubeEmbedUrl } from "../../utils/helpers/toYoutubeEmbedUrl.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardMediaSection = ({ meal, prepVideoRef }) => {
    const hasAnyVideo = Boolean(meal?.preparationVideoUrl || meal?.videoUrl);
    if (!hasAnyVideo) return null;

    return (
        <CustomBox className="max-w-6xl w-full px-4 mt-12">
            <CustomBox
                ref={meal?.preparationVideoUrl ? prepVideoRef : null}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {meal?.preparationVideoUrl && (
                    <CustomBox className="flex flex-col gap-2">
                        <CustomTypography variant="xsmallCard" bold>
                            Preparation video
                        </CustomTypography>

                        <CustomBox className="w-full aspect-video rounded-xl overflow-hidden border border-border">
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
                    <CustomBox className="flex flex-col gap-2">
                        <CustomTypography variant="xsmallCard" bold>
                            Meal video
                        </CustomTypography>

                        <CustomBox className="w-full aspect-video rounded-xl overflow-hidden border border-border">
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
