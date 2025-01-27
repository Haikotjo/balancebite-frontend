import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

const TextFieldCreateMeal = ({
                                 label,
                                 register,
                                 name,
                                 error,
                                 helperText,
                                 multiline = false,
                                 rows,
                                 type,
                                 value,
                                 onChange,
                                 slotProps,
                                 sx,
                                 fullWidth = true,
                                 ...rest
                             }) => {
    const theme = useTheme();

    return (
        <TextField
            label={label}
            variant="outlined"
            {...(register ? register(name) : {})}
            error={!!error}
            helperText={helperText}
            multiline={multiline}
            rows={rows}
            type={type}
            value={value}
            onChange={onChange}
            fullWidth={fullWidth}
            slotProps={slotProps}
            InputLabelProps={{ shrink: true }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: theme.palette.primary.main },
                    "&:hover fieldset": { borderColor: theme.palette.primary.dark },
                    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main, borderWidth: 2 },
                },
                "& .MuiInputBase-input": { fontSize: { xs: "0.8rem", sm: "1rem" }, padding: "10px 14px" },
                "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                    color: "text.primary",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
                ...sx,
            }}
            {...rest}
        />
    );
};


TextFieldCreateMeal.propTypes = {
    label: PropTypes.string.isRequired,
    register: PropTypes.func,
    name: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    slotProps: PropTypes.object,
    sx: PropTypes.object,
    fullWidth: PropTypes.bool,
};

export default TextFieldCreateMeal;
