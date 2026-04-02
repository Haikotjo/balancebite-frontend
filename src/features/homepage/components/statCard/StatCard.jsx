import PropTypes from "prop-types";

// Displays a single statistic card with icon and label
export default function StatCard({ icon: Icon, label, value, accent }) {
    return (
        <div className="rounded-3xl border border-content/10 bg-content/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-2xl border px-3 py-3 ${accent}`}>
                    <Icon className="h-5 w-5" />
                </span>
            </div>

            <p className="text-2xl font-semibold text-content">{value}</p>
            <p className="mt-1 text-sm text-content/60">{label}</p>
        </div>
    );
}

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired, // component (Icon)
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    accent: PropTypes.string.isRequired,
};