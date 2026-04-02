import PropTypes from "prop-types";
import clsx from "clsx";

const SubMenuChip = ({ icon: Icon, label, selected = false, onClick, isFirst = false, isLast = false }) => (
    <button
        type="button"
        onClick={onClick}
        className={clsx(
            "flex items-center justify-center gap-1 sm:gap-2 md:gap-3",
            "px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3",
            "transition-all duration-200 select-none",
            "flex-col sm:flex-row",
            isFirst && "rounded-l-2xl",
            isLast && "rounded-r-2xl",
            selected
                ? "bg-surface text-primary shadow-sm ring-2 ring-inset ring-primary"
                : "text-content-muted hover:text-content hover:bg-surface/60"
        )}
    >
        <Icon
            className={clsx(
                "shrink-0 transition-colors duration-200 h-5 w-5 md:h-6 md:w-6",
                selected ? "text-primary" : "text-content-muted"
            )}
        />
        {label && (
            <span
                className={clsx(
                    "text-xs sm:text-sm md:text-base font-medium transition-all duration-200",
                    selected ? "block" : "hidden sm:inline"
                )}
            >
                {label}
            </span>
        )}
    </button>
);

SubMenuChip.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
};

export default SubMenuChip;
