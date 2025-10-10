// Keep code comments in English
const SHORT_MAP = {
    energy: "Kcal",
    calories: "Kcal",
    protein: "Prot.",
    carbohydrate: "Carbs",
    carbohydrates: "Carbs",
    "total sugars": "Sugars",
    sugars: "Sugars",
    "total lipid": "Fat",
    fat: "Fat",
    "saturated fat": "Sat. fat",
    "unsaturated fat": "Unsat. fat",
    fiber: "Fiber",
    "dietary fiber": "Fiber",
    salt: "Salt",
    sodium: "Sodium",
    cholesterol: "Chol.",
};

const EXCLUDE = new Set(["total sugars", "saturated fat", "unsaturated fat"]);

/** Normalize nutrient name for lookups */
function norm(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/\(.*?\)/g, "")   // drop parentheticals
        .replace(/,\s*total/g, "") // "sugars, total" → "sugars"
        .replace(/\s+/g, " ")
        .trim();
}

/** Should we render this nutrient? */
export function shouldShowNutrient(name) {
    return !EXCLUDE.has(norm(name));
}

/** Format a nutrient object to a short, readable label/value */
export function formatNutrient(n) {
    const name = n?.nutrientName || n?.name || "Nutrient";
    const value = n?.value ?? n?.amount ?? "?";
    const unit = (n?.unitName || n?.unit || "").trim();
    const key = norm(name);
    const label = SHORT_MAP[key] || name;

    // Compact rule for energy in kcal
    if (label === "Kcal" || unit.toLowerCase() === "kcal") {
        return `${value} kcal`;
    }
    return `${label}: ${value}${unit ? ` ${unit}` : ""}`;
}
