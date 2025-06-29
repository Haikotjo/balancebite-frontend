import { useState } from "react";
import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

/**
 * ExpandableTitle shows a short or full version of a title with a toggle.
 * The title itself is clickable and opens the meal detail page in a new window.
 *
 * @component
 * @param {object} props
 * @param {string} props.title - The title text to display.
 * @param {string} props.mealId - The ID of the meal to link to.
 * @returns {JSX.Element}
 */
const ExpandableTitle = ({ title, mealId }) => {
    const [expanded, setExpanded] = useState(false);
    const isLongText = title.length > 50;

    const handleNavigate = () => {
        const url = `${window.location.origin}/meal/${mealId}`;
        window.open(url, '_blank');
    };

    return (
        <CustomBox className="flex items-start max-w-full mb-2">
            <CustomTypography
                onClick={handleNavigate}
                className="text-xl sm:text-2xl md:text-2xl font-semibold leading-snug cursor-pointer hover:text-primary"
            >
                {expanded || !isLongText ? (
                    <>
                        {title}{' '}
                        {isLongText && (
                            <CustomTypography
                                as="span"
                                color="text-primary"
                                className="ml-1 text-sm cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(false);
                                }}
                            >
                                Read less
                            </CustomTypography>
                        )}
                    </>
                ) : (
                    <>
                        {title.substring(0, 50)}{' '}
                        <CustomTypography
                            as="span"
                            color="text-primary"
                            className="text-sm cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(true);
                            }}
                        >
                            ...Read more
                        </CustomTypography>
                    </>
                )}
            </CustomTypography>
        </CustomBox>
    );
};

ExpandableTitle.propTypes = {
    title: PropTypes.string.isRequired,
    mealId: PropTypes.string.isRequired,
};

export default ExpandableTitle;
