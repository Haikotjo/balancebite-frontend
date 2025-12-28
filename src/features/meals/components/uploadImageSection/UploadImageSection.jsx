// UploadImageSection.jsx
import PropTypes from "prop-types";
import { Upload } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";

/**
 * Upload image file section.
 * Pure presentational component.
 */
const UploadImageSection = ({ onUpload }) => (
    <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
        <CustomBox className="flex items-center gap-2 mb-2">
            <Upload size={18} className="text-primary" />
            <CustomTypography variant="bold">Upload file</CustomTypography>
        </CustomBox>

        <CustomBox className="flex justify-end">
            <CustomButton type="button" variant="solid" color="primary" onClick={onUpload}>
                <CustomTypography as="span" variant="small" weight="bold" color="text-white">
                    Choose file
                </CustomTypography>
            </CustomButton>
        </CustomBox>
    </CustomBox>
);

UploadImageSection.propTypes = {
    onUpload: PropTypes.func.isRequired,
};

export default UploadImageSection;
