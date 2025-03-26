import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Select from "react-select";
import customSelectStyles from "./customSelectStyles.js";

/**
 * A floating-label Select component that emulates an outlined text field style.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The label displayed above the Select.
 * @param {boolean} [props.isMulti=false] - If true, multiple options can be selected.
 * @param {Array<{value:string, label:string}>} props.options - The selectable options.
 * @param {Object|Object[]} [props.value=null] - The currently selected option(s).
 * @param {Function} props.onChange - Callback fired when the selection changes.
 * @param {string} [props.placeholder=""] - Placeholder text when no selection is made.
 * @returns {JSX.Element} The floating-label Select component.
 */
const FloatingLabelSelect = ({
                                 label,
                                 isMulti,
                                 options,
                                 value,
                                 onChange,
                                 placeholder,
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
                    fontSize: "0.75rem",
                    color: theme.palette.text.primary,
                    zIndex: 1,
                }}
            >
                {label}
            </label>
            <Select
                isMulti={isMulti}
                options={options}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                styles={customSelectStyles(theme)}
                classNamePrefix="react-select"
                {...rest}
            />
        </div>
    );
};

FloatingLabelSelect.propTypes = {
    /** The label displayed above the Select. */
    label: PropTypes.string.isRequired,

    /** If true, multiple options can be selected. */
    isMulti: PropTypes.bool,

    /** An array of selectable options, each with a 'value' and 'label'. */
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,

    /** The currently selected option(s). */
    value: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string,
                label: PropTypes.string,
            })
        ),
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
        }),
    ]),

    /** Callback fired when the selection changes. */
    onChange: PropTypes.func.isRequired,

    /** Placeholder text shown when no selection is made. */
    placeholder: PropTypes.string,
};

FloatingLabelSelect.defaultProps = {
    isMulti: false,
    value: null,
    placeholder: "",
};

export default FloatingLabelSelect;
