import PropTypes from "prop-types";
import { useModal } from "../../../../context/useModal.js";
import MealModal from "../mealmodal/MealModal.jsx";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardCompact = ({ meal }) => {
    const imageSrc = getImageSrc(meal);
    const { openModal } = useModal();

    const handleOpen = () => {
        openModal(<MealModal meal={meal} />, "meal", { id: meal.id });
    };

    return (
        <CustomBox
            className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md border border-borderLight cursor-pointer"
            onClick={handleOpen}
        >
            <CustomImage
                src={imageSrc}
                alt={meal.name}
                draggable={false}
                className="w-full h-full object-cover"
            />

            {/* Overlay boven */}
            <CustomBox
                className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-10 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <CustomBox className="absolute inset-0 rounded-md z-0" />
                <CustomBox className="flex items-center justify-between w-full z-10">
                    <CustomBox className="flex items-center">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                    </CustomBox>
                    <ButtonOpenMeal meal={meal} />
                </CustomBox>
            </CustomBox>

            {/* Overlay onder */}
            <CustomBox
                className="absolute bottom-0 left-0 w-full bg-[rgba(0,0,0,0.5)] p-1 z-20"
                onClick={(e) => e.stopPropagation()}
            >
                <CustomTypography className="text-white text-sm font-semibold truncate text-left pl-1">
                    {meal.name}
                </CustomTypography>
            </CustomBox>
        </CustomBox>
    );
};

MealCardCompact.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCardCompact;
