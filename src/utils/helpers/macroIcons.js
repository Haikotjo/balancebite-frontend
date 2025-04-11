// src/utils/iconMap.js
import { Flame, Dumbbell, ChartColumnIncreasing, Droplet } from "lucide-react";

export const macroIcons = {
    Calories: Flame,
    Protein: Dumbbell,
    Carbs: ChartColumnIncreasing,
    Fats: Droplet,
};

export const macroIconClasses = {
    Calories: "text-error",
    Protein: "text-primary",
    Carbs: "text-success",
    Fats: "text-secondary",
};
