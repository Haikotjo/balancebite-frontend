import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Gauge, X } from "lucide-react";

const nutrients = [
    { key: "calories", label: "Calories", max: 2000, unit: "kcal" },
    { key: "protein",  label: "Protein",  max: 150,  unit: "g" },
    { key: "carbs",    label: "Carbs",    max: 150,  unit: "g" },
    { key: "fat",      label: "Fat",      max: 100,  unit: "g" },
];

const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const NutrientRangeSidebar = ({ open, onToggle, filters, setFilters }) => {
    const drawerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                onToggle();
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onToggle]);

    const getMin = (key) => filters[`min${cap(key)}`] ?? 0;
    const getMax = (key, defaultMax) => filters[`max${cap(key)}`] ?? defaultMax;

    const activeCount = nutrients.filter(({ key, max }) =>
        getMin(key) > 0 || getMax(key, max) < max
    ).length;

    const handleMinChange = (key, val, maxVal) => {
        setFilters((prev) => ({ ...prev, [`min${cap(key)}`]: Math.min(val, maxVal) }));
    };

    const handleMaxChange = (key, minVal, val) => {
        setFilters((prev) => ({ ...prev, [`max${cap(key)}`]: Math.max(val, minVal) }));
    };

    const handleClear = () => {
        setFilters((prev) => {
            const updated = { ...prev };
            nutrients.forEach(({ key }) => {
                delete updated[`min${cap(key)}`];
                delete updated[`max${cap(key)}`];
            });
            return updated;
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-[1400] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300",
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={clsx(
                    "fixed right-0 top-0 z-[1500] h-full w-[300px] sm:w-[360px] transform transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col overflow-hidden rounded-l-2xl border-l border-border bg-surface shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Gauge className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold text-content">Nutrients</h2>
                            {activeCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                                    {activeCount}
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onToggle}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-content-muted transition-colors hover:border-error/60 hover:text-error"
                            aria-label="Close nutrient filter"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-7">
                        {nutrients.map(({ key, label, max, unit }) => {
                            const minVal = getMin(key);
                            const maxVal = getMax(key, max);
                            return (
                                <div key={key}>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-content-muted">
                                            {label}
                                        </p>
                                        <span className="text-xs font-medium text-content">
                                            {minVal} – {maxVal} {unit}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 text-[11px] text-content-muted shrink-0">min</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={max}
                                                value={minVal}
                                                onChange={(e) => handleMinChange(key, Number(e.target.value), maxVal)}
                                                className="w-full accent-primary cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 text-[11px] text-content-muted shrink-0">max</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={max}
                                                value={maxVal}
                                                onChange={(e) => handleMaxChange(key, minVal, Number(e.target.value))}
                                                className="w-full accent-primary cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    {activeCount > 0 && (
                        <div className="border-t border-border px-5 py-4">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="w-full rounded-xl border border-error/40 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
                            >
                                Clear {activeCount} filter{activeCount !== 1 ? "s" : ""}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

NutrientRangeSidebar.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default NutrientRangeSidebar;
