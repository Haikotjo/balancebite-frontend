import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchUserMeals } from "../services/apiService";

export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserMealsData = async () => {
        try {
            setLoading(true); // Zet de loading state aan
            const token = localStorage.getItem("accessToken");
            if (token) {
                const userMealsData = await fetchUserMeals(token);
                setUserMeals(Array.isArray(userMealsData) ? userMealsData : []);
            }
        } catch (error) {
            console.error("Failed to fetch user meals:", error.message);
            setUserMeals([]);
        } finally {
            setLoading(false); // Zet de loading state uit
        }
    };

    useEffect(() => {
        fetchUserMealsData(); // Haal meals op bij component mount
    }, []);

    const addMealToUserMeals = (meal) => {
        setUserMeals((prevMeals) => [...prevMeals, meal]);
    };

    const resetUserMeals = () => {
        setUserMeals([]);
    };

    return (
        <UserMealsContext.Provider value={{ userMeals, loading, fetchUserMealsData, resetUserMeals, addMealToUserMeals }}>
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
