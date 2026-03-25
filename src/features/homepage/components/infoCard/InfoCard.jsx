import PropTypes from "prop-types";

// Small informational card with icon and text
export default function InfoCard({ icon: Icon, title, text, accentClass, gradient }) {
    return (
        <div className={`rounded-[32px] border border-white/10 bg-gradient-to-br ${gradient} p-6 shadow-2xl backdrop-blur-xl`}>
            <div className={`mb-4 inline-flex rounded-2xl border p-3 ${accentClass}`}>
                <Icon className="h-5 w-5"/>
            </div>

            <h3 className="text-xl font-semibold text-white">{title}</h3>

            <p className="mt-3 text-sm leading-6 text-white/70">
                {text}
            </p>
        </div>
    );
}

InfoCard.propTypes = {
    icon: PropTypes.elementType.isRequired, // Icon component
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    accentClass: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
};