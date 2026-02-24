import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMealById, fetchMeals, fetchUserMeals } from "../services/apiService";

export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]); // Voor de "My Meals" zijlijst
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [activeOption, setActiveOption] = useState("All Meals");
    const [itemsPerPage] = useState(12);
    const { user, token } = useContext(AuthContext);

    const fetchUserMealsData = useCallback(async () => {
        console.log("[fetchUserMealsData] called", { hasUser: !!user, hasToken: !!token });

        if (!token) return;

        try {
            const data = await fetchUserMeals(token);

            console.log("[fetchUserMealsData] raw response:", data);
            console.log("[fetchUserMealsData] keys:", Object.keys(data || {}));

            const list = Array.isArray(data?.content)
                ? data.content
                : Array.isArray(data)
                    ? data
                    : [];

            console.log("[fetchUserMealsData] resolved length:", list.length);

            setUserMeals(list);
        } catch (e) {
            console.error("[fetchUserMealsData] failed:", e?.response?.status, e?.response?.data, e);
            setUserMeals([]);
        }

    }, [user, token]);


    useEffect(() => {
        if (user && token) fetchUserMealsData();
    }, [user, token, fetchUserMealsData]);


    // De hoofdfunctie die de lijst ophaalt
    useEffect(() => {
        const loadMeals = async () => {
            setLoading(true);
            try {
                let baseUrl = activeOption === "My Meals"
                    ? `/users/meals?page=${page - 1}&size=${itemsPerPage}`
                    : activeOption === "Created Meals"
                        ? `/users/created-meals?page=${page - 1}&size=${itemsPerPage}`
                        : `/meals?page=${page - 1}&size=${itemsPerPage}`;

                // Filters plakken
                Object.entries(filters).forEach(([key, value]) => {
                    baseUrl += `&${key}=${encodeURIComponent(value)}`;
                });
                if (sortBy?.sortKey && sortBy?.sortOrder) {
                    baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
                }

                // De backend vervangt nu automatisch originelen door jouw kopieën!
                const data = await fetchMeals(baseUrl);
                const receivedMeals = data.content || [];

                // --- LOGGING START ---
                console.log(`🍟 Totaal aantal meals geladen voor [${activeOption}]:`, receivedMeals.length);

                const copies = receivedMeals.filter(m => m.isTemplate === false);
                if (copies.length > 0) {
                    console.log(`✅ GEVONDEN: ${copies.length} maaltijden zijn JOUW kopieën!`);
                    console.table(copies.map(m => ({
                        id: m.id,
                        name: m.name,
                        originalId: m.originalMealId,
                        isTemplate: m.isTemplate,
                        isPrivate: m.isPrivate
                    })));
                } else {
                    console.log("ℹ️ Geen kopieën gevonden (allemaal standaard templates).");
                }
                // --- LOGGING EIND ---

                setMeals(receivedMeals);
                setTotalPages(data.totalPages || 1);
                setError(null);
            } catch (err) {
                console.error("❌ Fout bij laden meals:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMeals();
    }, [activeOption, filters, sortBy, page, user]);

    // Simpele helper om een meal te vinden in de huidige state
    const getMealById = useCallback(async (mealId) => {
        const found = meals.find(m => String(m.id) === String(mealId));
        if (found) return found;

        try {
            return await fetchMealById(mealId);
        } catch (err) {
            return null;
        }
    }, [meals]);

    const replaceMealInMeals = (originalId, newMeal) => {
        setMeals(prev => prev.map(m => String(m.id) === String(originalId) ? newMeal : m));
    };

    const removeMealFromMeals = (mealId) => {
        setMeals(prev => prev.filter(m => m.id !== mealId));
    };

    const addMealToUserMeals = (meal) => {
        setUserMeals((prev) => {
            const exists = prev.some((m) => String(m.id) === String(meal.id));
            return exists ? prev : [meal, ...prev];
        });
    };

    const removeMealFromUserMeals = (mealId) => {
        setUserMeals((prev) => prev.filter((m) => String(m.id) !== String(mealId)));
    };

    return (
        <UserMealsContext.Provider
            value={{
                meals,
                userMeals,
                addMealToUserMeals,
                removeMealFromUserMeals,
                getMealById,
                loading,
                error,
                activeOption,
                setActiveOption,
                filters,
                setFilters,
                sortBy,
                setSortBy,
                fetchUserMealsData,
                removeMealFromMeals,
                replaceMealInMeals,
                setMeals,
                page,
                setPage,
                totalPages,
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};