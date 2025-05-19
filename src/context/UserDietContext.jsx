import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchDiets } from "../services/apiService";

export const UserDietsContext = createContext();

export const UserDietsProvider = ({ children }) => {
    const [diets, setDiets] = useState([]);
    const [userDiets, setUserDiets] = useState([]);
    const [loadingUserDiets, setLoadingUserDiets] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [activeOption, setActiveOption] = useState("All Diets");
    const [currentListEndpoint, setCurrentListEndpoint] = useState("");


    const fetchDietsData = useCallback(async () => {
        if (!currentListEndpoint) return;

        setLoading(true);
        try {
            const dietsData = await fetchDiets(currentListEndpoint);
            setDiets(dietsData.content || []);
            setTotalPages(dietsData.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching diets:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentListEndpoint]);

    const fetchUserDietsData = useCallback(async () => {
        setLoadingUserDiets(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const response = await fetchDiets("/users/diet-plans");
                setUserDiets(Array.isArray(response.content) ? response.content : []);
            }
        } catch (err) {
            console.error("⚠️ Failed to fetch user diets:", err.message);
            setUserDiets([]);
        } finally {
            setLoadingUserDiets(false);
        }
    }, []);


    useEffect(() => {
        let baseUrl =
            activeOption === "My Diets"
                ? `/users/diet-plans?page=${page - 1}&size=12`
                : activeOption === "Created Diets"
                    ? `/users/diet-plans/created?page=${page - 1}&size=12`
                    : `/public/diet-plans?page=${page - 1}&size=12`;

        Object.entries(filters).forEach(([key, value]) => {
            baseUrl += `&${key}=${encodeURIComponent(value)}`;
        });

        if (sortBy?.sortKey && sortBy?.sortOrder) {
            baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
        }

        if (baseUrl !== currentListEndpoint) {
            setCurrentListEndpoint(baseUrl);
        }
    }, [activeOption, filters, sortBy, page]);

    useEffect(() => {
        fetchDietsData();

        if (activeOption === "My Diets" && user) {
            fetchUserDietsData();
        }
    }, [activeOption, user, fetchDietsData]);

    useEffect(() => {
        if (user) {
            fetchUserDietsData();
        }
    }, [user]);


    const addDietToUserDiets = (diet) => {
        setUserDiets((prev) => [...prev, diet]);
    };

    const removeDietFromUserDiets = (dietId) => {
        setDiets((prevDiets) => prevDiets.filter((diet) => diet.id !== dietId));
    };

    const removeDietFromDiets = (dietId) => {
        setDiets((prev) => prev.filter((diet) => diet.id !== dietId));
    };


    const replaceDietInDiets = (originalDietId, newDiet) => {
        setDiets((prevDiets) =>
            prevDiets.map((diet) =>
                String(diet.id) === String(originalDietId) ? newDiet : diet
            )
        );
    };

    return (
        <UserDietsContext.Provider
            value={{
                diets,
                userDiets,
                loading: loading || loadingUserDiets,
                error,
                activeOption,
                setActiveOption,
                filters,
                setFilters,
                sortBy,
                setSortBy,
                fetchUserDietsData,
                fetchDietsData,
                addDietToUserDiets,
                removeDietFromUserDiets,
                replaceDietInDiets,
                removeDietFromDiets,
                page,
                setPage,
                totalPages,

            }}
        >
            {children}
        </UserDietsContext.Provider>
    );
};

UserDietsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
