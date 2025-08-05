import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {fetchMealById, fetchMeals, fetchUserMeals} from "../services/apiService";
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
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        userMealsRef.current = userMeals;
    }, [userMeals]);

    useEffect(() => {
        console.log("🟡 activeOption useEffect triggered:", activeOption);
    }, [activeOption]);

    const getMealById = useCallback(async (mealId) => {
        const fromContext = [...userMealsRef.current, ...meals].find(
            (m) => String(m.id) === String(mealId)
        );

        if (fromContext) {
            console.log("✅ Meal found in context:", fromContext);
            return fromContext;
        }

        try {
            const fetchedMeal = await fetchMealById(mealId);

            return fetchedMeal;
        } catch (err) {
            console.error("❌ Could not fetch meal by ID:", err.message);
            return null;
        }
    }, [meals]);


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
                } catch (err) {
                    setError(err.message);
                    setUserMeals([]);
                    userCopies = [];
                }
            }

            try {
                const mealsData = await fetchMeals(currentListEndpoint);
                const publicMeals = mealsData.content || [];

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

                setMeals(finalMeals);
                setTotalPages(mealsData.totalPages || 1);
                setError(null);
            } catch (err) {
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
                applyUserCopies,
                getMealById,
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
