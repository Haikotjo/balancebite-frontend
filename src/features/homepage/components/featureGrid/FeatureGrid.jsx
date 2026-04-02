import PropTypes from "prop-types";
import { ShoppingCart, Heart, Users } from "lucide-react";

import InfoCard from "../infoCard/InfoCard.jsx";
import HeroFeatureCard from "../heroFeatureCard/HeroFeatureCard.jsx";

// Grid with hero + info cards
// Grid with hero + info cards
export default function FeatureGrid({ navigate }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">

            <HeroFeatureCard
                image="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80"
                label="Meal discovery"
                title="Find meals that match your goals"
                onClick={() => navigate("/meals")}
            />

            <InfoCard
                icon={ShoppingCart}
                title="Smart shopping from your diet"
                text="Turn planned meals into a shopping list with quantities, price totals and missing price warnings."
                accentClass="border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200"
                gradient="from-emerald-400/15 via-content/[0.06] to-cyan-400/15"
            />

            <InfoCard
                icon={Heart}
                title="Make it your own"
                text="Save meals and diet plans and make them your own so you can customize them freely and keep everything tailored to your preferences."
                accentClass="border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-700 dark:text-fuchsia-200"
                gradient="from-fuchsia-400/15 via-content/[0.06] to-amber-400/15"
            />

            <InfoCard
                icon={Users}
                title="Share your meals"
                text="Share your meals and diet plans so others can discover, use and build on what you’ve created."
                accentClass="border-cyan-400/20 bg-cyan-400/10 text-cyan-700 dark:text-cyan-200"
                gradient="from-cyan-400/15 via-content/[0.06] to-emerald-400/15"
            />

        </div>
    );
}

FeatureGrid.propTypes = {
    navigate: PropTypes.func.isRequired,
};