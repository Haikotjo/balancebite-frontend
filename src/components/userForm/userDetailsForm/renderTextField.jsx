import { TextField, MenuItem } from "@mui/material";

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
) => (
    <TextField
        select={select}
        label={label}
        type={type}
        value={watchedFields[fieldName] || ""}
        {...register(fieldName)}
        error={!!errors[fieldName]}
        helperText={errors[fieldName]?.message}
        fullWidth
        InputProps={{
            readOnly: !isEditable,
        }}
        sx={{
            backgroundColor: !isEditable ? "#f5f5f5" : "white",
        }}
    >
        {select && options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </TextField>
);
