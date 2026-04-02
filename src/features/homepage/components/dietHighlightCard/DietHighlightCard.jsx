import PropTypes from "prop-types";
import { CalendarDays, ChefHat, Flame } from "lucide-react";
import {getDietImage} from "../../utils/helpers/imageHelpers.js";
import HomeChip from "../homeChip/HomeChip.jsx";

// Highlight card for diet plans
export default function DietHighlightCard({ diet, index, onClick }) {
    const mealCount = diet?.dietDays?.reduce(
        (acc, day) => acc + (day.meals?.length || 0),
        0
    );

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative min-w-[320px] overflow-hidden rounded-[28px] border border-content/10 text-left shadow-2xl"
        >
            <div className="absolute inset-0">
                <img
                    src={getDietImage(index)}
                    alt={diet?.name || "Diet plan"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
            </div>

            <div className="relative flex h-[340px] flex-col justify-between p-5">
                <div className="flex items-center justify-between">
                    <HomeChip icon={CalendarDays}>Diet plan</HomeChip>
                    {diet?.publicVisible && <HomeChip>Public</HomeChip>}
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-white">
                        {diet?.name || "Untitled diet"}
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-white/70 line-clamp-3">
                        {diet?.dietDescription ||
                            "Structured nutrition plan with meals, budget awareness and daily guidance."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-white/85">

                        <StatBlock
                            label="Days"
                            value={diet?.dietDays?.length}
                            icon={CalendarDays}
                            color="text-cyan-400"
                        />

                        <StatBlock
                            label="Meals"
                            value={mealCount}
                            icon={ChefHat}
                            color="text-emerald-400"
                        />

                        <StatBlock
                            label="Avg kcal"
                            value={diet?.avgCalories}
                            icon={Flame}
                            color="text-error"
                            round
                        />

                    </div>
                </div>
            </div>
        </button>
    );
}

// Small stat block
function StatBlock({ label, value, icon: Icon, color, round = false }) {
    const displayValue =
        value !== undefined && value !== null
            ? round
                ? Math.round(value)
                : value
            : "-";

    return (
        <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex flex-col justify-center">
                <p className="text-white/50 text-xs">{label}</p>
                <p className="font-semibold text-white">{displayValue}</p>
            </div>
            <Icon className={`h-6 w-6 ${color} shrink-0`} />
        </div>
    );
}

DietHighlightCard.propTypes = {
    diet: PropTypes.shape({
        name: PropTypes.string,
        dietDescription: PropTypes.string,
        publicVisible: PropTypes.bool,
        avgCalories: PropTypes.number,
        dietDays: PropTypes.arrayOf(
            PropTypes.shape({
                meals: PropTypes.array,
            })
        ),
    }).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

StatBlock.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    round: PropTypes.bool,
};