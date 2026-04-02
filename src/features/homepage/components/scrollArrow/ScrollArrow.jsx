import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollArrow({ direction, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`absolute ${direction === "left" ? "left-0" : "right-0"} top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur hover:bg-black/60`}
        >
            {direction === "left"
                ? <ChevronLeft className="h-5 w-5 text-white" />
                : <ChevronRight className="h-5 w-5 text-white" />
            }
        </button>
    );
}

ScrollArrow.propTypes = {
    direction: PropTypes.oneOf(["left", "right"]).isRequired,
    onClick: PropTypes.func.isRequired,
};
