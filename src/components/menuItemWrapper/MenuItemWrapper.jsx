// src/components/navigation/MenuItemWrapper.jsx
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * Reusable menu item component.
 * Supports optional icons, click handlers, and custom children.
 */
const MenuItemWrapper = ({ icon, label, onClick, children, className = "" }) => (
    <CustomBox
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${className}`}
    >
        {icon && <span>{icon}</span>}
        {label && (
            <CustomTypography variant="paragraph" className="text-black dark:text-white">
                {label}
            </CustomTypography>
        )}
        {children}
    </CustomBox>
);

MenuItemWrapper.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default MenuItemWrapper;
