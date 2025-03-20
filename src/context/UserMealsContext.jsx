import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMeals, fetchUserMeals } from "../services/apiService";

export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [activeOption, setActiveOption] = useState("All Meals");
    const [currentListEndpoint, setCurrentListEndpoint] = useState("");

    /** 🔹 **Bepaal `activeOption` zodra de gebruiker of zijn maaltijden veranderen** */
    useEffect(() => {
        if (user) {
            setActiveOption(userMeals.length > 0 ? "My Meals" : "All Meals");
        } else {
            setActiveOption("All Meals");
        }
    }, [user, userMeals]);

    /** 🔹 **Genereer het endpoint correct met filters & sorting** */
    useEffect(() => {
        let baseUrl =
            activeOption === "My Meals"
                ? `${import.meta.env.VITE_BASE_URL}/users/meals?page=0&size=10`
                : activeOption === "Created Meals"
                    ? `${import.meta.env.VITE_BASE_URL}/users/created-meals?page=0&size=10`
                    : `${import.meta.env.VITE_BASE_URL}/meals?page=0&size=10`;

        // **Filters toevoegen**
        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

        // **Sorting toevoegen**
        if (sortBy?.sortKey && sortBy?.sortOrder) {
            baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
        }

        // **Voorkom onnodige updates**
        if (baseUrl !== currentListEndpoint) {
            setCurrentListEndpoint(baseUrl);
        }
    }, [activeOption, filters, sortBy]);

    /** 🔹 **Haalt maaltijden op wanneer `currentListEndpoint` verandert** */
    const fetchMealsData = useCallback(async () => {
        if (!currentListEndpoint) return;

        setLoading(true);
        try {
            console.log("Fetching from endpoint:", currentListEndpoint);
            const mealsData = await fetchMeals(currentListEndpoint);
            setMeals(mealsData);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching meals:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentListEndpoint]);

    useEffect(() => {
        fetchMealsData();
    }, [currentListEndpoint]);

    /** 🔹 **Haalt user meals op zodra de gebruiker inlogt of verandert** */
    const fetchUserMealsData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            if (token) {
                const userMealsData = await fetchUserMeals(token);
                setUserMeals(Array.isArray(userMealsData.content) ? userMealsData.content : []);
            }
        } catch (error) {
            console.error("⚠️ Failed to fetch user meals:", error.message);
            setUserMeals([]);
        } finally {
            setLoading(false);
        }
    };

    /** 🔹 **Verwijdert een maaltijd uit de gebruikerslijst** */
    const removeMealFromUserMeals = (mealId) => {
        setUserMeals((prev) => {
            const updatedMeals = prev.filter((meal) => meal.id !== mealId);
            console.log("✅ Updated userMeals after removal:", updatedMeals);
            return [...updatedMeals];
        });
    };

    return (
        <UserMealsContext.Provider
            value={{
                meals,
                userMeals,
                loading,
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
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
