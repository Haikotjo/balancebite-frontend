import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const NutritionProgressBar = ({ remainingValue, remainingPercentage }) => {
    const barColorPositive = "#38adb5";
    const barColorNegative = "#F43F5E";

    return (
        <CustomBox className="relative h-2 mt-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Center divider line */}
            <CustomBox className="absolute left-1/2 top-0 h-full w-px bg-gray-400 z-10 opacity-50" />

            {/* Positive bar (progressing to the right) */}
            {remainingValue > 0 && (
                <CustomBox
                    className="absolute left-1/2 top-0 h-full rounded-r"
                    style={{
                        width: Math.min(remainingPercentage, 100) / 2 + "%",
                        backgroundColor: barColorPositive,
                        transition: "width 0.3s ease"
                    }}
                />
            )}

            {/* Negative bar (progressing to the left) */}
            {remainingValue < 0 && (
                <CustomBox
                    className="absolute right-1/2 top-0 h-full rounded-l"
                    style={{
                        width: Math.min(Math.abs(remainingPercentage), 100) / 2 + "%",
                        backgroundColor: barColorNegative,
                        transition: "width 0.3s ease"
                    }}
                />
            )}
        </CustomBox>
    );
};

NutritionProgressBar.propTypes = {
    remainingValue: PropTypes.number.isRequired,
    remainingPercentage: PropTypes.number.isRequired,
};

export default NutritionProgressBar;