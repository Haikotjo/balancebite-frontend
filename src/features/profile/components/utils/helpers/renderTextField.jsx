import CustomBox from "../../../../../components/layout/CustomBox.jsx";
import CustomTextField from "../../../../../components/layout/CustomTextField.jsx";
import CustomSelect from "../../../../../components/layout/CustomSelect.jsx";

/**
 * Renders a single form field, either a text input or a select dropdown.
 * Displays a red error message underneath the field if validation fails.
 */
export const renderTextField = (
    label,
    name,
    watchedFields,
    register,
    errors,
    isEditable,
    setValue,
    type = "text",
    isSelect = false,
    options = []
) => {
    const fieldError = errors[name];

    return (
        <CustomBox className="flex flex-col gap-1">
            {isSelect ? (
                <CustomSelect
                    label={label}
                    name={name}
                    value={watchedFields[name] || ""}
                    onChange={(e) => setValue(name, e.target.value)}
                    error={!!fieldError}
                    helperText={fieldError?.message}
                    disabled={!isEditable}
                    options={options}
                />
            ) : (
                <CustomTextField
                    label={label}
                    name={name}
                    {...register(name)}
                    error={!!fieldError}
                    helperText={fieldError?.message}
                    type={type}
                    disabled={!isEditable}
                />
            )}
        </CustomBox>
    );
};
