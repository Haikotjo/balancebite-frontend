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


    const replaceMealInMeals = (originalMealId, newMeal) => {
        setMeals((prevMeals) =>
            prevMeals.map((meal) =>
                String(meal.id) === String(originalMealId) ? newMeal : meal
            )
        );
    };


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
        if (user) {
            fetchUserMealsData();  // 🔹 Alleen bij login, NIET elke keer als je van lijst wisselt
        }
    }, [user]); // 🔹 Deze afhankelijkheid zorgt dat het enkel wordt uitgevoerd bij login/logout

    useEffect(() => {
        fetchMealsData();  // 🔹 Voert ALLEEN de meal-fetch uit bij verandering van lijst (All Meals / My Meals)
    }, [currentListEndpoint]);

    /** 🔹 **Verwijdert een maaltijd uit de gebruikerslijst** */
    const removeMealFromUserMeals = (mealId) => {
        setUserMeals((prev) => {
            const updatedMeals = prev.filter((meal) => meal.id !== mealId);
            console.log("✅ Updated userMeals after removal:", updatedMeals);
            return [...updatedMeals];
        });
    };

    const addMealToUserMeals = (meal) => {
        setUserMeals((prevUserMeals) => [...prevUserMeals, meal]);
    };

    const removeMealFromMeals = (mealId) => {
        setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId));
    };

    useEffect(() => {
        if (activeOption === "My Meals" && user) {
            fetchUserMealsData(); // Zorgt voor actuele data zodra je naar My Meals gaat
        }
    }, [activeOption, user]);


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
                addMealToUserMeals,
                removeMealFromMeals,
                replaceMealInMeals,
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
