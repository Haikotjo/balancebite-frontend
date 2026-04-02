import PropTypes from "prop-types";

// Large clickable feature card with image
export default function HeroFeatureCard({ image, title, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="overflow-hidden rounded-[32px] border border-content/10 bg-surface shadow-2xl backdrop-blur-xl text-left group"
        >
            <div className="relative h-[220px] md:h-[240px]">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                    <p className="text-sm text-emerald-200">{label}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{title}</h3>
                </div>
            </div>
        </button>
    );
}

HeroFeatureCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};