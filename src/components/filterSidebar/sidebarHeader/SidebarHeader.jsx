import PropTypes from "prop-types";
import { X, SlidersHorizontal } from "lucide-react";

const SidebarHeader = ({ onClose, activeCount }) => (
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-content">Filters</h2>
            {activeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                    {activeCount}
                </span>
            )}
        </div>
        <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-content-muted transition-colors hover:border-error/60 hover:text-error"
            aria-label="Close filters"
        >
            <X className="h-4 w-4" />
        </button>
    </div>
);

SidebarHeader.propTypes = {
    onClose: PropTypes.func.isRequired,
    activeCount: PropTypes.number,
};

export default SidebarHeader;
