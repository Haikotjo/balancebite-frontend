import PropTypes from "prop-types";

export default function SidebarButton({ icon: Icon, label, badge, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-content transition-colors hover:border-primary/40 hover:text-primary"
        >
            <Icon className="h-4 w-4" />
            {label}
            {badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {badge}
                </span>
            )}
        </button>
    );
}

SidebarButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.number,
    onClick: PropTypes.func.isRequired,
};
