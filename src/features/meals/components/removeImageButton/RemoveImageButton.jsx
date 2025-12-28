// RemoveImageButton.jsx
import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * Remove image button.
 * Pure presentational component.
 */
const RemoveImageButton = ({ onClick }) => (
    <CustomBox
        className="absolute top-2 right-2"
        onClick={(e) => e.stopPropagation()}
    >
        <CustomIconButton
            icon={<Trash2 size={18} className="text-error" />}
            onClick={onClick}
            bgColor="bg-[rgba(0,0,0,0.45)]"
            ariaLabel="Remove image"
        />
    </CustomBox>
);

RemoveImageButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default RemoveImageButton;
