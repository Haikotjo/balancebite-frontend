// ClearAllImagesButton.jsx
import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomIconButton from "../../../../components/layout/CustomIconButton.jsx";

/**
 * Clear all images button.
 * Pure presentational component.
 */
const ClearAllImagesButton = ({ onClear }) => (
    <CustomBox className="flex justify-center">
        <CustomIconButton
            icon={<Trash2 size={20} className="text-error" />}
            onClick={onClear}
            bgColor="bg-transparent"
            ariaLabel="Clear all images"
        />
    </CustomBox>
);

ClearAllImagesButton.propTypes = {
    onClear: PropTypes.func.isRequired,
};

export default ClearAllImagesButton;
