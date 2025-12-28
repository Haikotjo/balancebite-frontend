// TakePhotoSection.jsx
import PropTypes from "prop-types";
import { Camera as CameraIcon } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import Camera from "../camera/Camera.jsx";

/**
 * Take photo section.
 * Pure presentational component.
 */
const TakePhotoSection = ({ onCapture }) => (
    <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
        <CustomBox className="flex items-center gap-2 mb-2">
            <CameraIcon size={18} className="text-primary" />
            <CustomTypography variant="bold">Take photo</CustomTypography>
        </CustomBox>

        <Camera disabled={false} onCapture={onCapture} />
    </CustomBox>
);

TakePhotoSection.propTypes = {
    onCapture: PropTypes.func.isRequired,
};

export default TakePhotoSection;
