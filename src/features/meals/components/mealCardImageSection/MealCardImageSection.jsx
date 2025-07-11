import PropTypes from "prop-types";
import clsx from "clsx";
import { useContext } from "react";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import { ModalContext } from "../../../../context/ModalContext.jsx";
import MealModal from "../mealModal/MealModal.jsx";

const MealCardImageSection = ({
                                  meal,
                                  viewMode = "page",
                                  showUpdateButton = true,
                                  isPinned = false,
                              }) => {
    const imageSrc = getImageSrc(meal);
    const { openModal } = useContext(ModalContext);

    const handleImageClick = () => {
        openModal(<MealModal meal={meal} />, "meal", meal);
    };

    return (
        <CustomBox className="w-full flex flex-col justify-start shrink-0 gap-2">
            <CustomBox
                className={clsx(
                    "relative aspect-[4/3] w-full shadow-[8px_8px_12px_rgba(0,0,0,0.8)] overflow-hidden rounded-md cursor-pointer"
                )}
                onClick={handleImageClick}
            >
                {/* IMAGE */}
                <CustomImage
                    src={imageSrc}
                    alt={meal.name}
                    className="w-full h-full object-cover rounded-md"
                />

                {/* OVERLAY TOP */}
                <CustomBox
                    className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-0 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="flex items-center justify-between w-full z-10">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                        <MealCardActionButtons
                            meal={meal}
                            showUpdateButton={showUpdateButton}
                            viewMode={viewMode}
                            isPinned={isPinned}
                        />
                    </CustomBox>
                </CustomBox>

                {/* OVERLAY BOTTOM */}
                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-0 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem" />
                </CustomBox>
            </CustomBox>
        </CustomBox>
    );
};

MealCardImageSection.propTypes = {
    meal: PropTypes.object.isRequired,
    showUpdateButton: PropTypes.bool,
    viewMode: PropTypes.oneOf(["page", "list", "mobile"]),
    isPinned: PropTypes.bool,
};

export default MealCardImageSection;
