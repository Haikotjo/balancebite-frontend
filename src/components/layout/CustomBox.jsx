import PropTypes from "prop-types";
import clsx from "clsx";

const CustomBox = ({ children, className = "", ...props }) => {
    return (
        <div className={clsx("box-border", className)} {...props}>
            {children}
        </div>
    );
};

CustomBox.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default CustomBox;
