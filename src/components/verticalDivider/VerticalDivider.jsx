import PropTypes from "prop-types";
import { Box, useTheme, useMediaQuery } from "@mui/material";

/**
 * A vertical divider component with customizable height, width, and margins.
 * You can specify individual left and right margins or use `marginX` for both sides.
 * Additionally, you can hide the divider on mobile screens using `hiddenOnMobile`.
 *
 * @component
 * @example
 * // Default divider
 * <VerticalDivider />
 *
 * @example
 * // Custom height, width, and margins
 * <VerticalDivider height="32px" width="2px" marginLeft={2} marginRight={3} />
 *
 * @example
 * // Hide on mobile screens
 * <VerticalDivider hiddenOnMobile />
 *
 * @param {object} props - The component props.
 * @param {string} [props.height="24px"] - The height of the divider.
 * @param {string} [props.width="1px"] - The width of the divider.
 * @param {number} [props.marginX] - The horizontal margin (applies to both left and right).
 * @param {number} [props.marginLeft] - The left margin (overrides `marginX` for the left side).
 * @param {number} [props.marginRight] - The right margin (overrides `marginX` for the right side).
 * @param {string} [props.color] - The color of the divider (default is `theme.palette.text.light`).
 * @param {boolean} [props.hiddenOnMobile] - Whether to hide the divider on mobile screens.
 *
 * @returns {JSX.Element|null} A styled vertical divider, or `null` if hidden on mobile.
 */
const VerticalDivider = ({ height = "24px", width = "1px", marginX= 1, marginLeft, marginRight, color, hiddenOnMobile }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Hide the divider on mobile if hiddenOnMobile is true
    if (hiddenOnMobile && isMobile) return null;

    return (
        <Box
            sx={{
                height,
                width,
                backgroundColor: color || theme.palette.text.light,
                mx: marginX,
                ml: marginLeft,
                mr: marginRight,
            }}
        />
    );
};

VerticalDivider.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string,
    marginX: PropTypes.number,
    marginLeft: PropTypes.number,
    marginRight: PropTypes.number,
    color: PropTypes.string,
    hiddenOnMobile: PropTypes.bool,
};

export default VerticalDivider;
