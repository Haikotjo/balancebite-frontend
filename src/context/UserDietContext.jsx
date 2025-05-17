import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { fetchDiets } from "../services/apiService";

export const UserDietsContext = createContext();

export const UserDietsProvider = ({ children }) => {
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeOption, setActiveOption] = useState("All Diets");
    const [currentListEndpoint, setCurrentListEndpoint] = useState("");
    const { user } = useContext(AuthContext);

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
    }, [fetchDietsData]);

    return (
        <UserDietsContext.Provider
            value={{
                diets,
                loading,
                error,
                activeOption,
                setActiveOption,
                filters,
                setFilters,
                sortBy,
                setSortBy,
                fetchDietsData,
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
