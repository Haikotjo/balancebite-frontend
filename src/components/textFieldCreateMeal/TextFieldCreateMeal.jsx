import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

const TextFieldCreateMeal = React.forwardRef(({
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
                                              }, ref) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <TextField
            label={label}
            variant="outlined"
            inputRef={ref}
            inputProps={{
                ...rest,
                ...(register ? register(name) : {}),
            }}
            error={!!error}
            helperText={helperText}
            multiline={multiline}
            rows={rows}
            type={type}
            value={value}
            onChange={onChange}
            fullWidth={fullWidth}
            slotProps={slotProps}
            InputLabelProps={{
                shrink: true,
                sx: {
                    fontSize: { xs: "0.8rem"},
                    color: theme.palette.mode === "dark" ? "#ffffff" : "#7a7c8b",
                    "&.Mui-focused": {
                        color: theme.palette.mode === "dark" ? "#ffffff" : theme.palette.primary.main,
                    },
                },
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#2d2f39" : "#FFFFFF",
                    "& fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "1px",
                        borderStyle: "solid",
                    },
                    "&:hover fieldset": {
                        borderColor: theme.palette.primary.dark,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "1px",
                    },
                },
                "& .MuiInputBase-input": {
                    fontSize: "0.9rem",
                    color: theme.palette.text.primary,
                    padding: "10px 14px",
                },
                ...sx,
            }}
            {...rest}
        />
    );
});

TextFieldCreateMeal.displayName = "TextFieldCreateMeal";

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
