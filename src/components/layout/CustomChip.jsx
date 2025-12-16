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

/**
 * CustomChip component: A manually styled chip using Tailwind, ready for React Native transition.
 * Supports icon, label, dynamic sizing, and visual selection.
 */
// CustomChip.jsx
const CustomChip = ({
                        icon,
                        label,
                        selected = false,
                        onClick,
                        selectedBorderClass = "",   // NEW
                        iconMargin = 0,
                        iconSize = 24,
                        labelPosition = "bottom",
                        className = "",
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
                    className={clsx("text-center", labelPosition === "top" ? "mb-1" : "mt-1.5")}
                >
                    {label}
                </CustomTypography>
            )}

            <CustomBox
                className={clsx(
                    "rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                    dimensionClass,
                    spacingClass,

                    // background stays ALWAYS the same
                    "bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText",

                    // default border
                    "border-borderDark dark:border-borderLight",

                    // ONLY border changes when selected
                    selected && selectedBorderClass,
                    selected && "scale-[1.1]"
                )}
            >
               <span className={clsx("transition-transform duration-200", selected && "scale-110")}>
    {icon}
  </span>
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
    selectedBorderClass: PropTypes.string,

};

export default CustomChip;
