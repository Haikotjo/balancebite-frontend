// src/features/meals/components/mealCardSection/MealCardSection.jsx
import PropTypes from "prop-types";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

const MealCardSection = ({ title, subtitle, icon, children, className = "", onClick, onHeaderClick, ...props }) => {
    return (
        <CustomBox
            className={`w-full p-4 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 dark:border-white/10 shadow-xl transition-all ${
                onClick ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" : ""
            } ${className}`}
            onClick={onClick}
            {...props}
        >
            <CustomBox
                onClick={onHeaderClick}
                className={onHeaderClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
            >
                <MetricHeader
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    variant="meal"
                />
            </CustomBox>
            {children && (
                <>
                    <CustomDivider className="mb-8" />
                    <CustomBox className="w-full">
                        {children}
                    </CustomBox>
                </>
            )}
        </CustomBox>
    );
};

MealCardSection.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default MealCardSection;