import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {addMealToFavoritesApi, fetchMeals, fetchUserMeals} from "../services/apiService";

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
            ? `${import.meta.env.VITE_BASE_URL}/users/meals`
            : `${import.meta.env.VITE_BASE_URL}/meals`;
    });

    /**
     * Fetches meals based on the current endpoint.
     */
    const fetchMealsData = async () => {
        try {
            setLoading(true);
            console.log("Fetching from endpoint:", currentListEndpoint);
            const mealsData = await fetchMeals(currentListEndpoint);
            setMeals(mealsData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
     * Adds a meal to the user's meal list and updates the UI instantly.
     * @param {object} meal - The meal object to be added.
     */
    const addMealToFavorites = async (meal) => {
        try {
            const token = localStorage.getItem("accessToken");
            await addMealToFavoritesApi(meal.id, token);

            // ✅ Haal direct de nieuwe lijst op, zodat we de correcte `originalMealId` krijgen.
            await fetchUserMealsData();

            console.log(`${meal.name} added to favorites.`);
        } catch (error) {
            console.error("❌ Error adding meal to favorites:", error);
        }
    };

    /**
     * Fetch meals when endpoint changes.
     */
    useEffect(() => {
        if (currentListEndpoint) {
            (async () => {
                try {
                    await fetchMealsData();
                } catch (error) {
                    console.error("❌ Error fetching meals:", error);
                }
            })();
        }
    }, [currentListEndpoint]);

    /**
     * Fetch user meals when the user logs in.
     */
    useEffect(() => {
        if (user && currentListEndpoint !== `${import.meta.env.VITE_BASE_URL}/users/meals`) {
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/users/meals`);

            (async () => {
                try {
                    await fetchUserMealsData();
                } catch (error) {
                    console.error("❌ Error fetching user meals:", error);
                }
            })();
        }
    }, [user]);

    /**
     * Fetch user meals when the user logs in or after a page refresh.
     * Ensures userMeals are always up-to-date.
     */
    useEffect(() => {
        if (user) {
            (async () => {
                await fetchUserMealsData();
            })();
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

    /**
     * Refreshes the meal list (same as `fetchMealsData`, but exposed in context).
     */
    const refreshMealsList = async () => {
        await fetchMealsData();
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
                userMeals,
                loading,
                error,
                currentListEndpoint,
                setCurrentListEndpoint,
                updateEndpoint,
                fetchUserMealsData,
                refreshMealsList,
                resetUserMeals: () => setUserMeals([]),
                addMealToUserMeals: (meal) => setUserMeals((prev) => [...prev, meal]),
                removeMealFromUserMeals,
                addMealToFavorites,
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
