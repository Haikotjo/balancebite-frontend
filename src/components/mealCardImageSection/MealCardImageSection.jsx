// src/components/meal/MealImageSection.jsx

import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomImage from "../layout/CustomImage.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import PreparationTimeIcon from "../preparationTimeIcon/PreparationTimeIcon.jsx";
import MealInfoOverlay from "../mealInfoOverlay/MealInfoOverlay.jsx";
import {getImageSrc} from "../../utils/helpers/getImageSrc.js";

/**
 * Displays the meal image with overlay or inline layout.
 * Overlay includes creator info and action buttons on the image.
 * Inline places icons in a row below the image.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - The meal object to display.
 * @param {boolean} [props.isListItem=false] - Controls responsiveness.
 * @param {boolean} [props.showUpdateButton=true] - Whether to show the update meal button.
 * @param {Function} [props.onOpenAsModal] - Callback for modal opening.
 * @param {"overlay"|"inline"} [props.variant="overlay"] - Layout style.
 * @returns {JSX.Element}
 */
const MealCardImageSection = ({
                                  meal,
                                  isListItem = false,
                                  showUpdateButton = true,
                                  onOpenAsModal,
                                  variant = "overlay",
                                  isModal,
                              }) => {
    const imageSrc = getImageSrc(meal);

    const isInline = variant === "inline";

    return (
        <CustomBox
            className={clsx(
                "w-full flex flex-col justify-start shrink-0 gap-2",
                !isListItem && "md:w-1/2"
            )}
        >
            <CustomBox className="relative aspect-[4/3] w-full shadow-[8px_8px_12px_rgba(0,0,0,0.8)] overflow-hidden rounded-md">
                <CustomImage
                    src={imageSrc}
                    alt={meal.name}
                    className="rounded-md"
                />

                {!isInline && (
                    <>
                        <MealInfoOverlay meal={meal} fontSize="0.8rem" />

                        {meal.preparationTime && (
                            <CustomBox className="absolute top-[15px] left-[10px]">
                                <PreparationTimeIcon preparationTime={meal.preparationTime} />
                            </CustomBox>
                        )}

                        <MealCardActionButtons
                            meal={meal}
                            showOpenMealButton={isListItem}
                            showUpdateButton={showUpdateButton}
                            onOpenAsModal={onOpenAsModal}
                            isModal={isModal}
                        />
                    </>
                )}
            </CustomBox>

            {isInline && (
                <>
                    {/* Background bar behind timer + actions */}
                    <CustomBox className="absolute top-[0px] left-0 w-full h-[55px] bg-[rgba(255,255,255,0.4)] rounded-md z-0" />

                    {/* Foreground with timer and actions */}
                    <CustomBox className="absolute top-[10px] left-[10px] w-full flex flex-row items-center justify-between px-3 z-10">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                        <MealCardActionButtons
                            meal={meal}
                            variant="inline"
                            showOpenMealButton={isListItem}
                            showUpdateButton={showUpdateButton}
                            onOpenAsModal={onOpenAsModal}
                            isModal={isModal}
                        />
                    </CustomBox>
                </>
            )}

        </CustomBox>
    );
};

MealCardImageSection.propTypes = {
    meal: PropTypes.object.isRequired,
    isListItem: PropTypes.bool,
    showUpdateButton: PropTypes.bool,
    onOpenAsModal: PropTypes.func,
    isModal: PropTypes.bool,
    variant: PropTypes.oneOf(["overlay", "inline"]),
};

export default MealCardImageSection;
