import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import DietsFilterChip from "../dietsFilterChip/DietsFilterChip.jsx";
import NutrientRangeChips from "../nutrientRangeChips/NutrientRangeChips.jsx";

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
    const showClearAll =
        Object.keys(filters).length > 0 ||
        creatorIdFilter ||
        sortKey !== null;


    return (
        showClearAll && (
            <CustomBox className="mb-4 gap-2 flex flex-wrap items-center">
                <CustomTypography variant="paragraph" bold className="mr-1 block sm:hidden">
                    Filters:
                </CustomTypography>

                <CustomTypography variant="paragraph" bold className="mr-2 hidden sm:block">
                    Active filters:
                </CustomTypography>

                <DietsFilterChip
                    label="Clear all"
                    colorClass="chip-red"
                    onRemove={() => {
                        setFilters({});
                        setCreatorIdFilter(null);
                        setSortKey(null);
                        setSortOrder("asc");
                    }}
                />

                {sortKey && (

                    <DietsFilterChip
                        label={`Sort: ${sortKey} (${sortOrder})`}
                        colorClass="chip-yellow"
                        onRemove={() => {
                            setSortKey(null);
                            setSortOrder("asc");
                        }}
                    />
                )}

                {creatorIdFilter && creatorName && (
                    <DietsFilterChip
                        label={creatorName}
                        colorClass="chip-emerald"
                        onRemove={() => setCreatorIdFilter(null)}
                    />
                )}

                <NutrientRangeChips filters={filters} setFilters={setFilters} />

                {filters.requiredDiets?.length > 0 && (
                    <DietsFilterChip
                        label={`Includes: ${filters.requiredDiets.join(", ")}`}
                        colorClass="chip-blue"
                        onRemove={() => setFilters(prev => ({ ...prev, requiredDiets: undefined }))}
                    />
                )}

                {filters.excludedDiets?.length > 0 && (
                    <DietsFilterChip
                        label={`Excludes: ${filters.excludedDiets.join(", ")}`}
                        colorClass="chip-orange"
                        onRemove={() => setFilters(prev => ({ ...prev, excludedDiets: undefined }))}
                    />
                )}
            </CustomBox>
        )
    );
};

ActiveFilterChips.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    creatorIdFilter: PropTypes.string,
    setCreatorIdFilter: PropTypes.func.isRequired,
    creatorName: PropTypes.string,
    sortKey: PropTypes.string.isRequired,
    setSortKey: PropTypes.func.isRequired,
    sortOrder: PropTypes.string.isRequired,
    setSortOrder: PropTypes.func.isRequired,
};

export default ActiveFilterChips;
