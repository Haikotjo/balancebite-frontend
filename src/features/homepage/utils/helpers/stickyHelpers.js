// Returns label for sticky item type
export function getStickyTypeLabel(type) {
    if (type === "MEAL") return "Pinned meal";
    if (type === "DIET_PLAN") return "Pinned diet";
    return "Pinned item";
}