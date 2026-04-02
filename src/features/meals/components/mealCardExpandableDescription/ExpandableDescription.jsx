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
                    "text-content",
                    "transition-all duration-300 italic break-words whitespace-pre-wrap",
                    isCollapsed ? "line-clamp-4" : "block",
                ].join(" ")}
            >
                {description}
            </CustomTypography>

        </CustomBox>
    );
};

MealCardExpandableDescription.propTypes = {
    description: PropTypes.string.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]).isRequired,
    forceExpanded: PropTypes.bool,
};

export default MealCardExpandableDescription;
