import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Store, X } from "lucide-react";
import { getMappedFoodSources } from "../../../../services/apiService.js";
import SidebarShell from "../../../../components/sidebarShell/SidebarShell.jsx";

const StoreSidebar = ({ open, onToggle, filters, setFilters }) => {
    const [sources, setSources] = useState([]);

    useEffect(() => {
        if (!open || sources.length > 0) return;
        getMappedFoodSources()
            .then(setSources)
            .catch(() => {});
    }, [open]);

    const selected = filters.foodSource ?? null;

    const handleClick = (value) => {
        setFilters((prev) => {
            const updated = { ...prev };
            if (updated.foodSource === value) delete updated.foodSource;
            else updated.foodSource = value;
            return updated;
        });
    };

    const handleClear = () => {
        setFilters((prev) => {
            const updated = { ...prev };
            delete updated.foodSource;
            return updated;
        });
    };

    return (
        <SidebarShell open={open} onToggle={onToggle}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-content">Store</h2>
                    {selected && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                            1
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-content-muted transition-colors hover:border-error/60 hover:text-error"
                    aria-label="Close store filter"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
                    Select a store
                </p>
                <div className="flex flex-wrap gap-2">
                    {sources.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleClick(value)}
                            className={clsx(
                                "rounded-full px-3 py-1 text-sm transition-all duration-150",
                                selected === value
                                    ? "border-2 border-primary bg-primary/10 font-semibold text-primary scale-[1.05]"
                                    : "border border-border bg-surface-sunken text-content-muted hover:border-primary/40 hover:text-content"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            {selected && (
                <div className="border-t border-border px-5 py-4">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full rounded-xl border border-error/40 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
                    >
                        Clear store filter
                    </button>
                </div>
            )}
        </SidebarShell>
    );
};

StoreSidebar.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default StoreSidebar;
