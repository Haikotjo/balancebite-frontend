import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMeals, fetchUserMeals} from "../services/apiService";

/**
 * Context for managing user-specific meal data and API endpoints.
 */
export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentListEndpoint, setCurrentListEndpoint] = useState(() => {
        return user
            ? `${import.meta.env.VITE_BASE_URL}/users/meals?page=0&size=10`
            : `${import.meta.env.VITE_BASE_URL}/meals?page=0&size=10`;
    });

    const fetchMealsData = useCallback(async () => {
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

    /**
     * Fetches meals associated with the logged-in user.
     */
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


    /**
     * Fetch user meals when the user logs in or after a page refresh.
     * Ensures userMeals are always up-to-date.
     */
    useEffect(() => {
        if (user) {
            fetchUserMealsData();
        }
    }, [user]);

    useEffect(() => {
        if (userMeals.length > 0) {
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/users/meals?page=0&size=10`);
        } else {
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals?page=0&size=10`);
        }
    }, [userMeals, user]);

    /**
     * Updates the current API endpoint dynamically.
     * @param {string} newEndpoint - The new endpoint to be set.
     */
    const updateEndpoint = (newEndpoint) => {
        if (
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/created-meals`)
        ) {
            setCurrentListEndpoint(newEndpoint);
        } else {
            console.warn("⛔ Attempted to set an endpoint not in the allowed list:", newEndpoint);
        }
    };


    /**
     * Removes a meal from the user's meal list.
     * Adds logs to check if the meal is being correctly removed.
     */
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
                setMeals,
                userMeals,
                loading,
                error,
                setLoading,
                setError,
                currentListEndpoint,
                setCurrentListEndpoint,
                updateEndpoint,
                fetchUserMealsData,
                fetchMealsData,
                resetUserMeals: () => setUserMeals([]),
                addMealToUserMeals: (meal) => setUserMeals((prev) => [...prev, meal]),
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