import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const CustomCard = ({ children, className = "", isPinned = false }) => {
    const borderClass = isPinned
        ? "border-2 border-yellow-400"
        : "border-borderLight dark:border-borderDark";

    return (
        <CustomBox
            className={`flex flex-col w-full rounded-xl overflow-hidden 
                shadow-lg border ${borderClass}
                bg-cardLight dark:bg-cardDark
                ${className}`}
        >
            {children}
        </CustomBox>
    );
};

CustomCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    isPinned: PropTypes.bool,
};

export default CustomCard;
