// src/components/layout/customChip/CustomChip.jsx
import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";
import CustomTypography from "./CustomTypography.jsx";
import clsx from "clsx";

/**
 * CustomChip component: A manually styled chip using Tailwind, ready for React Native transition.
 * Supports icon, label, dynamic sizing, and visual selection.
 *
 * @component
 * @param {object} props
 * @param {React.ReactElement} props.icon - The icon to render inside the chip.
 * @param {string} [props.label] - Optional label to display above or below the chip.
 * @param {boolean} [props.selected=false] - Whether the chip is visually selected.
 * @param {function} props.onClick - Callback for click events.
 * @param {number} [props.iconMargin=0] - Extra spacing around the icon.
 * @param {number} [props.iconSize=24] - Icon size (for wrapper calculation).
 * @param {string} [props.labelPosition="bottom"] - "top" or "bottom" label placement.
 * @param {string} [props.className] - Optional outer class.
 */
const CustomChip = ({
                        icon,
                        label,
                        selected = false,
                        onClick,
                        iconMargin = 0,
                        iconSize = 24,
                        labelPosition = "bottom",
                        className = ""
                    }) => {
    const spacingClass = iconMargin ? `px-[${iconMargin}px]` : "px-3";
    const chipHeight = iconSize + 10;
    const dimensionClass = `w-[${chipHeight}px] h-[${chipHeight}px]`;


    return (
        <CustomBox
            onClick={onClick}
            className={clsx(
                "flex items-center cursor-pointer select-none",
                labelPosition === "top" ? "flex-col" : "flex-col-reverse",
                className
            )}
        >
            {label && (
                <CustomTypography
                    as="span"
                    font="sans"
                    variant="xsmallCard"
                    weight="normal"
                    className={clsx(
                        "text-center",
                        labelPosition === "top" ? "mb-1" : "mt-1"
                    )}

                >
                    {label}
                </CustomTypography>
            )}

            <CustomBox
                className={clsx(
                    "rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                    dimensionClass,
                    spacingClass,
                    selected
                        ? "bg-primary border-primary text-white"
                        : "bg-white dark:bg-gray-800 border-primary text-primary"
                )}
            >
                {icon}
            </CustomBox>
        </CustomBox>
    );
};

CustomChip.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    iconMargin: PropTypes.number,
    iconSize: PropTypes.number,
    labelPosition: PropTypes.oneOf(["top", "bottom"]),
    className: PropTypes.string,
};

export default CustomChip;