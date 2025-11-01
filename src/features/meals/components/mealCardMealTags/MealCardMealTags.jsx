// MealCardMealTags.jsx
import PropTypes from "prop-types";
import {useContext} from "react";
import {buildMealTags} from "../../utils/helpers/buildMealTags.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomCardChip from "../../../../components/layout/customCardChip.jsx";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import {ModalContext} from "../../../../context/ModalContext.jsx";

const MealCardMealTags = ({
                              cuisines,
                              diets,
                              mealTypes,
                              size = "default",
                              onFilter,
                              forceExpand = true,           // ← default: always expanded
                          }) => {
    const { closeModal } = useContext(ModalContext);

    const handleFilterClick = (category, value) => {
        if (onFilter && value) {
            onFilter(category, value);
            closeModal?.();
        }
    };

    // Always request full list
    const { shuffledTags } = buildMealTags({
        cuisines,
        diets,
        mealTypes,
        expanded: true,             // ← force expanded
        forceExpand: true,          // ← force expanded
    });

    return (
        <CustomBox
            className={clsx(
                "flex flex-wrap gap-2",
                "justify-start",
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
                        size === "small" ? "px-[6px] py-[3px]" : "px-[8px] py-[3px]"
                    )}
                    textClassName="text-[0.6rem] "
                >
                    {formatEnum(tag.value)}
                </CustomCardChip>
            ))}
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
};

export default MealCardMealTags;
