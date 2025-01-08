import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchUserMeals } from "../services/apiService";

/**
 * Context for managing user-specific meal data and endpoints.
 * Provides functionality for fetching user meals, setting available endpoints,
 * and managing the current endpoint for meal-related API requests.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} The rendered UserMealsProvider component.
 */
export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Access user information from AuthContext
    const [userMeals, setUserMeals] = useState([]); // State for storing meals specific to the logged-in user
    const [loading, setLoading] = useState(true); // State to track loading status
    const [availableEndpoints, setAvailableEndpoints] = useState([]); // List of endpoints the user can access
    const [currentListEndpoint, setCurrentListEndpoint] = useState(
        `${import.meta.env.VITE_BASE_URL}/meals` // Default endpoint for non-logged-in users
    );

    /**
     * Fetches meals data for the logged-in user from the API.
     */
    const fetchUserMealsData = async () => {
        try {
            setLoading(true); // Set loading state to true during the fetch
            const token = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage
            if (token) {
                const userMealsData = await fetchUserMeals(token); // Fetch user meals using the token
                setUserMeals(Array.isArray(userMealsData) ? userMealsData : []); // Update state with fetched meals
            }
        } catch (error) {
            console.error("Failed to fetch user meals:", error.message); // Log any errors
            setUserMeals([]); // Reset userMeals state on failure
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    /**
     * Updates the available endpoints and default endpoint whenever the user changes.
     */
    useEffect(() => {
        if (user) {
            setAvailableEndpoints([
                `${import.meta.env.VITE_BASE_URL}/meals`, // Ensure this endpoint is available for logged-in users
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`,
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_CREATED_MEALS_ENDPOINT}`,
                // Add future endpoints here
            ]);
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_MEALS_ENDPOINT}`); // Default for logged-in users
        } else {
            setAvailableEndpoints([`${import.meta.env.VITE_BASE_URL}/meals`]); // Default for non-logged-in users
            setCurrentListEndpoint(`${import.meta.env.VITE_BASE_URL}/meals`);
        }
    }, [user]);

    /**
     * Updates the current endpoint for meal-related requests.
     * @param {string} newEndpoint - The new endpoint to set as the current endpoint.
     */
    const updateEndpoint = (newEndpoint) => {
        if (availableEndpoints.includes(newEndpoint)) {
            setCurrentListEndpoint(newEndpoint); // Update the current endpoint if it's in the available list
        } else {
            console.warn("Attempted to set an endpoint not in the available list:", newEndpoint);
        }
    };

    /**
     * Adds a new meal to the userMeals state.
     * @param {Object} meal - The meal object to add.
     */
    const addMealToUserMeals = (meal) => {
        setUserMeals((prevMeals) => [...prevMeals, meal]); // Append the new meal to the existing meals
    };

    /**
     * Resets the userMeals state to an empty array.
     */
    const resetUserMeals = () => {
        setUserMeals([]); // Clear the userMeals state
    };

    /**
     * Fetches user meals when the component mounts or the user changes.
     */
    useEffect(() => {
        if (user) {
            fetchUserMealsData(); // Fetch meals for the current user
        }
    }, [user]);

    return (
        <UserMealsContext.Provider
            value={{
                userMeals,
                loading,
                availableEndpoints,
                currentListEndpoint,
                updateEndpoint,
                fetchUserMealsData,
                resetUserMeals,
                addMealToUserMeals,
            }}
        >
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    /**
     * The child components wrapped by the provider.
     */
    children: PropTypes.node.isRequired,
};
