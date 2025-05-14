// src/components/MealCardIngredients/MealCardIngredients.jsx

import PropTypes from "prop-types";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import BulletText from "../../../components/layout/BulletText.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";

/**
 * Displays a styled list of meal ingredients with bullet points.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.ingredients - Array of ingredient objects with foodItemName and quantity.
 * @returns {JSX.Element}
 */
const MealCardIngredients = ({ ingredients }) => {
    if (!ingredients?.length) return null;

    return (
        <>
            <CustomTypography variant="h4" bold className="mb-2">
                Ingredients:
            </CustomTypography>

            <CustomBox className="space-y-1">
                {ingredients.map((ingredient) => (
                    <BulletText key={ingredient.id}>
                        <CustomTypography className="text-sm">
                            {`${ingredient.foodItemName} - `}
                            <span className="text-[0.7rem] md:text-[0.85rem]">({ingredient.quantity} gram)</span>
                        </CustomTypography>
                    </BulletText>
                ))}
            </CustomBox>
        </>
    );
};

MealCardIngredients.propTypes = {
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            foodItemName: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default MealCardIngredients;
