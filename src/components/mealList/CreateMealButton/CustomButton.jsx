import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

/**
 * A reusable button component styled with the primary color from the theme.
 * It includes a customizable icon and white text, designed for various actions.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} props.onClick - Function to handle the button click.
 * @param {React.Element} props.icon - Icon to be displayed inside the button.
 * @param {string} props.label - Text label of the button.
 * @param {string} [props.variant="contained"] - Variant of the button (contained or outlined).
 * @returns {JSX.Element} The styled CustomButton component.
 */
const CustomButton = ({ onClick, icon, label, variant = "contained" }) => {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: variant === "contained" ? "primary.main" : "transparent",
                color: variant === "contained" ? "white" : "primary.main",
                border: variant === "outlined" ? "1px solid" : "none",
                borderColor: variant === "outlined" ? "primary.main" : "none",
                borderRadius: "12px",
                padding: "8px 16px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                '&:hover': {
                    backgroundColor: variant === "contained" ? "primary.dark" : "primary.light",
                },
            }}
            startIcon={icon}
        >
            {label}
        </Button>
    );
};

CustomButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["contained", "outlined"]),
};

export default CustomButton;
