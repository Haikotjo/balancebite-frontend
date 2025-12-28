// PrimaryStarButton.jsx
import PropTypes from "prop-types";
import { Star } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * Primary image star button.
 * Pure presentational component.
 */
const PrimaryStarButton = ({ isPrimary, onClick }) => (
    <CustomBox
        className="absolute top-2 left-2"
        onClick={(e) => e.stopPropagation()}
    >
        <CustomIconButton
            icon={
                <Star
                    size={18}
                    className={isPrimary ? "text-yellow-400" : "text-white"}
                />
            }
            onClick={onClick}
            bgColor="bg-[rgba(0,0,0,0.45)]"
            ariaLabel="Set as primary"
        />
    </CustomBox>
);

PrimaryStarButton.propTypes = {
    isPrimary: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default PrimaryStarButton;
