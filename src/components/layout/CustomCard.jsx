import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const CustomCard = ({
                        children,
                        className = "",
                        hasBorder = false,   // NEW: user decides
                        isPinned = false,
                        createdByRole,
                    }) => {

    // Default: no border
    let borderClasses = "";

    // Override: pinned card always gets yellow border
    if (isPinned) {
        borderClasses = "border border-yellow-400";
    }

    // Role-based border (only if not pinned)

// } else if (createdByRole === "ADMIN") {
//     borderClass = "border-1 border-[#DD1155]"; // error-kleur

    else if (createdByRole === "CHEF") {
        borderClasses = "border border-[#71f175]";
    }

    // Manual border toggle
    else if (hasBorder) {
        borderClasses = "border border-borderLight dark:border-borderDark";
    }

    return (
        <CustomBox
            className={`
                flex flex-col w-full rounded-xl overflow-hidden 
                shadow-lg bg-cardLight dark:bg-cardDark
                ${borderClasses}
                ${className}
            `}
        >
            {children}
        </CustomBox>
    );
};

CustomCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hasBorder: PropTypes.bool,     // NEW
    isPinned: PropTypes.bool,
    createdByRole: PropTypes.string,
};

export default CustomCard;



