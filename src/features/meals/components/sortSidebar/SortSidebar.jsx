import { useState, useContext, useEffect } from "react";
import {
    ArrowDownUp,
    ArrowUpNarrowWide,
    ArrowDownNarrowWide,
} from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import { getNutrients, borderBySortKey } from "../../utils/helpers/nutrientSortConfig.jsx";
import SidebarShell from "../../../../components/sidebarShell/SidebarShell.jsx";

const SAVE_KEYS = ["saveCount", "weeklySaveCount", "monthlySaveCount"];

// Color classes per sortKey for selected rows
const bgBySortKey = {
    calories:         "bg-error/10 border-error/30 text-error",
    protein:          "bg-primary/10 border-primary/30 text-primary",
    carbs:            "bg-success/10 border-success/30 text-success",
    fat:              "bg-secondary/10 border-secondary/30 text-secondary",
    saveCount:        "bg-primary/10 border-primary/30 text-primary",
    weeklySaveCount:  "bg-primary/10 border-primary/30 text-primary",
    monthlySaveCount: "bg-primary/10 border-primary/30 text-primary",
};

const SortSidebar = ({ onSort, open, onToggle, sortBy }) => {
    const { activeOption } = useContext(UserMealsContext);
    const [currentSort, setCurrentSort] = useState({ key: null, order: "asc" });

    // Sync internal state when sortBy is cleared externally (e.g. from ActiveFilterChips)
    useEffect(() => {
        if (!sortBy) {
            setCurrentSort({ key: null, order: "asc" });
        } else if (sortBy.sortKey && sortBy.sortKey !== currentSort.key) {
            setCurrentSort({ key: sortBy.sortKey, order: sortBy.sortOrder ?? "asc" });
        }
    }, [sortBy]);

    const allNutrients = getNutrients("h-4 w-4");
    const macros      = allNutrients.slice(0, 4);
    const popularity  = allNutrients.slice(4);

    const handleSort = (sortKey) => {
        let newOrder = "asc";
        if (SAVE_KEYS.includes(sortKey)) {
            newOrder = "desc";
        } else if (sortKey === "protein" && currentSort.key !== "protein") {
            newOrder = "desc";
        } else if (currentSort.key === sortKey) {
            newOrder = currentSort.order === "asc" ? "desc" : "asc";
        }
        setCurrentSort({ key: sortKey, order: newOrder });
        onSort(sortKey, newOrder);
    };

    const toggleOrder = () => {
        if (!currentSort.key || SAVE_KEYS.includes(currentSort.key)) return;
        const newOrder = currentSort.order === "asc" ? "desc" : "asc";
        setCurrentSort((prev) => ({ ...prev, order: newOrder }));
        onSort(currentSort.key, newOrder);
    };

    const SortRow = ({ nutrient }) => {
        const isSelected = currentSort.key === nutrient.sortKey;
        const isFixed = SAVE_KEYS.includes(nutrient.sortKey);

        return (
            <button
                type="button"
                onClick={() => handleSort(nutrient.sortKey)}
                className={clsx(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150",
                    isSelected
                        ? bgBySortKey[nutrient.sortKey]
                        : "border-border bg-surface-sunken text-content-muted hover:border-border-strong hover:text-content"
                )}
            >
                <span className="shrink-0">{nutrient.icon}</span>
                <span className="flex-1 text-left">{nutrient.label}</span>
                {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold opacity-80">
                        {isFixed ? (
                            <>
                                <ArrowDownNarrowWide className="h-3.5 w-3.5" />
                                High › Low
                            </>
                        ) : currentSort.order === "asc" ? (
                            <>
                                <ArrowUpNarrowWide className="h-3.5 w-3.5" />
                                Low › High
                            </>
                        ) : (
                            <>
                                <ArrowDownNarrowWide className="h-3.5 w-3.5" />
                                High › Low
                            </>
                        )}
                    </span>
                )}
            </button>
        );
    };

    SortRow.propTypes = {
        nutrient: PropTypes.object.isRequired,
    };

    return (
        <SidebarShell open={open} onToggle={onToggle}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                    <ArrowDownUp className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-content">Sort</h2>
                    {currentSort.key && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                            1
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onToggle}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-content-muted transition-colors hover:border-error/60 hover:text-error"
                    aria-label="Close sort"
                >
                    <span className="text-lg leading-none">×</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                {/* Macros */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
                        Nutrients
                    </p>
                    <div className="space-y-2">
                        {macros.map((n) => (
                            <SortRow key={n.sortKey} nutrient={n} />
                        ))}
                    </div>
                </div>

                {/* Direction toggle — only when a non-fixed sort is active */}
                {currentSort.key && !SAVE_KEYS.includes(currentSort.key) && (
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
                            Direction
                        </p>
                        <button
                            type="button"
                            onClick={toggleOrder}
                            className="flex w-full items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-all duration-150 hover:bg-primary/20"
                        >
                            {currentSort.order === "asc" ? (
                                <ArrowUpNarrowWide className="h-4 w-4" />
                            ) : (
                                <ArrowDownNarrowWide className="h-4 w-4" />
                            )}
                            <span className="flex-1 text-left">
                                {currentSort.order === "asc" ? "Low › High" : "High › Low"}
                            </span>
                            <span className="text-xs opacity-60">tap to flip</span>
                        </button>
                    </div>
                )}

                {/* Popularity — hidden for My Meals */}
                {activeOption !== "My Meals" && (
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
                            Popularity
                        </p>
                        <div className="space-y-2">
                            {popularity.map((n) => (
                                <SortRow key={n.sortKey} nutrient={n} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer — clear sort */}
            {currentSort.key && (
                <div className="border-t border-border px-5 py-4">
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentSort({ key: null, order: "asc" });
                            onSort(null, "asc");
                        }}
                        className="w-full rounded-xl border border-error/40 py-2 text-sm font-medium text-error transition-colors hover:bg-error/10"
                    >
                        Clear sort
                    </button>
                </div>
            )}
        </SidebarShell>
    );
};

SortSidebar.propTypes = {
    onSort: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    sortBy: PropTypes.shape({
        sortKey: PropTypes.string,
        sortOrder: PropTypes.string,
    }),
};

export default SortSidebar;