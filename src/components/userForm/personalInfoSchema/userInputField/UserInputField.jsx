import { TextField, useTheme } from "@mui/material";
import PropTypes from "prop-types";

const UserInputField = ({ label, type = "text", register, error, helperText, isEditable }) => {
    const theme = useTheme();

    return (
        <TextField
            label={label}
            type={type}
            {...register}
            error={!!error}
            helperText={helperText}
            fullWidth
            InputProps={{
                readOnly: !isEditable,
                sx: {
                    pointerEvents: isEditable ? "auto" : "none",
                    cursor: isEditable ? "text" : "default",
                    backgroundColor: isEditable ? theme.palette.background.paper : theme.palette.action.disabledBackground, // ✅ Achtergrondkleur afhankelijk van bewerkbaarheid
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
                    backgroundColor: theme.palette.background.default,

                    "& fieldset": {
                        borderColor: theme.palette.primary.main,
                        transition: "border-color 0.3s ease, border-width 0.2s ease, background-color 0.3s ease",
                    },
                    "&:hover fieldset": {
                        borderColor: theme.palette.primary.dark,
                    },
                    "&.Mui-focused": {
                        backgroundColor: theme.palette.action.hover,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-disabled fieldset": {
                        borderColor: theme.palette.action.disabled,
                    },
                },
            }}
        />
    );
};

UserInputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    register: PropTypes.object.isRequired,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    isEditable: PropTypes.bool.isRequired,
};

export default UserInputField;
