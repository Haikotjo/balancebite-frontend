import CustomTextField from "../../layout/CustomTextField.jsx";
import CustomSelect from "../../layout/CustomSelect.jsx";

/**
 * Renders either a CustomTextField or CustomSelect based on props.
 *
 * @param {string} label - The field label.
 * @param {string} fieldName - The field name.
 * @param {object} watchedFields - Watched form values.
 * @param {function} register - react-hook-form register function.
 * @param {object} errors - Validation errors.
 * @param {boolean} isEditable - Whether the field is editable.
 * @param {string} type - Field type (e.g., text, number).
 * @param {boolean} select - Whether this field is a dropdown/select.
 * @param {array} options - Options for select fields.
 * @returns {JSX.Element} The rendered form field.
 */
export const renderTextField = (
    label,
    fieldName,
    watchedFields,
    register,
    errors,
    isEditable,
    type = "text",
    select = false,
    options = []
) => {
    if (select) {
        return (
            <CustomSelect
                label={label}
                name={fieldName}
                value={watchedFields[fieldName] || ""}
                register={register}
                error={errors[fieldName]}
                helperText={errors[fieldName]?.message}
                disabled={!isEditable}
                options={options}
            />
        );
    } else {
        return (
            <CustomTextField
                label={label}
                name={fieldName}
                type={type}
                register={register}
                error={errors[fieldName]}
                helperText={errors[fieldName]?.message}
                disabled={!isEditable}
            />
        );
    }
};
