import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchMeals, fetchUserMeals } from "../services/apiService";

export const UserMealsContext = createContext();

export const UserMealsProvider = ({ children }) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
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
                ? `/users/meals?page=${page - 1}&size=6`
                : activeOption === "Created Meals"
                    ? `/users/created-meals?page=${page - 1}&size=6`
                    : `/meals?page=${page - 1}&size=6`;

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
    }, [activeOption, filters, sortBy, page]);


    /** 🔹 **Haalt maaltijden op wanneer `currentListEndpoint` verandert** */
    const fetchMealsData = useCallback(async () => {
        if (!currentListEndpoint) return;

        setLoading(true);
        try {
            console.log("Fetching from endpoint:", currentListEndpoint);
            const mealsData = await fetchMeals(currentListEndpoint);
            console.log("✅ Received mealsData:", mealsData);
            setMeals(mealsData.content || []);
            setTotalPages(mealsData.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching meals:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentListEndpoint]);

    useEffect(() => {
        fetchMealsData(); // 👉 altijd meals ophalen, login maakt niet uit

        if (activeOption === "My Meals" && user) {
            fetchUserMealsData(); // 👉 alleen userMeals als ingelogd en My Meals actief
        }
    }, [activeOption, user, fetchMealsData]);


    useEffect(() => {
        const loadMeals = async () => {
            const mealsData = await fetchMeals(currentListEndpoint);
            console.log("✅ Received mealsData:", mealsData);

            // ⬇️ Zet de pagina terug als hij buiten bereik is
            if (mealsData.totalPages && page > mealsData.totalPages) {
                setPage(1);
                return; // ⬅️ STOP hier, geen oude data zetten
            }

            // ⬇️ Pas daarna de “echte” data instellen
            setMeals(mealsData.content || []);
            setTotalPages(mealsData.totalPages || 1);
            setError(null);
        };

        loadMeals().catch((err) => {
            console.error("❌ Error loading meals:", err);
            setError(err.message);
        });
    }, [currentListEndpoint, page]);
// ⬅️ Voeg ook 'page' toe als dependency, want we roepen 'setPage' hier aan.



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
        if (user) {
            fetchUserMealsData(); // altijd ophalen zodra user ingelogd is
        }
    }, [user]);



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
