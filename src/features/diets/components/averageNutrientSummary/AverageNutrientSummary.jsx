import PropTypes from "prop-types";
import { Flame, Dumbbell, Wheat, Droplet, Candy } from "lucide-react";

const MACROS = [
    { key: "avgCalories", icon: Flame,                 label: "Kcal",    color: "text-rose-400"    },
    { key: "avgProtein",  icon: Dumbbell,              label: "Protein", color: "text-cyan-500"    },
    { key: "avgCarbs",    icon: Wheat, label: "Carbs",   color: "text-emerald-500" },
    { key: "avgFat",      icon: Droplet,               label: "Fat",     color: "text-fuchsia-500" },
];

const EXTRA_MACROS = [
    { key: "avgSugars", icon: Candy, label: "Sugars", color: "text-pink-400" },
];

const AverageNutrientSummary = ({ diet, dayCount, showDivider = true, isListCard = false }) => {
    if (!diet || diet.avgCalories == null || diet.avgProtein == null ||
        diet.avgFat == null || diet.avgCarbs == null) return null;

    const extraMacros = isListCard ? [] : EXTRA_MACROS.filter(({ key }) => diet[key] != null);

    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-content/40 mb-2">
                Daily averages — {dayCount}-day diet
            </p>

            {/* Main macros */}
            <div className="flex items-stretch rounded-xl border border-content/8 bg-surface-sunken overflow-hidden mb-2">
                {MACROS.map(({ key, icon: Icon, label, color }, i) => (
                    <div key={key} className="flex flex-1 flex-col items-center py-2">
                        {i > 0 && <div className="absolute self-stretch" />}
                        <Icon className={`h-4 w-4 ${color} mb-0.5`} />
                        <span className="text-sm font-bold text-content">{Math.round(diet[key])}</span>
                        <span className="text-[10px] text-content/50">{label}</span>
                    </div>
                ))}
            </div>

            {/* Extra macros (sat fat / unsat fat / sugars) — not in list cards */}
            {extraMacros.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {extraMacros.map(({ key, icon: Icon, label, color }) => (
                        <div
                            key={key}
                            className="flex items-center gap-1.5 rounded-full border border-content/8 bg-surface-sunken px-2.5 py-1"
                        >
                            <Icon className={`h-3 w-3 ${color}`} />
                            <span className="text-[11px] text-content/70">
                                {label}: <span className="font-semibold text-content">{Math.round(diet[key])}</span>g
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {showDivider && <hr className="my-4 border-border/40" />}
        </div>
    );
};

AverageNutrientSummary.propTypes = {
    diet: PropTypes.shape({
        avgCalories: PropTypes.number,
        avgProtein: PropTypes.number,
        avgFat: PropTypes.number,
        avgCarbs: PropTypes.number,
        avgSugars: PropTypes.number,
    }).isRequired,
    dayCount: PropTypes.number.isRequired,
    showDivider: PropTypes.bool,
    isListCard: PropTypes.bool,
};

export default AverageNutrientSummary;
