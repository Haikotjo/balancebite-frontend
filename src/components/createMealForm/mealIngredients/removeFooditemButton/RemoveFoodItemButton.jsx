import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import CustomIconButton from "../../../layout/CustomIconButton.jsx";

/**
 * RemoveFoodItemButton renders a trash icon button to remove a food item
 * from a dynamic list of ingredients.
 *
 * It disables itself when there is only one item left in the list.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.value - The full list of ingredients
 * @param {number} props.index - The index of the current item
 * @param {Function} props.onRemove - Callback to remove an item by index
 */
const RemoveFoodItemButton = ({ value, index, onRemove }) => (
    <CustomIconButton
        // Trash icon styled with red color (error)
        icon={<Trash2 size={20} className="text-error" />}
        // Calls the onRemove callback with the current index
        onClick={() => onRemove(index)}
        // Transparent background for visual integration
        bgColor="bg-transparent"
        disableScale // Disables scale animation for consistency
        // Makes button non-interactive and faded if only 1 item left
        className={value.length <= 1 ? "opacity-50 pointer-events-none" : ""}
    />
);

RemoveFoodItemButton.propTypes = {
    value: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default RemoveFoodItemButton;
