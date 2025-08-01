import {createContext, useContext, useState, useEffect, useCallback, useRef} from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import {
    getAllPublicDietPlans,
    getAllUserDietPlans, getPublicDietPlanByIdApi, getUserDietPlanByIdApi
} from "../services/apiService";

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
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [activeOption, setActiveOption] = useState("All Diets");
    const [favoriteDiets, setFavoriteDiets] = useState([]);
    const [creatorIdFilter, setCreatorIdFilter] = useState(null);
    const [itemsPerPage] = useState(6);


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
                "createdAt", "name",
                "saveCount", "weeklySaveCount", "monthlySaveCount"
            ];

            const safeSortKey = validSortKeys.includes(sortKey) ? sortKey : "createdAt";

            const baseParams = {
                page: page - 1,
                size: itemsPerPage,
                sortOrder,
                ...filters,
                ...(filters.requiredDiets ? { requiredDiets: filters.requiredDiets } : {}),
                ...(filters.excludedDiets ? { excludedDiets: filters.excludedDiets } : {}),
                ...(creatorIdFilter ? { createdByUserId: creatorIdFilter } : {})
            };

            const params = overrideParams || {
                ...baseParams,
                sortBy: safeSortKey // <-- force hier de juiste key
            };

            let data;

            if (activeOption === "Created Diets") {
                data = await getAllUserDietPlans(token, { ...params, mode: "created" });
                setDiets(data.content || []);
            } else if (activeOption === "My Diets") {
                data = await getAllUserDietPlans(token, { ...params, mode: "saved" });
                setDiets(data.content || []);
            } else {
                data = await getAllPublicDietPlans(params);
                const content = data.content || [];
                let originals = content.filter(diet =>
                    !userCreatedDiets.find(copy => String(copy.originalDietId) === String(diet.id))
                );

                let replacements = content
                    .map(diet => {
                        const copy = userCreatedDiets.find(
                            (d) => String(d.originalDietId) === String(diet.id)
                        );
                        return copy || null;
                    })
                    .filter(Boolean);

                if (["saveCount", "weeklySaveCount", "monthlySaveCount"].includes(safeSortKey)) {
                    originals.sort((a, b) => {
                        const aVal = a[safeSortKey] ?? 0;
                        const bVal = b[safeSortKey] ?? 0;
                        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                    });
                }


                let replaced = [...originals, ...replacements].sort((a, b) => {
                    const aVal = a[safeSortKey] ?? 0;
                    const bVal = b[safeSortKey] ?? 0;
                    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                });

                setDiets(replaced);
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

    const getDietById = useCallback(async (dietId) => {
        try {
            return await getUserDietPlanByIdApi(dietId);
        } catch {
            try {
                return await getPublicDietPlanByIdApi(dietId);
            } catch {
                return null;
            }
        }
    }, []);

    useEffect(() => {
        const currentParams = {
            page: page - 1,
            size: itemsPerPage,
            sortBy: sortKey,
            sortOrder,
            ...filters,
            ...(creatorIdFilter ? { createdByUserId: creatorIdFilter } : {})
        };

        const run = async () => {
            if (!user) {
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
            ...prev.filter(d =>
                String(d.id) !== String(originalDietId) &&
                String(d.id) !== String(newDiet.id)
            ),
            newDiet
        ]);

        setUserDiets(prev => [
            ...prev.filter(d =>
                String(d.id) !== String(originalDietId) &&
                String(d.id) !== String(newDiet.id)
            ),
            newDiet
        ]);

        setFavoriteDiets(prev => [
            ...prev.filter(d =>
                String(d.id) !== String(originalDietId) &&
                String(d.id) !== String(newDiet.id)
            ),
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
                getDietById,
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
