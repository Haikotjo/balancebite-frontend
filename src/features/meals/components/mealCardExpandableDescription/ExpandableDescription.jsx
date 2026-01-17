import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardExpandableDescription = ({ description, viewMode, forceExpanded = false }) => {
    const [expanded] = useState(false);

    const isLongText = (description?.length ?? 0) > 120;
    const showAll = viewMode === "page" || forceExpanded || !isLongText;
    const isCollapsed = !showAll && !expanded;

    return (
        <CustomBox className="relative">
            <CustomTypography
                variant="paragraphCard"
                italic
                className={[
                    "text-lightText dark:text-darkText",
                    "transition-all duration-300   italic break-words whitespace-pre-wrap break-all",
                    isCollapsed ? "line-clamp-4" : "block",
                ].join(" ")}
            >
                {description}
            </CustomTypography>

            {/* Fade overlay when collapsed */}
            {isCollapsed && (
                <CustomBox
                    className="
                        pointer-events-none
                        absolute
                        left-0 right-0 bottom-0
                        h-16
                        bg-gradient-to-t
                        from-cardLight dark:from-cardDark
                        to-transparent
                    "
                />
            )}
        </CustomBox>
    );
};

MealCardExpandableDescription.propTypes = {
    description: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]).isRequired,
    forceExpanded: PropTypes.bool,
};

export default MealCardExpandableDescription;
