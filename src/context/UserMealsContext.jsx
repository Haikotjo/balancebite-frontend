import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

        if (!token) return;

        try {
            const data = await fetchUserMeals(token);

            const list = Array.isArray(data?.content)
                ? data.content
                : Array.isArray(data)
                    ? data
                    : [];

            setUserMeals(list);
        } catch {
            setUserMeals([]);
        }

    }, [token]);

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

                Object.entries(filters).forEach(([key, value]) => {
                    baseUrl += `&${key}=${encodeURIComponent(value)}`;
                });
                if (sortBy?.sortKey && sortBy?.sortOrder) {
                    baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
                }

                // De backend vervangt nu automatisch originelen door jouw kopieën!
                const data = await fetchMeals(baseUrl);
                const receivedMeals = data.content || [];

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

    const getMealById = useCallback(async (mealId) => {
        const found = meals.find(m => String(m.id) === String(mealId));
        if (found) return found;

        try {
            return await fetchMealById(mealId);
        } catch {
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