// src/components/meal/MealInfoOverlay.jsx

import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { Users, UserPen } from "lucide-react";

/**
 * Displays metadata below the meal image, including creator and user count.
 * Fully styled using CustomBox and CustomTypography for easier migration to React Native.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.meal - Meal data with user and version info.
 * @param {string} [props.fontSize="0.6rem"] - Font size for text elements.
 * @returns {JSX.Element}
 */
const MealInfoOverlay = ({ meal, fontSize = "0.6rem" }) => {
    return (
        <CustomBox
            className="
                absolute bottom-0 left-0 w-full flex justify-between
                bg-[rgba(0,0,0,0.5)] text-white
                px-[10px] py-[5px]
            "
        >
            {/* Creator name and version date */}
            <CustomTypography as="span" className="flex items-center gap-1" style={{ fontSize }}>
                {meal.createdBy?.userName}
                <UserPen size={14} />
                {meal.version && (
                    <CustomTypography as="span" style={{ fontSize }}>
                        {meal.version.slice(0, 10)}
                    </CustomTypography>
                )}
            </CustomTypography>

            {/* Template meal usage count */}
            {meal.isTemplate && (
                <CustomTypography as="span" className="flex items-center gap-1" style={{ fontSize }}>
                    <Users size={14} />
                    {meal.userCount}
                </CustomTypography>
            )}
        </CustomBox>
    );
};

MealInfoOverlay.propTypes = {
    meal: PropTypes.shape({
        createdBy: PropTypes.shape({
            userName: PropTypes.string,
        }),
        userCount: PropTypes.number,
        isTemplate: PropTypes.bool,
        version: PropTypes.string,
    }).isRequired,
    fontSize: PropTypes.string,
};

export default MealInfoOverlay;
