import PropTypes from "prop-types";
import { Pin } from "lucide-react";
import {getDietImage, getMealImage} from "../../utils/helpers/imageHelpers.js";
import HomeChip from "../homeChip/HomeChip.jsx";


// Card for pinned / promoted items (meal or diet)
export default function StickySpotlightCard({ item, onClick }) {
    const isMeal = item?.type === "MEAL";
    const reference = item?.reference;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group overflow-hidden rounded-[28px] border border-content/10 bg-surface text-left shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={
                        isMeal
                            ? getMealImage(reference)
                            : getDietImage(reference?.id || 0)
                    }
                    alt={reference?.name || reference?.title || "Pinned item"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>

                <div className="absolute left-4 top-4">
                    <HomeChip icon={Pin} iconClassName="text-amber-400" className="!border-white !text-white">
                        Featured
                    </HomeChip>
                </div>
            </div>

            <div className="p-5">
                <h3 className="line-clamp-1 text-lg font-semibold text-content">
                    {reference?.name || reference?.title || "Pinned item"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-content/65 line-clamp-2">
                    {isMeal
                        ? reference?.mealDescription ||
                        "Quick access to one of your saved meals."
                        : reference?.description ||
                        "Fast access to a saved plan you want to revisit."}
                </p>
            </div>
        </button>
    );
}

StickySpotlightCard.propTypes = {
    item: PropTypes.shape({
        type: PropTypes.oneOf(["MEAL", "DIET_PLAN"]).isRequired,
        promoted: PropTypes.bool,
        reference: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            title: PropTypes.string,
            mealDescription: PropTypes.string,
            description: PropTypes.string,
            imageUrls: PropTypes.arrayOf(PropTypes.string),
        }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};