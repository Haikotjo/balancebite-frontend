// MealCardSection.jsx
import PropTypes from "prop-types";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";

const MealCardSection = ({ title, subtitle, icon, children, className = "", ...props }) => {
    return (
        <CustomBox
            className={`w-full p-4 rounded-2xl bg-cardAccentLight dark:bg-darkBackground border border-black/10 dark:border-white/10 shadow-xl ${className}`}
            {...props}
        >
            <MetricHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                variant="meal"
            />
            <CustomDivider className="mb-8"></CustomDivider>
            <CustomBox className="w-full">
                {children}
            </CustomBox>
        </CustomBox>
    );
};

MealCardSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default MealCardSection;