import {createContext, useContext, useState, useEffect, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {
    getAllPublicDietPlans,
    getAllUserDietPlans
} from "../services/ApiService";

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
    const [sortKey, setSortKey] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [activeOption, setActiveOption] = useState("All Diets");
    const [favoriteDiets, setFavoriteDiets] = useState([]);
    const [creatorIdFilter, setCreatorIdFilter] = useState(null);


    const userDietsRef = useRef(userDiets);
    useEffect(() => {
        userDietsRef.current = userDiets;
    }, [userDiets]);

    const applyUserCopies = useCallback((publicDiets, userCopies) => {
        return publicDiets.map(diet => {
            const copy = userCopies.find(d => String(d.originalDietId) === String(diet.id));
            return copy || diet;
        });
    }, []);

    const fetchDietsData = useCallback(async (userCreatedDiets = [], overrideParams = null) => {
        setLoadingDiets(true);
        try {
            const token = localStorage.getItem("accessToken");

            const validSortKeys = [
                "avgProtein", "avgCarbs", "avgFat", "avgCalories",
                "totalProtein", "totalCarbs", "totalFat", "totalCalories",
                "createdAt", "name"
            ];

            const safeSortKey = validSortKeys.includes(sortKey) ? sortKey : "createdAt";

            const defaultParams = {
                page: page - 1,
                size: 12,
                sortBy: safeSortKey,
                sortOrder,
                ...filters,
                ...(filters.requiredDiets ? { requiredDiets: filters.requiredDiets } : {}),
                ...(filters.excludedDiets ? { excludedDiets: filters.excludedDiets } : {}),
                ...(creatorIdFilter ? { createdByUserId: creatorIdFilter } : {})
            };

            const params = defaultParams;

            // Debug logging: Sorting & Filters
            console.log("🔍 Sorting & Filters Debug", {
                activeOption,
                sortKey: safeSortKey,
                sortOrder,
                filters,
                creatorIdFilter,
                isLoggedIn: !!token,
                params,
            });

            console.group("🎯 Actieve Min/Max Filters");
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    console.log(`${key}: ${value}`);
                }
            });
            console.groupEnd();

            let data;

            if (activeOption === "Created Diets") {
                data = await getAllUserDietPlans(token, { ...params, mode: "created" });
                const content = data.content || [];
                setDiets(content);
                console.log("📦 Resultaten (Created):");
                content.slice(0, 5).forEach((d, i) => {
                    console.log(`#${i + 1}`, d.name, d[safeSortKey], '👤 creatorId:', d.createdBy?.id);

                });
            } else if (activeOption === "My Diets") {
                data = await getAllUserDietPlans(token, { ...params, mode: "saved" });
                const content = data.content || [];
                setDiets(content);
                console.log("📦 Resultaten (Saved):");
                content.slice(0, 5).forEach((d, i) => {
                    console.log(`#${i + 1}`, d.name, d[safeSortKey], '👤 creatorId:', d.createdBy?.id);
                    console.log("    ➜ Diets:", d.diets?.join(", "));
                });
            } else {
                data = await getAllPublicDietPlans(params);
                const content = data.content || [];
                const replaced = applyUserCopies(content, userCreatedDiets);
                setDiets(replaced);
                console.log("📦 Resultaten (Public + Copies):");
                replaced.slice(0, 5).forEach((d, i) => {
                    console.log(`#${i + 1}`, d.name, d[safeSortKey], '👤 creatorId:', d.createdBy?.id);
                    console.log("    ➜ Diets:", d.diets?.join(", "));
                });
            }

            setTotalPages(data.totalPages || 1);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDiets(false);
        }
    }, [activeOption, filters, page, sortKey, sortOrder, creatorIdFilter, applyUserCopies]);


    const fetchUserDietsData = useCallback(async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        setLoadingUserDiets(true);
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const saved = await getAllUserDietPlans(token, { mode: "saved", page: 0, size: 1000 });
                const created = await getAllUserDietPlans(token, { mode: "created", page: 0, size: 1000 });

                const savedList = saved.content || [];
                const createdList = created.content || [];

                setFavoriteDiets(savedList);
                setUserDiets([...createdList, ...savedList]);
            }
        } catch (err) {
            console.error("⚠️ Failed to fetch user diets:", err.message);
            setFavoriteDiets([]);
            setUserDiets([]);
        } finally {
            setLoadingUserDiets(false);
        }
    }, []);

    useEffect(() => {
        const currentParams = {
            page: page - 1,
            size: 12,
            sortBy: sortKey,
            sortOrder,
            ...filters,
            ...(creatorIdFilter ? { createdByUserId: creatorIdFilter } : {})
        };

        console.log("🔍 Sorting & Filters Debug", {
            activeOption,
            sortKey,
            sortOrder,
            filters,
            creatorIdFilter,
            params: currentParams,
            isLoggedIn: !!user
        });

        const run = async () => {
            if (!user) {
                // Niet ingelogd → alleen public diets (géén user copies)
                await fetchDietsData([], currentParams);
                return;
            }

            // Ingelogd
            if (activeOption === "Created Diets" || activeOption === "My Diets") {
                await fetchDietsData([], currentParams);
            } else if (creatorIdFilter) {
                await fetchDietsData([], currentParams);
            } else {
                await fetchUserDietsData();
                await fetchDietsData(userDietsRef.current, currentParams);
            }
        };

        run().catch(console.error);
    }, [
        user,
        activeOption,
        page,
        sortKey,
        sortOrder,
        filters,
        creatorIdFilter,
        fetchDietsData,
        fetchUserDietsData
    ]);


    useEffect(() => {
        if (!user) return;

        const run = async () => {
            await fetchUserDietsData();
        };

        run().catch(console.error);
    }, [user, fetchUserDietsData]);

    const replaceDietInDiets = (originalDietId, newDiet) => {
        setDiets(prev => [
            ...prev.filter(d => String(d.id) !== String(originalDietId)),
            newDiet
        ]);

        setUserDiets(prev => [
            ...prev.filter(d => String(d.id) !== String(originalDietId)),
            newDiet
        ]);

        setFavoriteDiets(prev => [
            ...prev.filter(d => String(d.id) !== String(originalDietId)),
            newDiet
        ]);
    };

    const removeDietFromUserDiets = (dietId) => {
        setUserDiets(prev => prev.filter(diet => String(diet.id) !== String(dietId)));
        setDiets(prev => prev.filter(diet => String(diet.id) !== String(dietId)));
    };

    const addDietToUserDiets = (diet) => {
        setUserDiets(prev => [...prev, diet]);
    };

    const addDietToFavoritesInContext = (diet) => {
        setFavoriteDiets(prev => [...prev, diet]);
    };

    const removeDietFromFavoritesInContext = (dietId) => {
        setFavoriteDiets(prev => prev.filter(d => String(d.id) !== String(dietId)));
    };

    const removeDietFromDiets = (dietId) => {
        setDiets(prev => prev.filter(diet => String(diet.id) !== String(dietId)));
    };

    return (
        <UserDietsContext.Provider
            value={{
                diets,
                userDiets,
                favoriteDiets,
                addDietToFavoritesInContext,
                removeDietFromFavoritesInContext,
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
                creatorIdFilter,
                setCreatorIdFilter,
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
