// src/components/meal/PreparationTimeIcon.jsx

import PropTypes from "prop-types";
import { Timer } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * PreparationTimeIcon component displays a timer icon and formatted prep time below it.
 * Used to indicate how long a meal takes to prepare.
 * Tailwind-based styling ensures smooth transition to React Native in the future.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.preparationTime - ISO-8601 duration string (e.g. "PT20M").
 * @param {number} [props.iconSize=30] - Diameter of the icon in pixels.
 * @returns {JSX.Element|null} Rendered component or null if no preparationTime is provided.
 */
const PreparationTimeIcon = ({ preparationTime, iconSize = 30 }) => {
    if (!preparationTime) return null;

    // Shared style for both icon and time label
    const sharedClasses = `
        bg-[rgba(0,0,0,0.5)] rounded-[40%]
        shadow-md text-white flex items-center justify-center
    `;

    return (
        <CustomBox className="flex flex-col items-center gap-[2px]">
            {/* Timer icon box */}
            <CustomBox
                className={`${sharedClasses} w-[40px] h-[40px] p-[6px]`}
            >
                <Timer size={iconSize + 2} color="white" />
            </CustomBox>

            {/* Time string box */}
            <CustomBox
                className={`${sharedClasses} px-[6px] py-[6px] text-center`}
            >
                <span className="text-white text-[0.8rem] font-body">
                    {preparationTime.replace("PT", "").toLowerCase()}
                </span>
            </CustomBox>
        </CustomBox>
    );
};

PreparationTimeIcon.propTypes = {
    preparationTime: PropTypes.string,
    iconSize: PropTypes.number,
};

export default PreparationTimeIcon;
