// components/form/StepField.jsx
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";

/**
 * StepField
 * - Renders children only when active.
 * - Shows Confirm/Skip when editing; shows value preview + Edit when confirmed.
 */
const StepField = ({
                       label,
                       name,
                       required = false,
                       active,
                       confirmed,
                       previewValue,
                       onConfirm,
                       onSkip,
                       onEdit,
                       confirmDisabled = false,
                       children,
                   }) => {
    if (!active && !confirmed) return null;

    return (
        <CustomBox className="mb-4">
            <CustomBox className="flex items-center justify-between">
                <label className="font-semibold">{label}{required ? " *" : ""}</label>
                {confirmed ? (
                    <button type="button" className="underline text-sm" onClick={onEdit}>
                        Edit
                    </button>
                ) : null}
            </CustomBox>

            {confirmed ? (
                <CustomBox className="mt-1 text-sm opacity-80 break-words">
                    {previewValue ?? <em>No value</em>}
                </CustomBox>
            ) : (
                <CustomBox className="mt-2">{children}</CustomBox>
            )}

            {!confirmed && (
                <CustomBox className="mt-2 flex gap-2">
                    {!required && (
                        <CustomButton
                            type="button"
                            className="px-3 py-1 border rounded"
                            onClick={onSkip}
                        >
                            Skip
                        </CustomButton>
                    )}
                    <CustomButton
                        type="button"
                        className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                        onClick={onConfirm}
                        disabled={confirmDisabled}
                    >
                        Confirm
                    </CustomButton>
                </CustomBox>
            )}
        </CustomBox>
    );
};

StepField.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    active: PropTypes.bool.isRequired,
    confirmed: PropTypes.bool.isRequired,
    previewValue: PropTypes.node,
    onConfirm: PropTypes.func.isRequired,
    onSkip: PropTypes.func,
    onEdit: PropTypes.func.isRequired,
    confirmDisabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default StepField;
