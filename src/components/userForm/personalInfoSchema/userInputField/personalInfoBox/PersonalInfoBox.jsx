import PropTypes from "prop-types";
import { Box, useTheme } from "@mui/material";

const PersonalInfoBox = ({
                             children,
                             maxWidth = 600,
                             center = true,
                             padding = 2,
                             backgroundColor,
                             color,
                             sx = {},
                             component = "form",
                             ...props
                         }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                maxWidth,
                margin: center ? "auto" : undefined,
                padding,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: backgroundColor || theme.palette.background.paper,
                color: color || theme.palette.text.primary,
                borderRadius: 2,
                boxShadow: 3,
                ...sx,
            }}
            component={component}
            {...props}
        >
            {children}
        </Box>
    );
};

PersonalInfoBox.propTypes = {
    children: PropTypes.node.isRequired,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    center: PropTypes.bool,
    padding: PropTypes.number,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    sx: PropTypes.object,
    component: PropTypes.string,
};

export default PersonalInfoBox;
