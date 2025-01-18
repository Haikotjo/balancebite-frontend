import { TextField, MenuItem } from "@mui/material";

export const renderTextField = (
    label,
    fieldName,
    watchedFields,
    register,
    errors,
    isEditable,
    theme,
    type = "text",
    select = false,
    options = []
) =>  (
        <TextField
            select={select}
            label={label}
            type={type}
            defaultValue={watchedFields[fieldName] || ""}
            {...register(fieldName)}
            error={!!errors[fieldName]}
            helperText={errors[fieldName]?.message}
            fullWidth
            InputProps={{
                readOnly: !isEditable,
                sx: {
                    pointerEvents: isEditable ? "auto" : "none",
                    cursor: isEditable ? "text" : "default",
                },
            }}
            InputLabelProps={{
                shrink: true,
                sx: {
                    color: theme.palette.primary.main,
                },
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                        borderColor: theme.palette.primary.dark,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "2px",
                    },
                    "&.Mui-disabled fieldset": {
                        borderColor: theme.palette.action.disabled,
                    },
                },
                "& .MuiSelect-icon": {
                    color: theme.palette.text.primary,
                },
            }}
        >
            {select &&
                options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>

);
