import PropTypes from "prop-types";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";


/**
 * Icon button to navigate to a diet's shopping cart.
 * If no onClick is provided, navigates to `/diet/:id/shoppingcart`.
 *
 * @component
 * @param {Object} props
 * @param {string|number} props.dietId - ID of the diet.
 * @param {Function} [props.onClick] - Optional custom click handler.
 * @returns {JSX.Element}
 */
const ButtonOpenShoppingCart = ({ dietId, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/shopping-cart/${dietId}`);
        }
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<ShoppingBasket size={20} color="white" />}
            size={35}
        />
    );
};

ButtonOpenShoppingCart.propTypes = {
    dietId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.func,
};

export default ButtonOpenShoppingCart;
