import PropTypes from "prop-types";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";
import DietModal from "../dietmodal/DietModal.jsx";

/**
 * Icon button to open a diet in a modal (always modal, all screens).
 */
const ButtonOpenDiet = ({ diet }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (!diet || !diet.id) return;
        setIsModalOpen(true);
    };

    return (
        <>
            <CustomIconButton
                onClick={handleClick}
                icon={<ExternalLink size={20} color="white" />}
                size={35}
            />

            {isModalOpen && (
                <DietModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    diet={diet}
                />
            )}
        </>
    );
};

ButtonOpenDiet.propTypes = {
    diet: PropTypes.object.isRequired,
};

export default ButtonOpenDiet;
