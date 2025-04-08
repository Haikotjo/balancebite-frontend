import PropTypes from "prop-types";
import { useTheme, useMediaQuery } from "@mui/material";
import Select from "react-select";
import customSelectStyles from "../../styles/customSelectStyles.js";

const FloatingLabelSelectIngredient = ({
                                           label,
                                           isMulti = false,
                                           options,
                                           value = null,
                                           onChange,
                                           placeholder = "",
                                           containerStyle = {},
                                           ...rest
                                       }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const fixedWidth = isSmallScreen ? "180px" : "390px";

    return (
        <div
            style={{
                position: "relative",
                marginTop: "16px",
                width: fixedWidth,
                ...containerStyle,
            }}
        >
            <label
                style={{
                    position: "absolute",
                    top: "-10px",
                    left: "12px",
                    background: theme.palette.mode === "dark" ? "#2d2f39" : "#FFFFFF",
                    padding: "0 4px",
                    fontSize: "0.6rem",
                    color: theme.palette.mode === "dark" ? "#ffffff" : "#7a7c8b",
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


FloatingLabelSelectIngredient.propTypes = {
    containerStyle: PropTypes.object,
    label: PropTypes.string.isRequired,
    isMulti: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
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
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default FloatingLabelSelectIngredient;
