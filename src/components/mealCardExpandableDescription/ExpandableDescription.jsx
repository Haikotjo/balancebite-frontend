import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * ExpandableDescription component that truncates text after 100 characters and
 * allows users to expand or collapse the full content. In modal view, full text is shown directly.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.description - The text content to display.
 * @param {boolean} [props.isModal=false] - If true, show full text without truncation.
 * @returns {JSX.Element}
 */
const MealCardExpandableDescription = ({ description, isModal = false }) => {
    const [expanded, setExpanded] = useState(false);
    const isLongText = description.length > 100;

    if (isModal) {
        return (
            <CustomTypography
                variant="paragraph"
                italic
                className="text-lightText dark:text-darkText text-[0.9rem]"
            >
                {description}
            </CustomTypography>
        );
    }

    return (
        <CustomBox>
            <CustomTypography
                variant="paragraphCard"
                italic
                className={`
                    text-lightText dark:text-darkText
                    overflow-hidden
                    transition-all duration-300
                    ${expanded ? "block" : "line-clamp-3"}
                `}
            >
                {expanded || !isLongText ? (
                    <>
                        {description}{" "}
                        {isLongText && (
                            <span
                                onClick={() => setExpanded(false)}
                                className="text-primary cursor-pointer not-italic"
                            >
                                Read less
                            </span>
                        )}
                    </>
                ) : (
                    <>
                        {description.substring(0, 100)}{" "}
                        <span
                            onClick={() => setExpanded(true)}
                            className="text-primary cursor-pointer not-italic"
                        >
                            ...Read more
                        </span>
                    </>
                )}
            </CustomTypography>
        </CustomBox>
    );
};

MealCardExpandableDescription.propTypes = {
    description: PropTypes.string.isRequired,
    isModal: PropTypes.bool,
};

export default MealCardExpandableDescription;
