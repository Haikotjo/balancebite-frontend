// MealCardMealTags.jsx
import PropTypes from "prop-types";
import {useContext, useMemo} from "react";
import {buildMealTags} from "../../utils/helpers/buildMealTags.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import clsx from "clsx";
import CustomCardChip from "../../../../components/layout/customCardChip.jsx";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import {ModalContext} from "../../../../context/ModalContext.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardMealTags = ({
                              cuisines,
                              diets,
                              mealTypes,
                              size = "default",
                              onFilter,
                          }) => {
    const { closeModal } = useContext(ModalContext);

    const handleFilterClick = (category, value) => {
        if (onFilter && value) {
            onFilter(category, value);
            closeModal?.();
        }
    };

    // Always request full list

    const { shuffledTags } = useMemo(
        () => buildMealTags({ cuisines, diets, mealTypes }),
        [cuisines, diets, mealTypes]
    );


    const colorClasses = {
        primary: "border-primary hover:bg-primary/10 ",
        secondary: "border-secondary hover:bg-secondary/10 ",
        success: "border-success hover:bg-success/10 dark:hover:bg-success-dark/20 ",
    };

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
                        colorClasses[tag.color],
                        size === "small" ? "px-[6px] py-[3px]" : "px-[8px] py-[3px]"
                    )}
                >
                    <CustomTypography
                        variant="small"
                        inheritColor
                        className="text-lightText dark:text-darkText"
                    >
                        {formatEnum(tag.value)}
                    </CustomTypography>
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
    onFilter: PropTypes.func.isRequired,
};

export default MealCardMealTags;
