import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchUserMeals } from "../services/apiService";

/**
 * Context for managing user-specific meal data and API endpoints.
 * Provides functionality for fetching user meals, setting available endpoints,
 * and managing the current endpoint for meal-related API requests.
 */
export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Retrieve current user from AuthContext
    const [userMeals, setUserMeals] = useState([]); // Stores meals associated with the user
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [availableEndpoints, setAvailableEndpoints] = useState([]); // List of allowed API endpoints
    const [currentListEndpoint, setCurrentListEndpoint] = useState(
        `${import.meta.env.VITE_BASE_URL}/meals` // Default endpoint for non-logged-in users
    );
    const [activeOption, setActiveOption] = useState("All Meals"); // Tracks the currently active option

    /**
     * Fetches meals associated with the logged-in user.
     */
    const fetchUserMealsData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken"); // Retrieve authentication token
            if (token) {
                const userMealsData = await fetchUserMeals(token);
                setUserMeals(Array.isArray(userMealsData) ? userMealsData : []);
            }
        } catch (error) {
            console.error("⚠️ Failed to fetch user meals:", error.message);
            setUserMeals([]); // Reset meals list if an error occurs
        } finally {
            setLoading(false);
        }
    };

    /**
     * Updates the list of allowed endpoints whenever the user changes.
     */
    useEffect(() => {
        if (user) {
            // Logged-in users have additional endpoint options
            setAvailableEndpoints([
                `${import.meta.env.VITE_BASE_URL}/meals`, // Public meals endpoint
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`,
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATED_MEALS_ENDPOINT}`,
            ]);
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`); // Default for logged-in users
        } else {
            // Non-logged-in users only have access to the public meals endpoint
            setAvailableEndpoints([`${import.meta.env.VITE_BASE_URL}/meals`]);
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`);
        }
    }, [user]);

    /**
     * Updates the current API endpoint. Now allows any endpoint that starts with "/meals".
     * This prevents filtering and sorting requests from being blocked.
     * @param {string} newEndpoint - The new endpoint to be set.
     */
    const updateEndpoint = (newEndpoint) => {
        if ( newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/created-meals`)) {
            console.log("✅ Allowed endpoint:", newEndpoint);
            setCurrentListEndpoint(newEndpoint);
        } else {
            console.warn("⛔ Attempted to set an endpoint not in the available list:", newEndpoint);
        }
    };

    return (
        <UserMealsContext.Provider
            value={{
                userMeals,
                loading,
                currentListEndpoint,
                updateEndpoint,
                fetchUserMealsData,
                resetUserMeals: () => setUserMeals([]), // Resets the user meals list
                addMealToUserMeals: (meal) => setUserMeals((prev) => [...prev, meal]), // Adds a new meal
                removeMealFromUserMeals: (mealId) =>
                    setUserMeals((prev) => prev.filter((meal) => meal.id !== mealId)), // Removes a meal
                activeOption,
                setActiveOption,
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
