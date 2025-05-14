import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";

/**
 * ExpandableTitle shows a short or full version of a title with a toggle.
 * The title itself is clickable and navigates to the meal detail page.
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
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/meal/${mealId}`);
    };

    return (
        <CustomBox className="flex items-start max-w-full mb-2">
            <CustomTypography
                onClick={handleNavigate}
                className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug cursor-pointer hover:underline"
            >
                {expanded || !isLongText ? (
                    <>
                        {title}{" "}
                        {isLongText && (
                            <CustomTypography
                                as="span"
                                className="ml-1 text-sm text-userPrimary cursor-pointer"
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
                        {title.substring(0, 50)}{" "}
                        <CustomTypography
                            as="span"
                            className="text-sm text-userPrimary cursor-pointer"
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
