import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {fetchDiets, getAllUserDietPlansApi, getCreatedDietPlansApi} from "../services/apiService";

export const UserDietsContext = createContext();

export const UserDietsProvider = ({ children }) => {
    const [diets, setDiets] = useState([]);
    const [userDiets, setUserDiets] = useState([]);
    const [loadingUserDiets, setLoadingUserDiets] = useState(false);
    const [loadingDiets, setLoadingDiets] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState(null);
    const [activeOption, setActiveOption] = useState("All Diets");
    const [currentListEndpoint, setCurrentListEndpoint] = useState("");
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");


    const fetchDietsData = useCallback(async () => {
        if (!currentListEndpoint) return;

        setLoadingDiets(true);
        try {
            let dietsData;

            if (activeOption === "Created Diets") {
                dietsData = await getCreatedDietPlansApi(page - 1, 12);
            } else {
                const params = new URLSearchParams();
                params.set("sortBy", sortKey);
                params.set("sortOrder", sortOrder);
                params.set("page", page - 1);
                params.set("size", 12);

                const fullUrl = `${currentListEndpoint}?${params.toString()}`;

                dietsData = await fetchDiets(fullUrl);
            }

            setDiets(dietsData.content || []);
            setTotalPages(dietsData.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching diets:", err);
            setError(err.message);
        } finally {
            setLoadingDiets(false);
        }
    }, [currentListEndpoint, activeOption, page, sortBy, sortOrder]);


    const fetchUserDietsData = useCallback(async () => {
        setLoadingUserDiets(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const userDietsData = await getAllUserDietPlansApi(
                    token,
                    0,           // page
                    12,          // size
                    [],          // diets (leeg = geen filter)
                    "name",      // sortBy
                    "asc"        // sortOrder
                );
                setUserDiets(Array.isArray(userDietsData.content) ? userDietsData.content : []);
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

        if (sortKey && sortOrder) {
            baseUrl += `&sortBy=${sortKey}&sortOrder=${sortOrder}`;
        }

        if (baseUrl !== currentListEndpoint) {
            setCurrentListEndpoint(baseUrl);
        }
    }, [activeOption, filters, sortKey, sortOrder, page]);

    useEffect(() => {
        if (!currentListEndpoint) return;
        fetchDietsData();

        if (activeOption === "My Diets" && user) {
            fetchUserDietsData();
        }
    }, [currentListEndpoint, user]);


    useEffect(() => {
        if (user) {
            fetchUserDietsData();
        }
    }, [user]);

    const replaceDietInDiets = (originalDietId, newDiet) => {
        setDiets((prevDiets) =>
            prevDiets.map((diet) =>
                String(diet.id) === String(originalDietId) ? newDiet : diet
            )
        );
    };

    const removeDietFromUserDiets = (dietId) => {
        setDiets((prevDiets) => prevDiets.filter((diet) => diet.id !== dietId));
    };

    const addDietToUserDiets = (diet) => {
        setUserDiets((prev) => [...prev, diet]);
    };

    const removeDietFromDiets = (dietId) => {
        setDiets((prev) => prev.filter((diet) => diet.id !== dietId));
    };

    return (
        <UserDietsContext.Provider
            value={{
                diets,
                userDiets,
                loading: loadingDiets || loadingUserDiets,
                error,
                activeOption,
                setActiveOption,
                filters,
                setFilters,
                sortKey,
                setSortKey,
                sortOrder,
                setSortOrder,
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
