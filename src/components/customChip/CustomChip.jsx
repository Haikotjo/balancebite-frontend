import { Box, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * CustomChip component: A manually styled alternative to MUI Chip.
 * Ensures icons are always centered properly and dynamically resizes.
 *
 * @param {object} props - The component props.
 * @param {React.ReactElement} props.icon - The icon to display inside the chip.
 * @param {string} [props.label] - Optional text label to display above or below the chip.
 * @param {boolean} [props.selected=false] - If true, the chip is highlighted as selected.
 * @param {function} props.onClick - Callback function triggered when the chip is clicked.
 * @param {number} [props.iconMargin=0] - The horizontal margin around the icon (affects width).
 * @param {number} [props.iconSize=0] - The size of the icon, affecting chip height.
 * @param {string} [props.labelPosition="bottom"] - Determines whether the label appears "top" or "bottom".
 * @param {string} [props.labelFontSize="0.7rem"] - The font size of the label.
 */
const CustomChip = React.forwardRef(
    (
        {
            icon,
            label,
            selected,
            onClick,
            iconMargin = 0,
            iconSize = 0,
            labelPosition = "bottom",
            labelFontSize = "0.7rem",
            className,
        },
        ref // Add ref here
    ) => {
        const theme = useTheme();
        const extraWidth = icon ? iconMargin * 2 : 0; // Adjust chip width based on icon margin
        const chipHeight = iconSize + 10; // Adjust chip height based on icon size

        return (
            <Box
                ref={ref}
                className={className}
                sx={{
                    display: "flex",
                    flexDirection: labelPosition === "bottom" ? "column-reverse" : "column",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": { opacity: 0.8 },
                }}
                onClick={onClick} // Make the entire chip clickable
            >
                {/* Render the label above or below the chip */}
                {icon ? (
                    <Typography
                        sx={{
                            fontSize: labelFontSize,
                            textAlign: "center",
                            marginBottom: labelPosition === "top" ? "4px" : "0px",
                            marginTop: labelPosition === "bottom" ? "4px" : "0px",
                            color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                            fontWeight: "bold",
                        }}
                    >
                        {label}
                    </Typography>
                ) : null}

                {/* Render the chip containing the icon */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 40 + extraWidth, // Adjust width dynamically
                        height: `${chipHeight}px`, // Adjust height dynamically
                        paddingX: "12px",
                        borderRadius: `${chipHeight / 2}px`, // Rounded chip design
                        border: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: selected ? theme.palette.primary.main : "transparent",
                        color: selected ? theme.palette.text.light : theme.palette.primary.main,
                        transition: "background-color 0.3s ease",
                        "&:hover": { backgroundColor: selected ? theme.palette.primary.dark : theme.palette.primary.light },
                    }}
                >
                    {icon || label}
                </Box>
            </Box>
        );
    }
);

// Define the expected prop types for the component
CustomChip.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.element, // The icon must be a React element
    label: PropTypes.string, // Optional label text
    selected: PropTypes.bool, // Boolean indicating if the chip is selected
    onClick: PropTypes.func.isRequired, // Function that is called when the chip is clicked
    iconMargin: PropTypes.number, // Margin around the icon affecting chip width
    iconSize: PropTypes.number, // Size of the icon, affecting chip height
    labelPosition: PropTypes.oneOf(["top", "bottom"]), // Determines label placement
    labelFontSize: PropTypes.string, // Font size for the label
};

export default CustomChip;
