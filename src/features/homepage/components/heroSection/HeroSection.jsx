import PropTypes from "prop-types";
import StatCard from "../statCard/StatCard.jsx";


// Main hero section of homepage
export default function HeroSection({ stats, navigate, chipBaseClass }) {
    return (
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-400/15 via-white/[0.06] to-cyan-400/15 p-6 shadow-2xl backdrop-blur-xl md:p-8">

            <div className="mb-5 flex flex-wrap gap-3">
                <span className={chipBaseClass}>
                    Modern nutrition platform
                </span>
                <span className={chipBaseClass}>
                    Community + personal copies
                </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                Discover meals. Build diet plans. Stay on budget.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                BalanceBite combines meal discovery, diet planning, shopping cost control and intake tracking in one visual workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
                <button
                    onClick={() => navigate("/meals", { state: { filtersFromRedirect: {} } })}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
                >
                    Explore meals
                </button>

                <button
                    onClick={() => navigate("/diets")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                    View diet plans
                </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

        </div>
    );
}

HeroSection.propTypes = {
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.elementType.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]).isRequired,
            accent: PropTypes.string.isRequired,
        })
    ).isRequired,
    navigate: PropTypes.func.isRequired,
    chipBaseClass: PropTypes.string.isRequired,
};