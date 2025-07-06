// src/components/MealCardIngredients/MealCardIngredients.jsx
import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import BulletText from "../../../../components/layout/BulletText.jsx";
import PromotionInfo from "../../../../components/promotioninfo/PromotionInfo.jsx";

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

    console.log("MealCardIngredients received:", ingredients);

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
                            <CustomTypography as="span" variant="xsmallCard">
                                ({ingredient.quantity} gram)
                            </CustomTypography>
                        </CustomTypography>

                        {ingredient.foodItem?.promoted && (
                            <PromotionInfo
                                start={ingredient.foodItem.promotionStartDate}
                                end={ingredient.foodItem.promotionEndDate}
                                source={ingredient.foodItem.source}
                                className="ml-6 mt-1"
                            />
                        )}



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
