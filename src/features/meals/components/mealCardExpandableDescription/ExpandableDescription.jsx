import { useState } from "react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * ExpandableDescription component that truncates text after 100 characters
 * unless viewMode is "page", in which case full text is shown without interaction.
 *
 * @component
 * @param {Object} props
 * @param {string} props.description - The text content to display.
 * @param {"page"|"list"|"mobile"} props.viewMode - Controls rendering behavior.
 * @returns {JSX.Element}
 */
const MealCardExpandableDescription = ({ description, viewMode, forceExpanded = false  }) => {
    const [expanded, setExpanded] = useState(false);
    const isLongText = description.length > 100;
    const showAll = viewMode === "page" || forceExpanded;

    return (
        <CustomBox>
            <CustomTypography
                variant="paragraphCard"
                italic
                className={`
                    text-lightText dark:text-darkText
                    overflow-hidden
                    transition-all duration-300
                    ${showAll || expanded ? "block" : "line-clamp-3"}
                `}
            >
                {showAll || expanded || !isLongText ? (
                    <>
                        {description}
                        {isLongText && !showAll && (
                            <CustomTypography
                                as="span"
                                variant="small"
                                inheritColor
                                className="text-primary cursor-pointer not-italic ml-1"
                                onClick={() => setExpanded(false)}
                            >
                                ...Read less
                            </CustomTypography>
                        )}
                    </>
                ) : (
                    <>
                        {description.substring(0, 100)}{" "}
                        <CustomTypography
                            as="span"
                            variant="small"
                            inheritColor
                            className="text-primary cursor-pointer not-italic"
                            onClick={() => setExpanded(true)}
                        >
                            ...Read more
                        </CustomTypography>
                    </>
                )}
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
