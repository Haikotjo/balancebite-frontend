import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const CustomCard = ({ children, className = "" }) => {
    return (
        <CustomBox
            className={`flex flex-col w-full rounded-xl overflow-hidden 
                shadow-lg border border-borderLight dark:border-borderDark
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
};

export default CustomCard;
