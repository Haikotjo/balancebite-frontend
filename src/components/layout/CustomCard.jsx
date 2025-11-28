import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const CustomCard = ({ children, className = "", isPinned = false, createdByRole }) => {
    let borderClass = "border-borderLight dark:border-borderDark";

    if (isPinned) {
        borderClass = "border-1 border-yellow-400";
    // } else if (createdByRole === "ADMIN") {
    //     borderClass = "border-1 border-[#DD1155]"; // error-kleur
    } else if (createdByRole === "CHEF") {
        borderClass = "border-1 border-[#71f175]"; // success-kleur
    }

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
    createdByRole: PropTypes.string,
};


export default CustomCard;
