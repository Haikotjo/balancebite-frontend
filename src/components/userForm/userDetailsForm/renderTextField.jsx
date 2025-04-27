import CustomBox from "../../layout/CustomBox.jsx";
import CustomTextField from "../../layout/CustomTextField.jsx";
import CustomSelect from "../../layout/CustomSelect.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";

/**
 * Renders a single form field, either a text input or a select dropdown.
 * Displays a red error message underneath the field if validation fails.
 *
 * @param {string} label - The label text for the field.
 * @param {string} name - The name attribute of the field.
 * @param {object} watchedFields - Current form values from react-hook-form.
 * @param {function} register - react-hook-form register function.
 * @param {object} errors - Validation errors object.
 * @param {boolean} isEditable - Whether the field is editable.
 * @param {string} [type="text"] - Field type (e.g., "text", "number").
 * @param {boolean} [isSelect=false] - Whether the field is a select box.
 * @param {Array} [options=[]] - Options for select dropdowns.
 * @returns {JSX.Element} The rendered field.
 */
export const renderTextField = (
    label,
    name,
    watchedFields,
    register,
    errors,
    isEditable,
    type = "text",
    isSelect = false,
    options = []
) => {
    const hasError = !!errors[name];

    return (
        <CustomBox className="flex flex-col gap-1">
            {isSelect ? (
                <CustomSelect
                    label={label}
                    name={name}
                    value={watchedFields[name] || ""}
                    register={register}
                    error={hasError}
                    disabled={!isEditable}
                    options={options}
                />
            ) : (
                <CustomTextField
                    label={label}
                    name={name}
                    value={watchedFields[name]}
                    register={register}
                    type={type}
                    disabled={!isEditable}
                    error={hasError}
                />
            )}
            {hasError && (
                <CustomTypography as="span" className="text-red-500 text-sm">
                    {errors[name]?.message}
                </CustomTypography>
            )}
        </CustomBox>
    );
};
