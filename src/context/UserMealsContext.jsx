import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchUserMeals } from "../services/apiService";

export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const [userMeals, setUserMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserMealsData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const userMealsData = await fetchUserMeals(token);
                    setUserMeals(Array.isArray(userMealsData) ? userMealsData : []);
                }
            } catch (error) {
                console.error("Failed to fetch user meals:", error.message);
                setUserMeals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserMealsData();
    }, []);

    // Voeg een functie toe om een maaltijd te kunnen toevoegen
    const addMealToUserMeals = (meal) => {
        setUserMeals((prevMeals) => [...prevMeals, meal]);
    };

    return (
        <UserMealsContext.Provider value={{ userMeals, loading, addMealToUserMeals }}>
            {children}
        </UserMealsContext.Provider>
    );
};

UserMealsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
