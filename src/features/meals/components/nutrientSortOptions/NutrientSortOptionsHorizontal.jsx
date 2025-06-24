import { useState } from "react";
import {
    Flame,
    ChartColumnIncreasing,
    Dumbbell,
    Droplet,
    ArrowDownUp,
    ArrowUpNarrowWide,
    ArrowDownNarrowWide,
    TrendingUp,
    ChartNoAxesColumnIncreasing,
    TrendingDown,
} from "lucide-react";
import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomChip from "../../../../components/layout/CustomChip.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { useContext } from "react";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";

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

    // Returns appropriate sort direction icon based on current state
    const getSortIcon = (key) => {
        const iconClass = "w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1";
        if (!key) return <ArrowDownUp className={iconClass} />;
        return currentSort.order === "asc"
            ? <ArrowUpNarrowWide className={iconClass} />
            : <ArrowDownNarrowWide className={iconClass} />;
    };

    // Define the available nutrients and their display info
    const nutrients = [
        { name: "Energy", label: "Kcal", icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1" />, sortKey: "calories" },
        { name: "Protein", label: "Protein", icon: <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1" />, sortKey: "protein" },
        { name: "Carbs", label: "Carbs", icon: <ChartColumnIncreasing className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1" />, sortKey: "carbs" },
        { name: "Fat", label: "Fat", icon: <Droplet className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 m-1" />, sortKey: "fat" },
        { name: "All Time", label: "All Time", icon: <ChartNoAxesColumnIncreasing />,   sortKey: "saveCount" },
        { name: "This Week", label: "This Week", icon: <TrendingUp  />, sortKey: "weeklySaveCount" },
        { name: "This Month", label: "This Month", icon: <TrendingDown />, sortKey: "monthlySaveCount" },
    ];

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
        <CustomBox className="flex flex-col items-center w-full mt-2 gap-2 mb-4 mt-4">
            <CustomBox className="flex flex-wrap justify-center gap-3 w-full max-w-full">

                {nutrients.slice(0, 4).map((nutrient) => (
                    <CustomChip
                        key={nutrient.label}
                        icon={nutrient.icon}
                        label={nutrient.label}
                        selected={currentSort.key === nutrient.sortKey}
                        onClick={() => handleSort(nutrient.sortKey)}
                        labelFontSize="text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem]"
                        labelPosition="bottom"
                    />
                ))}
                <CustomChip
                    icon={getSortIcon(currentSort.key)}
                    label={
                        !currentSort.key
                            ? "Direction"
                            : currentSort.order === "asc"
                                ? "Low > High"
                                : "High > Low"
                    }
                    selected={!!currentSort.key}
                    onClick={handleSortOrderClick}
                    labelFontSize="text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem]"
                    labelPosition="bottom"
                />
            </CustomBox>

            {activeOption !== "My Meals" && (
                <>
                    <CustomBox className="flex items-center gap-6 w-full justify-center flex-wrap mt-1">
                        <CustomBox className="flex flex-wrap justify-center gap-6">
                            {nutrients.slice(4).map((nutrient) => (
                                <CustomChip
                                    key={nutrient.label}
                                    icon={nutrient.icon}
                                    label={nutrient.label}
                                    selected={currentSort.key === nutrient.sortKey}
                                    onClick={() => handleSort(nutrient.sortKey)}
                                    labelFontSize="text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem]"
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
