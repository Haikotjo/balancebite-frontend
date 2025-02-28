import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchUserMeals } from "../services/apiService";

/**
 * Context for managing user-specific meal data and API endpoints.
 */
export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentListEndpoint, setCurrentListEndpoint] = useState(
        `${import.meta.env.VITE_BASE_URL}/meals`
    );

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
     * Fetch user meals when the user logs in.
     */
    useEffect(() => {
        if (user) {
            fetchUserMealsData();
        }
    }, [user]);

    /**
     * Updates the current API endpoint dynamically.
     * @param {string} newEndpoint - The new endpoint to be set.
     */
    const updateEndpoint = (newEndpoint) => {
        if (newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/meals`) ||
            newEndpoint.startsWith(`${import.meta.env.VITE_BASE_URL}/users/created-meals`)) {
            setCurrentListEndpoint(newEndpoint);
        } else {
            console.warn("⛔ Attempted to set an endpoint not in the allowed list:", newEndpoint);
        }
    };

    useEffect(() => {
    }, [userMeals]);

    /**
     * Removes a meal from the user's meal list.
     * Adds logs to check if the meal is being correctly removed.
     */
    const removeMealFromUserMeals = (mealId) => {
        setUserMeals((prev) => {
            const updatedMeals = prev.filter((meal) => meal.id !== mealId);
            console.log("✅ Updated userMeals after removal:", updatedMeals);
            return [...updatedMeals];  // Nieuwe array zodat React de update ziet
        });
    };

    return (
        <UserMealsContext.Provider
            value={{
                userMeals,
                loading,
                currentListEndpoint,
                updateEndpoint,
                fetchUserMealsData,
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
