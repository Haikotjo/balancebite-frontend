import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import MetricHeader from "../../../profile/components/metricHeader/MetricHeader.jsx";

const MealCardTabButton = ({ title, subtitle, icon, isActive, onClick }) => {
    return (
        <CustomBox
            onClick={onClick}
            className={`
                transition-all duration-200 rounded-xl border cursor-pointer
                ${isActive
                ? 'bg-primary/10 border-primary shadow-sm'
                : `border-black/5 bg-black/[0.02] 
                       dark:border-white/5 dark:bg-white/[0.02] 
                       hover:bg-primary/10 hover:border-primary/40
                       dark:hover:bg-primary/10 dark:hover:border-primary/40`
            }
            `}
        >
            <MetricHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                variant="meal"
                className="p-1.5"
            />
        </CustomBox>
    );
};

MealCardTabButton.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.elementType,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MealCardTabButton;