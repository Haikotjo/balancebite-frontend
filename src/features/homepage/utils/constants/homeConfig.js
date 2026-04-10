// homeConfig.js

import {
    ChefHat,
    CalendarDays,
    ShoppingCart,
    TrendingUp,
    Target,
    Flame,
    UtensilsCrossed,
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
            accent: "border-emerald-500/50 bg-emerald-100/40 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
        },
        {
            icon: CalendarDays,
            label: "Diet plans",
            value: dietCount || "10+",
            accent: "border-cyan-500/50 bg-cyan-100/40 text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300",
        },
        {
            icon: ShoppingCart,
            label: "Budget focused",
            value: "Smart",
            accent: "border-fuchsia-500/50 bg-fuchsia-100/40 text-fuchsia-600 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-300",
        },
        {
            icon: TrendingUp,
            label: "Track your intake",
            value: "Daily",
            accent: "border-amber-500/50 bg-amber-100/40 text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
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
            accentClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
            gradient: "from-emerald-400/15 via-content/[0.06] to-cyan-400/15"
        },
        {
            title: "Create a meal",
            text: "Pick from thousands of ingredients — macros and price calculated instantly",
            icon: UtensilsCrossed,
            onClick: () => navigate("/create-meal"),
            accentClass: "border-lime-400/20 bg-lime-400/10 text-lime-600 dark:text-lime-300",
            gradient: "from-lime-400/15 via-content/[0.06] to-emerald-400/15"
        },
        {
            title: "Create a diet",
            text: "Build structured plans for your nutrition",
            icon: Target,
            onClick: () => navigate("/create-diet"),
            accentClass: "border-cyan-400/20 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300",
            gradient: "from-cyan-400/15 via-content/[0.06] to-blue-400/15"
        },
        {
            title: "Shopping list",
            text: "Generate smart lists with pricing",
            icon: ShoppingCart,
            onClick: () => navigate("/shopping"),
            accentClass: "border-amber-400/20 bg-amber-400/10 text-amber-600 dark:text-amber-300",
            gradient: "from-amber-400/15 via-content/[0.06] to-orange-400/15"
        },
        {
            title: "Track intake",
            text: "Log your meals and stay on target",
            icon: Flame,
            onClick: () => navigate("/tracker"),
            accentClass: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-600 dark:text-fuchsia-300",
            gradient: "from-fuchsia-400/15 via-content/[0.06] to-pink-400/15"
        }
    ];
}