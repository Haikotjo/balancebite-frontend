import PropTypes from "prop-types";
import { Sparkles, Flame, Dumbbell, ChartColumnIncreasing, Droplet } from "lucide-react";
import {chipBaseClass} from "../../utils/constants/homeStyles.js";
import {getMealImage} from "../../utils/helpers/imageHelpers.js";

// Large featured meal card with macro overview
export default function FeaturedMealCard({ meal, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative min-w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900 text-left shadow-2xl"
        >
            <div className="absolute inset-0">
                <img
                    src={getMealImage(meal)}
                    alt={meal?.name || meal?.title || "Meal"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="relative flex h-[420px] flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className={chipBaseClass}>
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured meal
                    </span>

                    {meal?.publicVisible && (
                        <span className={chipBaseClass}>Public</span>
                    )}
                </div>

                <h3 className="text-xl font-semibold text-white line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {meal?.name || meal?.title || "Untitled meal"}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/80">

                    <MacroItem
                        icon={Flame}
                        label="kcal"
                        value={meal?.totalCalories}
                        color="text-error"
                    />

                    <MacroItem
                        icon={Dumbbell}
                        label="protein"
                        value={meal?.totalProtein}
                        color="text-cyan-400"
                    />

                    <MacroItem
                        icon={ChartColumnIncreasing}
                        label="carbs"
                        value={meal?.totalCarbs}
                        color="text-emerald-400"
                    />

                    <MacroItem
                        icon={Droplet}
                        label="fat"
                        value={meal?.totalFat}
                        color="text-fuchsia-400"
                    />

                </div>
            </div>
        </button>
    );
}

// Small reusable macro stat item
function MacroItem({ icon: Icon, label, value, color }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <Icon className={`h-6 w-6 ${color}`} />
            <div>
                <p className="text-white text-xs">{label}</p>
                <p className="font-semibold text-white">
                    {value !== undefined ? Math.round(value) : "-"}
                </p>
            </div>
        </div>
    );
}

FeaturedMealCard.propTypes = {
    meal: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        publicVisible: PropTypes.bool,
        totalCalories: PropTypes.number,
        totalProtein: PropTypes.number,
        totalCarbs: PropTypes.number,
        totalFat: PropTypes.number,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

MacroItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    color: PropTypes.string.isRequired,
};