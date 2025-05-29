import PropTypes from "prop-types";
import DietsFilterChip from "../DietsFilterChip.jsx";

const macros = ["Protein", "Carbs", "Fat", "Calories"];

const nutrientKeys = {
    Protein: ["minProtein", "maxProtein"],
    Carbs: ["minCarbs", "maxCarbs"],
    Fat: ["minFat", "maxFat"],
    Calories: ["minCalories", "maxCalories"],
};

const NutrientRangeChips = ({ filters, setFilters }) => {
    const handleRemove = (keysToRemove) => {
        const updated = { ...filters };
        keysToRemove.forEach((key) => delete updated[key]);
        setFilters(updated);
    };

    return (
        <>
            {macros.map((macro) => {
                const [minKey, maxKey] = nutrientKeys[macro];
                const min = filters[minKey];
                const max = filters[maxKey];

                if (min === undefined && max === undefined) return null;

                let label = macro + ": ";
                if (min !== undefined && max !== undefined) {
                    label += `${min} - ${max}`;
                } else if (min !== undefined) {
                    label += `≥ ${min}`;
                } else {
                    label += `≤ ${max}`;
                }

                return (
                    <DietsFilterChip
                        key={macro}
                        label={label}
                        colorClass="chip-purple"
                        onRemove={() => handleRemove([minKey, maxKey])}
                    />
                );
            })}
        </>
    );
};

NutrientRangeChips.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default NutrientRangeChips;