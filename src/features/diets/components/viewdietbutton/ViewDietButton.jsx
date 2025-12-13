// ViewDietButton.jsx
import PropTypes from "prop-types";
import { SquareArrowOutUpRight } from "lucide-react";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

const ViewDietButton = ({ dietId, iconSize = 35 }) => {
    const handleClick = () => {
        window.open(`/diet/${dietId}`, "_blank", "noopener,noreferrer");
    };

    return (
        <CustomIconButton
            onClick={handleClick}
            icon={<SquareArrowOutUpRight size={20} color="white" />}
            size={iconSize}
        />
    );
};

ViewDietButton.propTypes = {
    dietId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    iconSize: PropTypes.number,
};

export default ViewDietButton;
