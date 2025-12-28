// PasteImageUrlSection.jsx
import PropTypes from "prop-types";
import { Link2 } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomTextField from "../../../../components/layout/CustomTextField.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";


/**
 * Paste image URL section.
 * Pure presentational component.
 */
const PasteImageUrlSection = ({
                                  urlValue,
                                  onUrlChange,
                                  hasError,
                                  onApply,
                              }) => (
    <CustomBox className="rounded-xl border border-borderDark dark:border-borderLight p-3">
        <CustomBox className="flex items-center gap-2 mb-2">
            <Link2 size={18} className="text-primary" />
            <CustomTypography variant="bold">Paste image URL</CustomTypography>
        </CustomBox>

        <CustomTextField
            label="Image URL"
            name="imageUrl"
            variant="outlined"
            value={urlValue}
            onChange={onUrlChange}
            error={hasError}
        />

        <CustomBox className="flex justify-end mt-2">
            <CustomButton type="button" variant="solid" color="primary" onClick={onApply}>
                <CustomTypography as="span" variant="small" weight="bold" color="text-white">
                    Use URL
                </CustomTypography>
            </CustomButton>
        </CustomBox>
    </CustomBox>
);

PasteImageUrlSection.propTypes = {
    urlValue: PropTypes.string.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    onApply: PropTypes.func.isRequired,
};

export default PasteImageUrlSection;
