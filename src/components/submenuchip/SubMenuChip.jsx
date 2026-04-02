import PropTypes from "prop-types";
import clsx from "clsx";

const SubMenuChip = ({ icon: Icon, label, selected = false, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={clsx(
            "flex items-center justify-center gap-1 sm:gap-2 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 select-none",
            "flex-col sm:flex-row",
            selected
                ? "bg-surface text-primary shadow-sm border border-border"
                : "text-content-muted hover:text-content hover:bg-surface/60"
        )}
    >
        <Icon
            className={clsx(
                "shrink-0 transition-colors duration-200 h-5 w-5",
                selected ? "text-primary" : "text-content-muted"
            )}
        />
        {label && (
            <span
                className={clsx(
                    "text-xs sm:text-sm font-medium transition-all duration-200",
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
};

export default SubMenuChip;
