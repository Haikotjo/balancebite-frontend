import PropTypes from "prop-types";
import { useState } from "react";
import {buildMealTags} from "../../utils/helpers/buildMealTags.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomCardChip from "../../../../components/layout/customCardChip.jsx";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * MealCardMealTags component displays tags for cuisines, diets, and meal types.
 * - Only a few tags are shown by default, expandable with a toggle.
 * - Font size and spacing are controlled via the `size` prop.
 * - Tags are clickable and trigger a filter callback.
 *
 * @param {Object} props
 * @param {string[]|string} props.cuisines - Cuisine tags
 * @param {string[]|string} props.diets - Diet tags
 * @param {string[]|string} props.mealTypes - Meal type tags
 * @param {"small"|"default"} [props.size="default"] - Visual size of the tags
 * @param {Function} props.onFilter - Called with (category, value) when tag is clicked
 * @param {boolean} [props.forceExpand=false] - Whether to always show all tags
 * @param {Function} [props.onExpandRequest] - Optional callback for expand action (used in small mode)
 * @returns {JSX.Element}
 */
const MealCardMealTags = ({
                              cuisines,
                              diets,
                              mealTypes,
                              size = "default",
                              onFilter,
                              forceExpand = false,
                              onExpandRequest,
                          }) => {
    const [expanded, setExpanded] = useState(false);

    const handleFilterClick = (category, value) => {
        if (onFilter && value) {
            onFilter(category, value);
        }
    };

    const { shuffledTags, totalTagCount } = buildMealTags({
        cuisines,
        diets,
        mealTypes,
        expanded,
        forceExpand,
    });

    return (
        <CustomBox
            className={clsx(
                "flex flex-wrap gap-2",
                forceExpand ? "justify-center" : "justify-start",
                size === "small" ? "mb-0" : "mb-2"
            )}
        >
            {shuffledTags.map((tag) => (
                <CustomCardChip
                    key={tag.value}
                    onClick={() => handleFilterClick(tag.category, tag.value)}
                    className={clsx(
                        tag.color === "success"
                            ? "border-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600"
                            : tag.color === "secondary"
                                ? "border-secondary hover:bg-secondary/10 text-secondary"
                                : "border-primary hover:bg-primary/10 text-primary",
                        size === "small" ? "px-[6px] py-[3px]" : "px-[10px] py-[6px]"
                    )}
                    textClassName="text-[0.65rem] sm:text-sm md:text-[0.8rem]"
                >
                    {formatEnum(tag.value)}
                </CustomCardChip>
            ))}

            {!forceExpand && totalTagCount > 3 && (
                <CustomButton
                    onClick={() => {
                        if (size === "small" && onExpandRequest) {
                            onExpandRequest();
                        } else {
                            setExpanded(prev => !prev);
                        }
                    }}
                >
                    <CustomTypography variant="paragraph" color="text-primary">
                        {expanded ? "- less" : `+${totalTagCount - shuffledTags.length} more`}
                    </CustomTypography>
                </CustomButton>
            )}
        </CustomBox>
    );
};

MealCardMealTags.propTypes = {
    cuisines: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    diets: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    mealTypes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    size: PropTypes.oneOf(["small", "default"]),
    forceExpand: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    onExpandRequest: PropTypes.func,
};

export default MealCardMealTags;
