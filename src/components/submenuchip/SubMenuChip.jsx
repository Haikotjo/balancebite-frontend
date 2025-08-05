import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import clsx from "clsx";

/**
 * SubMenuChip: A larger version of CustomChip, made specifically for use in SubMenuGeneric.
 * Doubled size, slightly larger icon, same interface.
 *
 * @component
 * @param {object} props
 * @param {React.ReactElement} props.icon - Icon element to render.
 * @param {string} [props.label] - Optional label to show above or below.
 * @param {boolean} [props.selected=false] - Visual selection state.
 * @param {function} props.onClick - Click handler.
 * @param {string} [props.labelPosition="bottom"] - "top" or "bottom".
 * @param {string} [props.labelFontSize="text-[0.8rem]"] - Tailwind font size class.
 * @param {string} [props.className] - Optional class override.
 */
const SubMenuChip = ({
                         icon,
                         label,
                         selected = false,
                         onClick,
                         labelPosition = "bottom",
                         labelFontSize = "text-[0.8rem]",
                         className = ""
                     }) => {
    const iconSize = 36;
    const chipSize = iconSize + 20;
    const chipStyle = {
        width: `${chipSize}px`,
        height: `${chipSize}px`
    };

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
                        selected ? "text-primary" : "text-gray-700 dark:text-gray-300",
                        labelPosition === "top" ? "mb-2" : "mt-2"
                    )}
                >
                    {label}
                </CustomTypography>
            )}

            <CustomBox
                style={chipStyle}
                className={clsx(
                    "rounded-full border-2 flex items-center justify-center transition-colors duration-200",
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

SubMenuChip.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    labelPosition: PropTypes.oneOf(["top", "bottom"]),
    labelFontSize: PropTypes.string,
    className: PropTypes.string,
};

export default SubMenuChip;
