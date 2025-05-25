import PropTypes from "prop-types";
import { useState } from "react";
import CustomBox from "../../../../components/layout/CustomBox.jsx";

const sortOptions = [
    { label: "Protein (avg)", field: "avgProtein" },
    { label: "Carbs (avg)", field: "avgCarbs" },
    { label: "Fat (avg)", field: "avgFat" },
    { label: "Calories (avg)", field: "avgCalories" },
    { label: "Protein (total)", field: "totalProtein" },
    { label: "Carbs (total)", field: "totalCarbs" },
    { label: "Fat (total)", field: "totalFat" },
    { label: "Calories (total)", field: "totalCalories" },
];

const avgFields = ["avgProtein", "avgCarbs", "avgFat", "avgCalories"];

const SortControls = ({
                          sortKey,
                          sortOrder,
                          onSortChange,
                          filters,
                          setFilters,
                      }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleSort = (field) => {
        const isSameField = sortKey === field;
        const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";
        onSortChange(field, newOrder);
    };

    const handleLocalChange = (field, bound, value) => {
        const backendField =
            (field === "avgProtein" && "Protein") ||
            (field === "avgCarbs" && "Carbs") ||
            (field === "avgFat" && "Fat") ||
            (field === "avgCalories" && "Calories");

        if (!backendField) return;

        setLocalFilters((prev) => ({
            ...prev,
            [`${bound.toLowerCase()}${backendField}`]: value === "" ? undefined : Number(value),
        }));
    };

    const applyFilters = () => {
        const cleaned = Object.fromEntries(
            Object.entries(localFilters).filter(([_, v]) => v !== undefined && v !== null && v !== "")
        );
        setFilters(cleaned);
    };


    return (
        <>
            <CustomBox className="flex gap-2 mb-4 flex-wrap">
                {sortOptions.map(({ label, field }) => (
                    <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`px-3 py-1 border rounded ${
                            sortKey === field ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    >
                        {label} {sortKey === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </button>
                ))}
            </CustomBox>

            <CustomBox className="flex gap-4 flex-wrap items-end mb-4">
                {avgFields.map((field) => (
                    <CustomBox key={field} className="flex flex-col text-sm">
                        <label className="font-semibold">{field.replace("avg", "")} range</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={
                                    localFilters[`min${
                                        field.replace("avg", "")
                                    }`] ?? ""
                                }
                                onChange={(e) =>
                                    handleLocalChange(field, "Min", e.target.value)
                                }
                                className="border px-2 py-1 rounded w-20"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={
                                    localFilters[`max${
                                        field.replace("avg", "")
                                    }`] ?? ""
                                }
                                onChange={(e) =>
                                    handleLocalChange(field, "Max", e.target.value)
                                }
                                className="border px-2 py-1 rounded w-20"
                            />
                        </div>
                    </CustomBox>
                ))}

                <button
                    onClick={applyFilters}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Apply Filters
                </button>
            </CustomBox>
        </>
    );
};

SortControls.propTypes = {
    sortKey: PropTypes.string.isRequired,
    sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
    onSortChange: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default SortControls;
