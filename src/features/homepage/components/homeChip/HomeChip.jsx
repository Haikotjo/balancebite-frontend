import PropTypes from "prop-types";
import { chipBaseClass } from "../../utils/constants/homeStyles.js";

export default function HomeChip({ icon: Icon, iconClassName, className, children }) {
    return (
        <span className={`${chipBaseClass} ${className ?? ""}`}>
            {Icon && <Icon className={`h-3.5 w-3.5 ${iconClassName ?? ""}`} />}
            {children}
        </span>
    );
}

HomeChip.propTypes = {
    icon: PropTypes.elementType,
    iconClassName: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};
