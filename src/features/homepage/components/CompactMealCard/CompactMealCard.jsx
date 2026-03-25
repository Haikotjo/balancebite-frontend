import PropTypes from "prop-types";
import { Flame, Dumbbell, Wallet } from "lucide-react";
import {getMealImage} from "../../utils/helpers/imageHelpers.js";
import {chipBaseClass} from "../../utils/constants/homeStyles.js";
import {formatPrice} from "../../../meals/utils/helpers/formatPrice.js";

// Compact meal card for horizontal lists
export default function CompactMealCard({ meal, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group min-w-[280px] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] text-left shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1"
        >
            <div className="relative h-44 overflow-hidden">
                <img
                    src={getMealImage(meal)}
                    alt={meal?.name || "Meal"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"/>

                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {meal?.diets?.length > 0 && (
                        <span className={chipBaseClass}>{meal.diets[0]}</span>
                    )}
                    {meal?.cuisines?.length > 0 && (
                        <span className={chipBaseClass}>{meal.cuisines[0]}</span>
                    )}
                </div>
            </div>

            <div className="mt-4 px-2 grid grid-cols-3 gap-2 text-xs">

                <StatItem icon={Flame} value={meal?.totalCalories} color="text-error" />

                <StatItem icon={Dumbbell} value={meal?.totalProtein} color="text-cyan-400" />

                <StatItem
                    icon={Wallet}
                    value={meal?.mealPrice}
                    formatter={formatPrice}
                    color="text-price"
                />

            </div>
        </button>
    );
}

// Small stat block
function StatItem({ icon: Icon, value, color, formatter }) {
    const displayValue =
        value !== undefined && value !== null
            ? formatter
                ? formatter(value)
                : Math.round(value)
            : "-";

    return (
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/20 px-2 py-3 text-white/80">
            <Icon className={`h-4 w-4 ${color}`} />
            <p className="font-semibold text-white">{displayValue}</p>
        </div>
    );
}

CompactMealCard.propTypes = {
    meal: PropTypes.shape({
        name: PropTypes.string,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        diets: PropTypes.arrayOf(PropTypes.string),
        cuisines: PropTypes.arrayOf(PropTypes.string),
        totalCalories: PropTypes.number,
        totalProtein: PropTypes.number,
        mealPrice: PropTypes.number,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

StatItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    value: PropTypes.number,
    color: PropTypes.string.isRequired,
    formatter: PropTypes.func,
};