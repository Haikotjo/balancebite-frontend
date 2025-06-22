import PropTypes from "prop-types";
import { Maximize, Minimize } from "lucide-react";
import { useModal } from "../../../../context/useModal.js";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import MealModal from "../mealmodal/MealModal.jsx";

const ButtonOpenMeal = ({ meal }) => {
    const { openModal, closeModal, modalType, modalData } = useModal(); // ✅
    if (!meal?.id) return null; // ✅

    const isOpen = modalType === "meal" && modalData?.id === meal.id; // ✅

    const handleClick = () => {
        isOpen
            ? closeModal()
            : openModal(<MealModal meal={meal} />, "meal", { id: meal.id }); // ✅
    };

    // Logging
    console.log("[ButtonOpenMeal] modalType:", modalType);
    console.log("[ButtonOpenMeal] modalData:", modalData);
    console.log("[ButtonOpenMeal] meal.id:", meal?.id);
    console.log("[ButtonOpenMeal] isOpen:", isOpen);
    console.log("[ButtonOpenMeal] Icon shown:", isOpen ? "Minimize" : "Maximize");

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={isOpen ? <Minimize size={20} color="white" /> : <Maximize size={20} color="white" />}
            size={35}
        />
    );
};


ButtonOpenMeal.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default ButtonOpenMeal;
