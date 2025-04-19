import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox";
import { useDropdown } from "../../hooks/useDropdown.js";

export default function CustomDropdownWeb({ trigger, items = [], className = "" }) {
    const { open, toggle, close, ref } = useDropdown();

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={toggle} className="cursor-pointer">
                {trigger}
            </div>

            {open && (
                <CustomBox
                    className={`absolute z-50 w-56 rounded-xl bg-white shadow-lg dark:bg-gray-800 ${className}
`}
                >
                    {items.map(({ label, onClick, icon: Icon, disabled }, index) => (
                        <div
                            key={index}
                            onClick={!disabled ? () => { onClick(); close(); } : undefined}
                            className={`flex items-center px-4 py-2 text-sm gap-2 ${
                                disabled
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            }`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {label}
                        </div>
                    ))}
                </CustomBox>
            )}
        </div>
    );
}

CustomDropdownWeb.propTypes = {
    trigger: PropTypes.node.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            icon: PropTypes.elementType,
            disabled: PropTypes.bool,
        })
    ).isRequired,
    className: PropTypes.string,
};

