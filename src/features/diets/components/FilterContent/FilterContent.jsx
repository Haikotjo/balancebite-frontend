import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomMultiSelect from "../../../../components/layout/CustomMultiSelect.jsx";
import CustomDualSlider from "../../../../components/layout/CustomRangeSlider.jsx";
import { dietsOptions } from "../../../meals/utils/helpers/dropdownOptionsMealsTypes.js";

const avgFields = [
    { label: "Average daily protein", value: "avgProtein" },
    { label: "Average daily carbohydrates", value: "avgCarbs" },
    { label: "Average daily fat", value: "avgFat" },
    { label: "Average daily calories", value: "avgCalories" },
];

const getMinMaxKeys = (field) => {
    switch (field) {
        case "avgProtein": return ["minProtein", "maxProtein"];
        case "avgCarbs": return ["minCarbs", "maxCarbs"];
        case "avgFat": return ["minFat", "maxFat"];
        case "avgCalories": return ["minCalories", "maxCalories"];
        default: return [`min${field[0].toUpperCase()}${field.slice(1)}`, `max${field[0].toUpperCase()}${field.slice(1)}`];
    }
};

const FilterContent = ({ filters, setFilters }) => {
    return (
        <>
            <CustomBox className="flex flex-wrap justify-center gap-x-12 gap-y-8 mt-4 ml-3 mr-6 max-w-full">
                {avgFields.map(({ label, value }) => {
                    const [minKey, maxKey] = getMinMaxKeys(value);
                    const minValue = filters[minKey] ?? 0;
                    const maxValue = filters[maxKey] ?? (value === "avgCalories" ? 4000 : 300);

                    return (
                        <CustomBox key={value} className="flex-1 min-w-[200px]">
                            <CustomDualSlider
                                label={label}
                                minValue={0}
                                maxValue={value === "avgCalories" ? 4000 : 300}
                                value={[minValue, maxValue]}
                                onChange={([newMin, newMax]) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        [minKey]: newMin,
                                        [maxKey]: newMax,
                                    }))
                                }
                            />
                        </CustomBox>
                    );
                })}
            </CustomBox>

            <CustomBox className="flex gap-4 flex-wrap items-end mt-4 mb-8">
                <CustomBox className="flex flex-col text-sm w-80">
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

                <CustomBox className="flex flex-col text-sm w-80">
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

FilterContent.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default FilterContent;
