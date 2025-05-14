import PropTypes from "prop-types";
import { Timer } from "lucide-react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

/**
 * Compact PreparationTimeIcon with timer icon and time label in one responsive badge.
 */
const PreparationTimeIcon = ({ preparationTime, iconSize = 16 }) => {
    if (!preparationTime) return null;

    return (
        <CustomBox
            className="h-8 sm:h-7 min-w-fit px-2 bg-[rgba(0,0,0,0.5)] rounded-xl flex items-center gap-1 text-white text-[0.75rem]"
        >
            <Timer size={iconSize} className="text-white" />
            <span className="leading-none">
                {preparationTime.replace("PT", "").toLowerCase()}
            </span>
        </CustomBox>
    );
};

PreparationTimeIcon.propTypes = {
    preparationTime: PropTypes.string,
    iconSize: PropTypes.number,
};

export default PreparationTimeIcon;
