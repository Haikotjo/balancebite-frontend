// src/components/meal/MealImageSection.jsx

import PropTypes from "prop-types";
import clsx from "clsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomImage from "../layout/CustomImage.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import {getImageSrc} from "../../utils/helpers/getImageSrc.js";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";

/**
 * Displays the meal image with overlay or inline layout.
 * Overlay includes creator info and action buttons on the image.
 * Inline places icons in a row below the image.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - The meal object to display.
 * @param {boolean} [props.showUpdateButton=true] - Whether to show the update meal button.
 * @param {"overlay"|"inline"} [props.variant="overlay"] - Layout style.
 * @returns {JSX.Element}
 */
const MealCardImageSection = ({
                                  meal,
                                  viewMode = "page",
                                  showUpdateButton = true,
                                  variant = "overlay",
                              }) => {
    const imageSrc = getImageSrc(meal);

    const isInline = variant === "inline";
    const isListItem = viewMode === "list";
    const isPage = viewMode === "page";
    const isMobile = viewMode === "mobile";

    return (
        <CustomBox
            className={clsx(
                "w-full flex flex-col justify-start shrink-0 gap-2",
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
                            viewMode={viewMode}
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
                            showUpdateButton={showUpdateButton}
                        />
                    </CustomBox>
                </>
            )}

        </CustomBox>
    );
};

MealCardImageSection.propTypes = {
    meal: PropTypes.object.isRequired,
    showUpdateButton: PropTypes.bool,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]),
    variant: PropTypes.oneOf(["overlay", "inline"]),
};

export default MealCardImageSection;
