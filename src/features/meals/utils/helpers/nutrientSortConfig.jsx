// src/features/meals/utils/helpers/nutrientSortConfig.js
import {
    Flame,
    ChartColumnIncreasing,
    Dumbbell,
    Droplet,
    TrendingUp,
    ChartNoAxesColumnIncreasing,
    TrendingDown,
} from "lucide-react";

export const getNutrients = (iconBase) => [
    {
        name: "Energy",
        label: "Kcal",
        icon: <Flame className={`${iconBase} text-error`} />,
        sortKey: "calories",
    },
    {
        name: "Protein",
        label: "Protein",
        icon: <Dumbbell className={`${iconBase} text-primary`} />,
        sortKey: "protein",
    },
    {
        name: "Carbs",
        label: "Carbs",
        icon: <ChartColumnIncreasing className={`${iconBase} text-success`} />,
        sortKey: "carbs",
    },
    {
        name: "Fat",
        label: "Fat",
        icon: <Droplet className={`${iconBase} text-secondary`} />,
        sortKey: "fat",
    },
    {
        name: "All Time",
        label: "All Time",
        icon: <ChartNoAxesColumnIncreasing className="text-primary" />,
        sortKey: "saveCount",
    },
    {
        name: "This Week",
        label: "This Week",
        icon: <TrendingUp className="text-primary" />,
        sortKey: "weeklySaveCount",
    },
    {
        name: "This Month",
        label: "This Month",
        icon: <TrendingDown className="text-primary" />,
        sortKey: "monthlySaveCount",
    },
];

export const borderBySortKey = {
    calories: "border-error dark:border-error",
    protein: "border-primary dark:border-primary",
    carbs: "border-success dark:border-success",
    fat: "border-secondary dark:border-secondary",
    saveCount: "border-primary dark:border-primary",
    weeklySaveCount: "border-primary dark:border-primary",
    monthlySaveCount: "border-primary dark:border-primary",
};
