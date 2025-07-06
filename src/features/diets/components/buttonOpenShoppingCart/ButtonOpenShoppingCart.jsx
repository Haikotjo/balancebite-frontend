import PropTypes from "prop-types";
import { ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import { ModalContext } from "../../../../context/ModalContext.jsx";

/**
 * Icon button to navigate to a diet's shopping cart.
 * If no onClick is provided, navigates to `/shopping-cart/:id`.
 * Closes modal if open.
 */
const ButtonOpenShoppingCart = ({ dietId, onClick }) => {
    const navigate = useNavigate();
    const { closeModal } = useContext(ModalContext);

    const handleClick = () => {
        closeModal();
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
