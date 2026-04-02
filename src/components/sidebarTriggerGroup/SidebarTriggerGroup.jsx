import PropTypes from "prop-types";
import { SlidersHorizontal, ArrowDownUp, Gauge, Store } from "lucide-react";

export default function SidebarTriggerGroup({
    filterOpen, onFilterToggle, filterCount,
    nutrientOpen, onNutrientToggle, nutrientCount,
    sortOpen, onSortToggle, sortActive,
    storeOpen, onStoreToggle, storeActive,
}) {
    if (filterOpen || sortOpen || nutrientOpen || storeOpen) return null;

    return (
        <div className="fixed right-0 top-1/3 z-[1500] flex flex-col divide-y divide-border overflow-hidden rounded-l-xl border border-r-0 border-border bg-surface/80 shadow-lg backdrop-blur-sm">
            <TriggerButton icon={SlidersHorizontal} onClick={onFilterToggle} badge={filterCount} aria-label="Open filters" />
            <TriggerButton icon={Gauge} onClick={onNutrientToggle} badge={nutrientCount} aria-label="Open nutrient filter" />
            <TriggerButton icon={Store} onClick={onStoreToggle} badge={storeActive ? 1 : 0} aria-label="Open store filter" />
            <TriggerButton icon={ArrowDownUp} onClick={onSortToggle} badge={sortActive ? 1 : 0} aria-label="Open sort" />
        </div>
    );
}

function TriggerButton({ icon: Icon, onClick, badge, ...rest }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-1 px-2.5 py-3 text-content transition-colors hover:bg-surface hover:text-primary"
            {...rest}
        >
            <Icon className="h-5 w-5" />
            {badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white px-1">
                    {badge}
                </span>
            )}
        </button>
    );
}

TriggerButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    onClick: PropTypes.func.isRequired,
    badge: PropTypes.number,
};

SidebarTriggerGroup.propTypes = {
    filterOpen: PropTypes.bool.isRequired,
    onFilterToggle: PropTypes.func.isRequired,
    filterCount: PropTypes.number.isRequired,
    nutrientOpen: PropTypes.bool.isRequired,
    onNutrientToggle: PropTypes.func.isRequired,
    nutrientCount: PropTypes.number.isRequired,
    sortOpen: PropTypes.bool.isRequired,
    onSortToggle: PropTypes.func.isRequired,
    sortActive: PropTypes.bool.isRequired,
    storeOpen: PropTypes.bool.isRequired,
    onStoreToggle: PropTypes.func.isRequired,
    storeActive: PropTypes.bool.isRequired,
};
