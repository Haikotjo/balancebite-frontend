import PropTypes from "prop-types";
import ButtonOpenMeal from "../buttonOpenMeal/ButtonOpenMeal.jsx";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import {getImageSrc} from "../../utils/helpers/getImageSrc.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const MealCardCompact = ({ meal }) => {
    const imageSrc = getImageSrc(meal);

    return (
        <CustomBox
            className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md border border-borderLight"
        >
            <CustomImage
                src={imageSrc}
                alt={meal.name}
                draggable={false}
                className="w-full h-full object-cover"
            />

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
                    <ButtonOpenMeal mealId={meal.id} />
                </CustomBox>

            </CustomBox>

            <CustomBox className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 z-20">
                <CustomTypography className="text-white text-sm font-semibold truncate text-left pl-1">
                    {meal.name}
                </CustomTypography>
            </CustomBox>
        </CustomBox>
    );
};

MealCardCompact.propTypes = {
    meal: PropTypes.object.isRequired,
    clickable: PropTypes.bool,
};

export default MealCardCompact;
