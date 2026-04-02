import PropTypes from "prop-types";
import { ArrowRight } from "lucide-react";

// Clickable action card used in quick actions section
export default function ActionCard({
                                       icon: Icon,
                                       title,
                                       text,
                                       onClick,
                                       accentClass,
                                       gradient
                                   }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group rounded-3xl border border-content/10
            bg-gradient-to-br ${gradient}
            p-5 text-left shadow-xl backdrop-blur-xl transition duration-300
            hover:-translate-y-1 hover:border-content/20`}
        >
            <div className={`mb-4 inline-flex rounded-2xl border p-3 ${accentClass}`}>
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-content">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-content/65">{text}</p>
                </div>

                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-content/40 transition group-hover:translate-x-1 group-hover:text-content" />
            </div>
        </button>
    );
}

ActionCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    accentClass: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
};