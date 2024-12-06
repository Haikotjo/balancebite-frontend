import PropTypes from "prop-types";

const IngredientList = ({ ingredients }) => {
    const truncateTextAtComma = (text) => {
        if (!text) return "Unknown";
        const commaIndex = text.indexOf(",");
        return commaIndex !== -1 ? text.slice(0, commaIndex) : text;
    };

    return (
        <ul>
            {ingredients.map((ingredient) => {
                if (!ingredient.foodItemName) {
                    throw new Error("Ingredient field is missing!");
                }
                return (
                    <li
                        key={ingredient.id}
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: "0.8rem",
                        }}
                    >
                        {truncateTextAtComma(ingredient.foodItemName)} - {ingredient.quantity} grams
                    </li>
                );
            })}
        </ul>
    );
};

IngredientList.propTypes = {
    ingredients: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            foodItemName: PropTypes.string,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default IngredientList;
