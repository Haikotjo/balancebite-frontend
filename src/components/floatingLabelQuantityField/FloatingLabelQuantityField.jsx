import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

/**
 * A floating-label input field for quantity that emulates an outlined text field.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label displayed above the input.
 * @param {string|number} props.value - The current value of the input.
 * @param {Function} props.onChange - Callback fired when the input value changes.
 * @param {string} [props.placeholder=""] - Placeholder text when the input is empty.
 * @returns {JSX.Element} The floating-label quantity input field.
 */
const FloatingLabelQuantityField = ({
                                        label,
                                        value,
                                        onChange,
                                        placeholder = "",
                                        ...rest
                                    }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <div style={{ position: "relative", marginTop: "16px" }}>
            <label
                style={{
                    position: "absolute",
                    top: "-10px",
                    left: "12px",
                    background: isDarkMode ? "#2d2f39" : "#FFFFFF",
                    padding: "0 4px",
                    fontSize: "0.6rem",
                    color: theme.palette.mode === "dark" ? "#ffffff" : "#7a7c8b",
                    zIndex: 1,
                }}
            >
                {label}
            </label>
            <TextField
                variant="outlined"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: isDarkMode ? "#2d2f39" : "#FFFFFF",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: theme.palette.primary.main,
                        boxShadow: "none",
                        "&:hover fieldset": {
                            borderColor: theme.palette.primary.dark,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: "2px",
                        },
                    },
                    "& .MuiInputBase-input": {
                        fontSize: "0.9rem",
                        color: theme.palette.text.primary,
                        padding: "10px 14px",
                    },
                }}
                {...rest}
            />
        </div>
    );
};

FloatingLabelQuantityField.propTypes = {
    /** The label displayed above the input field. */
    label: PropTypes.string.isRequired,
    /** The current value of the input field. */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Callback fired when the input value changes. */
    onChange: PropTypes.func.isRequired,
    /** Placeholder text shown when the input is empty. */
    placeholder: PropTypes.string,
};

export default FloatingLabelQuantityField;
