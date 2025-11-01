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
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import MealCardMacrosCompact from "../mealCardMacrosCompact/MealCardMacrosCompact.jsx";

const MealCardImageSection = ({
                                  meal,
                                  viewMode = "page",
                                  showUpdateButton = true,
                                  isPinned = false,
                                  priceLabel,
                                  macros,
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
                <CustomImage src={imageSrc} alt={meal.name} className="w-full h-full object-cover rounded-md" />

                {/* OVERLAY TOP (prep-time + actions) – omlaag gezet onder de macrosbar */}
                <CustomBox
                    className="absolute top-1 w-full flex items-center justify-between px-2 py-1 z-10
                     pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="flex items-center mr-1">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                    </CustomBox>

                    <MealCardActionButtons
                        meal={meal}
                        showUpdateButton={showUpdateButton}
                        viewMode={viewMode}
                        isPinned={isPinned}
                    />

                    {/* PRICE CHIP – top-right */}
                    {priceLabel && (
                        <CustomBox className="absolute top-2 right-2 z-30" onClick={(e) => e.stopPropagation()}>
                            <CustomTypography as="span" variant="xsmallCard" bold className="rounded-full px-3 py-1 bg-primary text-white">
                                {priceLabel}
                            </CustomTypography>
                        </CustomBox>
                    )}


                    {/* VERTICAL MACROS – right, just under price chip */}
                    {macros && (
                        <CustomBox
                            className="absolute right-2 top-12 z-20 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MealCardMacrosCompact
                                macros={macros}
                                vertical                        // ← stack items vertically
                                iconSize={18}
                                textClassName="text-white"
                                className="text-white"
                                rowClassName="flex flex-col items-end gap-2" // right-align, nice spacing
                                // itemClassName default adds per-item chip bg/blur/rounded
                            />
                        </CustomBox>
                    )}
                </CustomBox>

                {/* OVERLAY BOTTOM (creator info) */}
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
    priceLabel: PropTypes.string,
    macros: PropTypes.object,
};

export default MealCardImageSection;
