import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMeals, fetchUserMeals } from "../services/apiService";
import { useRef } from "react";


export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loadingUserMeals, setLoadingUserMeals] = useState(false);
    const [loadingMeals, setLoadingMeals] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [activeOption, setActiveOption] = useState("All Meals");
    const [currentListEndpoint, setCurrentListEndpoint] = useState("");
    const userMealsRef = useRef(userMeals);
    useEffect(() => {
        userMealsRef.current = userMeals;
    }, [userMeals]);

    const applyUserCopies = useCallback((publicMeals, userCopies) => {
        return publicMeals.map(meal => {
            const copy = userCopies.find(
                (m) => String(m.originalMealId) === String(meal.id)
            );
            return copy || meal;
        });
    }, []);

    const fetchUserMealsData = useCallback(async () => {
        setLoadingUserMeals(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const userMealsData = await fetchUserMeals(token);
                const validData = Array.isArray(userMealsData.content) ? userMealsData.content : [];
                setUserMeals(validData);
                userMealsRef.current = validData;
            }
        } catch (error) {
            console.error("⚠️ Failed to fetch user meals:", error.message);
            setUserMeals([]);
            userMealsRef.current = [];
        } finally {
            setLoadingUserMeals(false);
        }
    }, []);


    useEffect(() => {
        let baseUrl =
            activeOption === "My Meals"
                ? `/users/meals?page=${page - 1}&size=12`
                : activeOption === "Created Meals"
                    ? `/users/created-meals?page=${page - 1}&size=12`
                    : `/meals?page=${page - 1}&size=12`;

        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

        if (sortBy?.sortKey && sortBy?.sortOrder) {
            baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
        }

        if (baseUrl !== currentListEndpoint) {
            setCurrentListEndpoint(baseUrl);
        }
    }, [activeOption, filters, sortBy, page]);

    useEffect(() => {
        const run = async () => {
            if (!currentListEndpoint) return;

            const token = localStorage.getItem("accessToken");
            let userCopies = [];

            if (user && token) {
                try {
                    const userMealsData = await fetchUserMeals(token);
                    userCopies = Array.isArray(userMealsData.content) ? userMealsData.content : [];
                    setUserMeals(userCopies);
                    console.log("👤 User meals binnen (volledig):");
                    userCopies.forEach((meal, i) => {
                        console.log(`UserMeal ${i + 1}:`, meal);
                    });
                } catch (e) {
                    console.error("⚠️ Failed to fetch user meals:", e.message);
                    setUserMeals([]);
                    userCopies = [];
                }
            }

            try {
                const mealsData = await fetchMeals(currentListEndpoint);
                const publicMeals = mealsData.content || [];

                console.log("📦 Alle meals volledig:");
                publicMeals.forEach((meal, index) => {
                    console.log(`Meal ${index + 1}:`, {
                        id: meal.id,
                        name: meal.name,
                        saveCount: meal.saveCount,
                        weeklySaveCount: meal.weeklySaveCount,
                        monthlySaveCount: meal.monthlySaveCount,
                        originalMealId: meal.originalMealId,
                    });
                });

                const finalMeals = user && userCopies.length > 0
                    ? applyUserCopies(publicMeals, userCopies)
                    : publicMeals;

                if (sortBy?.sortKey === "saveCount") {
                    finalMeals.sort((a, b) => {
                        const aIsCopy = !!a.originalMealId;
                        const bIsCopy = !!b.originalMealId;

                        if (aIsCopy && !bIsCopy) return 1;
                        if (!aIsCopy && bIsCopy) return -1;

                        const aVal = a.saveCount ?? 0;
                        const bVal = b.saveCount ?? 0;
                        return sortBy.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                    });
                }

                console.log("🔁 Final meals after applyUserCopies:");
                finalMeals.forEach((m, i) => {
                    console.log(`Meal ${i + 1}:`, {
                        id: m.id,
                        name: m.name,
                        originalMealId: m.originalMealId,
                        saveCount: m.saveCount,
                        weeklySaveCount: m.weeklySaveCount,
                        monthlySaveCount: m.monthlySaveCount,
                    });
                });

                setMeals(finalMeals);

                setMeals(finalMeals);
                setTotalPages(mealsData.totalPages || 1);
                setError(null);
            } catch (err) {
                console.error("❌ Error fetching meals:", err);
                setError(err.message);
            } finally {
                setLoadingMeals(false);
            }
        };

        run().catch(console.error);
    }, [activeOption, user, currentListEndpoint, sortBy]);


    const replaceMealInMeals = (originalMealId, newMeal) => {
        setMeals((prevMeals) =>
            prevMeals.map((meal) =>
                String(meal.id) === String(originalMealId) ? newMeal : meal
            )
        );
    };

    const removeMealFromUserMeals = (mealId) => {
        setUserMeals((prev) => prev.filter((meal) => meal.id !== mealId));
    };

    const addMealToUserMeals = (meal) => {
        setUserMeals((prevUserMeals) => [...prevUserMeals, meal]);
    };

    const removeMealFromMeals = (mealId) => {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
    };

    return (
        <UserMealsContext.Provider
            value={{
                meals,
                userMeals,
                loading: loadingMeals || loadingUserMeals,
                error,
                activeOption,
                setActiveOption,
                filters,
                setFilters,
                sortBy,
                setSortBy,
                fetchUserMealsData,
                removeMealFromUserMeals,
                addMealToUserMeals,
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
