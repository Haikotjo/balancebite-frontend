// homeConfig.js

import {
    ChefHat,
    CalendarDays,
    ShoppingCart,
    TrendingUp,
    Target,
    Flame,
} from "lucide-react";

/**
 * Returns homepage stats config
 * @param {number} mealCount
 * @param {number} dietCount
 */
export function getStats(mealCount, dietCount) {
    return [
        {
            icon: ChefHat,
            label: "Meals to explore",
            value: mealCount || "50+",
            accent: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        },
        {
            icon: CalendarDays,
            label: "Diet plans",
            value: dietCount || "10+",
            accent: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
        },
        {
            icon: ShoppingCart,
            label: "Budget focused",
            value: "Smart",
            accent: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
        },
        {
            icon: TrendingUp,
            label: "Track your intake",
            value: "Daily",
            accent: "border-amber-400/20 bg-amber-400/10 text-amber-200",
        },
    ];
}

/**
 * Returns quick actions config
 * @param {function} navigate
 */
export function getQuickActions(navigate) {
    return [
        {
            title: "Discover meals",
            text: "Browse and explore meals that fit your goals",
            icon: ChefHat,
            onClick: () => navigate("/meals"),
            accentClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
            gradient: "from-emerald-400/15 via-white/[0.06] to-cyan-400/15"
        },
        {
            title: "Create a diet",
            text: "Build structured plans for your nutrition",
            icon: Target,
            onClick: () => navigate("/create-diet"),
            accentClass: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
            gradient: "from-cyan-400/15 via-white/[0.06] to-blue-400/15"
        },
        {
            title: "Shopping list",
            text: "Generate smart lists with pricing",
            icon: ShoppingCart,
            onClick: () => navigate("/shopping"),
            accentClass: "border-amber-400/20 bg-amber-400/10 text-amber-200",
            gradient: "from-amber-400/15 via-white/[0.06] to-orange-400/15"
        },
        {
            title: "Track intake",
            text: "Log your meals and stay on target",
            icon: Flame,
            onClick: () => navigate("/tracker"),
            accentClass: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
            gradient: "from-fuchsia-400/15 via-white/[0.06] to-pink-400/15"
        }
    ];
}