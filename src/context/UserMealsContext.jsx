import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMeals, fetchUserMeals } from "../services/apiService";

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

    const fetchMealsData = useCallback(async () => {
        if (!currentListEndpoint) return;

        setLoadingMeals(true);
        try {
            const mealsData = await fetchMeals(currentListEndpoint);
            setMeals(mealsData.content || []);
            setTotalPages(mealsData.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching meals:", err);
            setError(err.message);
        } finally {
            setLoadingMeals(false);
        }
    }, [currentListEndpoint]);

    const fetchUserMealsData = useCallback(async () => {
        setLoadingUserMeals(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const userMealsData = await fetchUserMeals(token);
                setUserMeals(Array.isArray(userMealsData.content) ? userMealsData.content : []);
            }
        } catch (error) {
            console.error("⚠️ Failed to fetch user meals:", error.message);
            setUserMeals([]);
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
        fetchMealsData();

        if (activeOption === "My Meals" && user) {
            fetchUserMealsData();
        }
    }, [activeOption, user, fetchMealsData]);


    useEffect(() => {
        if (user) {
            fetchUserMealsData();
        }
    }, [user]);

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
                fetchMealsData,
                removeMealFromUserMeals,
                addMealToUserMeals,
                removeMealFromMeals,
                replaceMealInMeals,
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
