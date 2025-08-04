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
 * @param {string} [props.labelFontSize="text-[0.7rem]"] - Font size class for the label.
 * @param {string} [props.className] - Optional outer class.
 * @param {boolean} [props.tight=false] - Reduce vertical spacing between label and chip.
 */
const CustomChip = ({
                        icon,
                        label,
                        selected = false,
                        onClick,
                        iconMargin = 0,
                        iconSize = 24,
                        chipSize, // ✅ optional
                        labelPosition = "bottom",
                        labelFontSize = "text-[0.7rem]",
                        className = "",
                        tight = false,
                    }) => {
    const spacingClass = iconMargin ? `px-[${iconMargin}px]` : "px-3";
    const finalSize = chipSize || iconSize + 10; // ✅ chipSize overrulet iconSize
    const dimensionClass = `w-[${finalSize}px] h-[${finalSize}px]`;

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
                    className={clsx(
                        labelFontSize,
                        "text-center font-semibold",
                        selected ? "text-primary" : "undefined",
                        labelPosition === "top"
                            ? tight ? "mb-0.5" : "mb-1"
                            : tight ? "mt-0.5" : "mt-1"
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
    chipSize: PropTypes.number, // ✅ toegevoegd
    labelPosition: PropTypes.oneOf(["top", "bottom"]),
    labelFontSize: PropTypes.string,
    className: PropTypes.string,
    tight: PropTypes.bool,
};

CustomChip.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    iconMargin: PropTypes.number,
    iconSize: PropTypes.number,
    labelPosition: PropTypes.oneOf(["top", "bottom"]),
    labelFontSize: PropTypes.string,
    className: PropTypes.string,
    tight: PropTypes.bool,
};

export default CustomChip;