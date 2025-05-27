import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import { dietsOptions } from "../../../meals/utils/helpers/dropdownOptionsMealsTypes.js";
import CustomMultiSelect from "../../../../components/layout/CustomMultiSelect.jsx";
import CustomChip from "../../../../components/layout/CustomChip.jsx";
import { ChevronUp, ChevronDown } from "lucide-react";
import CustomDualSlider from "../../../../components/layout/CustomRangeSlider.jsx";
import CustomFloatingSelect from "../../../../components/layout/CustomFloatingSelect.jsx";
import { useState, useEffect } from "react";

const sortOptions = [
    { label: "Protein (avg)", field: "avgProtein" },
    { label: "Carbs (avg)", field: "avgCarbs" },
    { label: "Fat (avg)", field: "avgFat" },
    { label: "Calories (avg)", field: "avgCalories" },
];

const avgFields = [
    { label: "Protein (avg)", value: "avgProtein" },
    { label: "Carbs (avg)", value: "avgCarbs" },
    { label: "Fat (avg)", value: "avgFat" },
    { label: "Calories (avg)", value: "avgCalories" },
];

const getMinMaxKeys = (field) => {
    switch (field) {
        case "avgProtein":
            return ["minProtein", "maxProtein"];
        case "avgCarbs":
            return ["minCarbs", "maxCarbs"];
        case "avgFat":
            return ["minFat", "maxFat"];
        case "avgCalories":
            return ["minCalories", "maxCalories"];
        default:
            return [`min${field[0].toUpperCase()}${field.slice(1)}`, `max${field[0].toUpperCase()}${field.slice(1)}`];
    }
};

const SortControls = ({ sortKey, sortOrder, onSortChange, filters, setFilters }) => {
    const [selectedField, setSelectedField] = useState(null);

    const handleSort = (field) => {
        const isSameField = sortKey === field;
        const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";
        onSortChange(field, newOrder);
    };

    // Alleen min/max filters behouden voor gekozen veld (reset bij veld wisselen)
    useEffect(() => {
        if (!selectedField) return;
        const [keepMin, keepMax] = getMinMaxKeys(selectedField.value);
        setFilters((prev) => {
            return Object.fromEntries(
                Object.entries(prev).filter(
                    ([k]) =>
                        k === keepMin ||
                        k === keepMax ||
                        (!k.startsWith("min") && !k.startsWith("max"))
                )
            );
        });
        // eslint-disable-next-line
    }, [selectedField]);

    // Huidige min/max van geselecteerde veld (valt terug op 0/300 of 0/2000 voor calories)
    const selectedMinMax = selectedField ? getMinMaxKeys(selectedField.value) : [];
    const currentMin = selectedMinMax[0] ? filters[selectedMinMax[0]] ?? 0 : 0;
    const currentMax = selectedMinMax[1]
        ? filters[selectedMinMax[1]] ??
        (selectedField && selectedField.value === "avgCalories" ? 2000 : 300)
        : 300;

    return (
        <>
            <CustomBox className="flex gap-2 mb-4 flex-wrap">
                {sortOptions.map(({ label, field }) => {
                    const isSelected = sortKey === field;
                    const arrowIcon = isSelected
                        ? sortOrder === "asc"
                            ? <ChevronUp size={14} className="ml-1" />
                            : <ChevronDown size={14} className="ml-1" />
                        : null;

                    return (
                        <CustomChip
                            key={field}
                            selected={isSelected}
                            onClick={() => handleSort(field)}
                            iconMargin={0}
                            iconSize={0}
                            className="w-auto px-3 py-1 flex-row"
                            icon={<CustomBox className="flex items-center"><span className="text-sm">{label}</span>{arrowIcon}</CustomBox>}
                        />
                    );
                })}
            </CustomBox>
            {/*<CustomBox className="flex flex-col text-sm w-full max-w-xs mt-4">*/}
            {/*    <label className="mb-1 font-medium">Carbs (avg) los instellen</label>*/}
            {/*    <CustomDualSlider*/}
            {/*        label="Carbs (avg) los"*/}
            {/*        minValue={0}*/}
            {/*        maxValue={300}*/}
            {/*        value={[*/}
            {/*            filters.minCarbs ?? 0,*/}
            {/*            filters.maxCarbs ?? 300,*/}
            {/*        ]}*/}
            {/*        onChange={([newMin, newMax]) => {*/}
            {/*            setFilters((prev) => ({*/}
            {/*                ...prev,*/}
            {/*                minCarbs: newMin,*/}
            {/*                maxCarbs: newMax,*/}
            {/*            }));*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</CustomBox>*/}

            <CustomBox className="flex gap-4 flex-wrap items-end mb-4">
                <CustomBox className="flex flex-col text-sm w-full max-w-xs">
                    <CustomFloatingSelect
                        label="Select Range Field"
                        value={selectedField}
                        onChange={setSelectedField}
                        options={avgFields}
                    />

                    {selectedField && (
                        <CustomDualSlider
                            label={`${selectedField.label} range`}
                            minValue={0}
                            maxValue={selectedField.value === "avgCalories" ? 2000 : 300}
                            value={[currentMin, currentMax]}
                            onChange={([newMin, newMax]) => {
                                const [minKey, maxKey] = getMinMaxKeys(selectedField.value);
                                setFilters((prev) => ({
                                    ...prev,
                                    [minKey]: newMin,
                                    [maxKey]: newMax,
                                }));
                            }}
                        />
                    )}
                </CustomBox>

                <CustomBox className="flex flex-col text-sm w-52">
                    <CustomMultiSelect
                        label="All meals must contain"
                        placeholder="e.g. High Protein + Gluten Free"
                        options={dietsOptions}
                        value={filters.requiredDiets || []}
                        onChange={(newValues) =>
                            setFilters((prev) => ({
                                ...prev,
                                requiredDiets: newValues.length > 0 ? newValues : undefined,
                            }))
                        }
                    />
                </CustomBox>

                <CustomBox className="flex flex-col text-sm w-52">
                    <CustomMultiSelect
                        label="No meals can contain"
                        placeholder="e.g. Nut Free + Vegan"
                        options={dietsOptions}
                        value={filters.excludedDiets || []}
                        onChange={(newValues) =>
                            setFilters((prev) => ({
                                ...prev,
                                excludedDiets: newValues.length > 0 ? newValues : undefined,
                            }))
                        }
                    />
                </CustomBox>
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
