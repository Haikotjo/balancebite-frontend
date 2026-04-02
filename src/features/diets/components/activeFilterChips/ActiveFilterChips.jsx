import PropTypes from "prop-types";
import { Filter } from "lucide-react";
import DietsFilterChip from "../dietsFilterChip/DietsFilterChip.jsx";
import NutrientRangeChips from "../nutrientRangeChips/NutrientRangeChips.jsx";
import { formatEnum } from "../../../../utils/helpers/formatEnum.js";

const ActiveFilterChips = ({
    filters,
    setFilters,
    creatorIdFilter,
    setCreatorIdFilter,
    creatorName,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
}) => {
    const hasFilters =
        Object.keys(filters).length > 0 || !!creatorIdFilter || sortKey !== null;

    if (!hasFilters) return null;

    const handleClearAll = () => {
        setFilters({});
        setCreatorIdFilter(null);
        setSortKey(null);
    };

    return (
        <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-content-muted">
                <Filter className="h-3.5 w-3.5" />
                Filters
            </span>

            <div className="h-4 w-px bg-border" />

            {/* Clear all */}
            <DietsFilterChip
                label="Clear all"
                variant="danger"
                onRemove={handleClearAll}
            />

            {/* Sort */}
            {sortKey && (
                <DietsFilterChip
                    label={`Sort: ${formatEnum(sortKey)} (${sortOrder})`}
                    variant="amber"
                    onRemove={() => setSortKey(null)}
                />
            )}

            {/* Creator */}
            {creatorIdFilter && creatorName && (
                <DietsFilterChip
                    label={`By: ${creatorName}`}
                    variant="emerald"
                    onRemove={() => setCreatorIdFilter(null)}
                />
            )}

            {/* Sidebar filters */}
            {filters.mealTypes && (
                <DietsFilterChip
                    label={`Type: ${formatEnum(filters.mealTypes)}`}
                    variant="teal"
                    onRemove={() => setFilters(prev => { const u = { ...prev }; delete u.mealTypes; return u; })}
                />
            )}

            {filters.diets && (
                <DietsFilterChip
                    label={`Diet: ${formatEnum(filters.diets)}`}
                    variant="teal"
                    onRemove={() => setFilters(prev => { const u = { ...prev }; delete u.diets; return u; })}
                />
            )}

            {filters.cuisines && (
                <DietsFilterChip
                    label={`Cuisine: ${formatEnum(filters.cuisines)}`}
                    variant="teal"
                    onRemove={() => setFilters(prev => { const u = { ...prev }; delete u.cuisines; return u; })}
                />
            )}

            {/* Nutrient ranges */}
            <NutrientRangeChips filters={filters} setFilters={setFilters} />

            {/* Diet includes/excludes */}
            {filters.requiredDiets?.length > 0 && (
                <DietsFilterChip
                    label={`Includes: ${filters.requiredDiets.join(", ")}`}
                    variant="blue"
                    onRemove={() => setFilters(prev => ({ ...prev, requiredDiets: undefined }))}
                />
            )}

            {filters.excludedDiets?.length > 0 && (
                <DietsFilterChip
                    label={`Excludes: ${filters.excludedDiets.join(", ")}`}
                    variant="amber"
                    onRemove={() => setFilters(prev => ({ ...prev, excludedDiets: undefined }))}
                />
            )}

            {/* Search */}
            {filters.name && (
                <DietsFilterChip
                    label={`Search: ${filters.name}`}
                    variant="blue"
                    onRemove={() => setFilters(prev => { const u = { ...prev }; delete u.name; return u; })}
                />
            )}

            {/* Store */}
            {filters.foodSource && (
                <DietsFilterChip
                    label={`Store: ${filters.foodSource}`}
                    variant="blue"
                    onRemove={() => setFilters(prev => { const u = { ...prev }; delete u.foodSource; return u; })}
                />
            )}
        </div>
    );
};

ActiveFilterChips.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    creatorIdFilter: PropTypes.string,
    setCreatorIdFilter: PropTypes.func.isRequired,
    creatorName: PropTypes.string,
    sortKey: PropTypes.string,
    setSortKey: PropTypes.func.isRequired,
    sortOrder: PropTypes.string.isRequired,
    setSortOrder: PropTypes.func.isRequired,
};

export default ActiveFilterChips;