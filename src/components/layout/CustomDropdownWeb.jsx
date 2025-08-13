import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox";
import { useDropdown } from "../../hooks/useDropdown.js";
import CustomDivider from "./CustomDivider.jsx";

/**
 * A dropdown menu component that displays a trigger element and
 * shows a list of items when opened. Each item can be clicked
 * to perform an action and then closes the menu.
 *
 * @param {object} props
 * @param {React.ReactNode} props.trigger - The element that toggles the dropdown.
 * @param {Array} props.items - Array of menu items with label, onClick, icon, and disabled flag.
 * @param {string} [props.className] - Additional Tailwind CSS classes for the dropdown panel.
 * @returns {JSX.Element}
 */
export default function CustomDropdownWeb({
                                              trigger,
                                              items = [],
                                              className = ""
                                          }) {
    // Destructure dropdown state and handlers from custom hook
    const { open, toggle, close, ref } = useDropdown();

    return (
        // Anchor container for the dropdown, attaches ref for click-outside logic
        + <CustomBox ref={ref} className="relative block w-full">
            {/* Trigger wrapper that toggles menu open/close */}
            + <CustomBox onClick={toggle} className="cursor-pointer block w-full overflow-visible">
                {trigger}
            </CustomBox>

            {/* Dropdown panel */}
            {open && (
                <CustomBox
                    className={`absolute z-[9999] w-56 rounded-xl bg-white shadow-lg dark:bg-gray-800 ${className}`}
                >
                    {items.map(({ label, onClick, icon: Icon, disabled }, index) => (
                        <CustomBox key={index}>
                            <CustomBox
                                onClick={
                                    !disabled
                                        ? () => {
                                            onClick();
                                            close();
                                        }
                                        : undefined
                                }
                                className={`w-full flex items-center justify-start gap-6 px-4 py-4 text-sm ${
                                    disabled
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                <span>{label}</span>
                            </CustomBox>

                            {index < items.length - 1 && (
                                <CustomDivider className="mx-0 bg-gray-200 dark:bg-gray-600" />
                            )}
                        </CustomBox>
                    ))}

                </CustomBox>
            )}
        </CustomBox>
    );
}

CustomDropdownWeb.propTypes = {
    trigger: PropTypes.node.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            icon: PropTypes.elementType,
            disabled: PropTypes.bool
        })
    ).isRequired,
    className: PropTypes.string
};
