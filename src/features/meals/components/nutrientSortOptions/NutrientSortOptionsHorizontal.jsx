import { useState, useContext } from "react";
import {
    ArrowDownUp,
    ArrowUpNarrowWide,
    ArrowDownNarrowWide,
} from "lucide-react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomChip from "../../../../components/layout/CustomChip.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import {borderBySortKey, getNutrients} from "../../utils/helpers/nutrientSortConfig.jsx";

/**
 * NutrientSortOptionsHorizontal
 *
 * Displays a horizontal list of nutrient chips used for sorting meals.
 * Each chip represents a macro (Kcal, Protein, Carbs, Fat), and the
 * user can toggle ascending/descending sorting.
 *
 * Icons and layout adjust responsively via Tailwind.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onSort - Callback invoked with (sortKey, order) when sorting is triggered.
 */
const NutrientSortOptionsHorizontal = ({ onSort }) => {
    const { activeOption } = useContext(UserMealsContext);
    const [currentSort, setCurrentSort] = useState({ key: null, order: "asc" });
    const iconBase = "w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1";
    const nutrients = getNutrients(iconBase);

    // Returns appropriate sort direction icon based on current state
    const getSortIcon = (key) => {
        const base = iconBase;

        const unselectedClass = `${base} text-lightText dark:text-darkText`;
        const selectedClass   = `${base} text-lightText dark:text-darkText`;

        const cls = key ? selectedClass : unselectedClass;

        if (!key) {
            return <ArrowDownUp className={cls} />;
        }

        return currentSort.order === "asc"
            ? <ArrowUpNarrowWide className={cls} />
            : <ArrowDownNarrowWide className={cls} />;
    };

    // Called when a nutrient chip is clicked
    const handleSort = (sortKey) => {
        let newOrder = "asc";

        // Force descending order for save-based sorts
        if (["saveCount", "weeklySaveCount", "monthlySaveCount"].includes(sortKey)) {
            newOrder = "desc";
        } else if (sortKey === "protein" && currentSort.key !== "protein") {
            newOrder = "desc";
        } else if (currentSort.key === sortKey) {
            newOrder = currentSort.order === "asc" ? "desc" : "asc";
        }

        setCurrentSort({ key: sortKey, order: newOrder });
        onSort(sortKey, newOrder);
    };

    // Called when the direction toggle chip is clicked
    const handleSortOrderClick = () => {
        if (!currentSort.key) return;

        // Skip toggle if fixed descending
        if (["saveCount", "weeklySaveCount", "monthlySaveCount"].includes(currentSort.key)) return;

        const newOrder = currentSort.order === "asc" ? "desc" : "asc";
        setCurrentSort((prevSort) => ({
            key: prevSort.key,
            order: newOrder,
        }));

        onSort(currentSort.key, newOrder);
    };

    return (
        <CustomBox className="flex flex-col items-center w-full gap-2 mb-4 mt-4">
            <CustomBox className="flex flex-wrap justify-center gap-2 w-full max-w-full">

                {nutrients.slice(0, 4).map((n) => (
                    <CustomChip
                        key={n.sortKey}
                        icon={n.icon}
                        label={n.label}
                        selected={currentSort.key === n.sortKey}
                        selectedBorderClass={borderBySortKey[n.sortKey]}
                        onClick={() => handleSort(n.sortKey)}
                        labelPosition="bottom"
                    />
                ))}
                <CustomChip
                    icon={getSortIcon(currentSort.key)}
                    label={!currentSort.key ? "Direction" : currentSort.order === "asc" ? "Low > High" : "High > Low"}
                    selected={!!currentSort.key}
                    selectedBorderClass={currentSort.key ? borderBySortKey[currentSort.key] : ""}
                    onClick={handleSortOrderClick}
                    labelPosition="bottom"
                />
            </CustomBox>

            {activeOption !== "My Meals" && (
                <>
                    <CustomBox className="flex items-center gap-6 w-full justify-center flex-wrap mt-1">
                        <CustomBox className="flex flex-wrap justify-center gap-6">
                            {nutrients.slice(4).map((n) => (
                                <CustomChip
                                    key={n.sortKey}
                                    icon={n.icon}
                                    label={n.label}
                                    selected={currentSort.key === n.sortKey}
                                    selectedBorderClass={borderBySortKey[n.sortKey]}
                                    onClick={() => handleSort(n.sortKey)}
                                    labelPosition="bottom"
                                />
                            ))}
                        </CustomBox>
                    </CustomBox>
                </>
            )}

        </CustomBox>
    );

};

NutrientSortOptionsHorizontal.propTypes = {
    onSort: PropTypes.func.isRequired,
};

export default NutrientSortOptionsHorizontal;
