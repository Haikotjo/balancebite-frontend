const sections = {
    profile: ["/profile", "/admin"],
    meals: ["/meals", "/create-meal", "/meal"],
    diets: ["/diets", "/create-diet", "/diet"],
    ingredients: ["/ingredients"],
    dashboard: ["/dashboard"],
};

export function getActiveSection(pathname) {
    for (const [key, prefixes] of Object.entries(sections)) {
        if (prefixes.some((p) => pathname.startsWith(p))) return key;
    }
    return "home";
}
