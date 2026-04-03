import {
    Home, Soup, CookingPot, Apple, Info,
    UserCircle, Gauge, ShieldUser,
    BookOpen, UserPen, PlusCircle,
} from "lucide-react";

/**
 * Geeft de navigatie-items terug op basis van de ingelogde user.
 * Items met sub-menu zijn alleen zichtbaar op desktop (expanded staat).
 *
 * @param {object|null} user
 * @returns {Array}
 */
export function buildNavItems(user) {
    return [
        { label: "Home", icon: Home, path: "/" },
        {
            label: "Meals", icon: Soup, path: "/meals",
            sub: [
                { label: "All Meals",     icon: BookOpen,   path: "/meals?option=All-Meals" },
                user && { label: "My Meals",      icon: Soup,       path: "/meals?option=My-Meals" },
                user && { label: "Created Meals", icon: UserPen,    path: "/meals?option=Created-Meals" },
                user && { label: "Create Meal",   icon: PlusCircle, path: "/create-meal" },
            ].filter(Boolean),
        },
        {
            label: "Diets", icon: CookingPot, path: "/diets",
            sub: [
                { label: "All Diets",     icon: BookOpen,   path: "/diets?option=All-Diets" },
                user && { label: "My Diets",       icon: CookingPot, path: "/diets?option=My-Diets" },
                user && { label: "Created Diets",  icon: UserPen,    path: "/diets?option=Created-Diets" },
                user && { label: "Create Diet",    icon: PlusCircle, path: "/create-diet" },
            ].filter(Boolean),
        },
        user && {
            label: "Profile", icon: UserCircle, path: "/profile",
            sub: [
                { label: "Profile",   icon: UserCircle, path: "/profile" },
                { label: "Dashboard", icon: Gauge,      path: "/dashboard" },
                user?.roles?.includes("ADMIN") && { label: "Admin", icon: ShieldUser, path: "/admin" },
            ].filter(Boolean),
        },
        { label: "Ingredients", icon: Apple, path: "/ingredients" },
        { label: "About",       icon: Info,  path: "/about" },
    ].filter(Boolean);
}