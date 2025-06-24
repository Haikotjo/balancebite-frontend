import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDualSlider from "../../../../components/layout/CustomRangeSlider.jsx";

const mealFields = [
    { label: "Calories", value: "calories", max: 2000 },
    { label: "Protein", value: "protein", max: 150 },
    { label: "Carbohydrates", value: "carbs", max: 150 },
    { label: "Fat", value: "fat", max: 100 },
];

const getMinMaxKeys = (field) => {
    const capitalized = field[0].toUpperCase() + field.slice(1);
    return [`min${capitalized}`, `max${capitalized}`];
};

const MealFilterContent = ({ filters, setFilters }) => {
    return (
        <CustomBox className="flex flex-wrap justify-center gap-x-12 gap-y-8 mt-4 ml-3 mr-6 max-w-full">
            {mealFields.map(({ label, value, max }) => {
                const [minKey, maxKey] = getMinMaxKeys(value);
                const minValue = filters[minKey] ?? 0;
                const maxValue = filters[maxKey] ?? max;

                return (
                    <CustomBox key={value} className="flex-1 min-w-[200px]">
                        <CustomDualSlider
                            label={label}
                            minValue={0}
                            maxValue={max}
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
    );
};

MealFilterContent.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default MealFilterContent;
