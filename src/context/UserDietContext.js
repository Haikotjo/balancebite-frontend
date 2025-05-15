// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import PropTypes from "prop-types";
// import { AuthContext } from "./AuthContext";
//
// export const UserDietsContext = createContext();
//
// export const UserDietsProvider = ({ children }) => {
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const { user } = useContext(AuthContext);
//     const [diets, setDiets] = useState([]);
//     const [userDiets, setUserDiets] = useState([]);
//     const [loadingDiets, setLoadingDiets] = useState(true);
//     const [loadingUserDiets, setLoadingUserDiets] = useState(false);
//     const [error, setError] = useState(null);
//     const [filters, setFilters] = useState({});
//     const [sortBy, setSortBy] = useState(null);
//     const [activeOption, setActiveOption] = useState("All Diets");
//     const [currentListEndpoint, setCurrentListEndpoint] = useState("");
//
//     const fetchDietsData = useCallback(async () => {
//         if (!currentListEndpoint) return;
//
//         setLoadingDiets(true);
//         try {
//             const dietsData = await fetchDiets(currentListEndpoint);
//             setDiets(dietsData.content || []);
//             setTotalPages(dietsData.totalPages || 1);
//             setError(null);
//         } catch (err) {
//             console.error("❌ Error fetching diets:", err);
//             setError(err.message);
//         } finally {
//             setLoadingDiets(false);
//         }
//     }, [currentListEndpoint]);
//
//     const fetchUserDietsData = useCallback(async () => {
//         setLoadingUserDiets(true);
//         try {
//             const token = localStorage.getItem("accessToken");
//             if (token) {
//                 const userDietsData = await fetchUserDiets(token);
//                 setUserDiets(Array.isArray(userDietsData.content) ? userDietsData.content : []);
//             }
//         } catch (error) {
//             console.error("⚠️ Failed to fetch user diets:", error.message);
//             setUserDiets([]);
//         } finally {
//             setLoadingUserDiets(false);
//         }
//     }, []);
//
//     const replaceDietInDiets = (originalDietId, newDiet) => {
//         setDiets((prevDiets) =>
//             prevDiets.map((diet) =>
//                 String(diet.id) === String(originalDietId) ? newDiet : diet
//             )
//         );
//     };
//
//     useEffect(() => {
//         let baseUrl =
//             activeOption === "My Diets"
//                 ? `/users/diets?page=${page - 1}&size=12`
//                 : activeOption === "Created Diets"
//                     ? `/users/created-diets?page=${page - 1}&size=12`
//                     : `/diets?page=${page - 1}&size=12`;
//
//         Object.entries(filters).forEach(([key, value]) => {
//             baseUrl += `&${key}=${encodeURIComponent(value)}`;
//         });
//
//         if (sortBy?.sortKey && sortBy?.sortOrder) {
//             baseUrl += `&sortBy=${sortBy.sortKey}&sortOrder=${sortBy.sortOrder}`;
//         }
//
//         if (baseUrl !== currentListEndpoint) {
//             setCurrentListEndpoint(baseUrl);
//         }
//     }, [activeOption, filters, sortBy, page]);
//
//     useEffect(() => {
//         fetchDietsData();
//
//         if (activeOption === "My Diets" && user) {
//             fetchUserDietsData();
//         }
//     }, [activeOption, user, fetchDietsData]);
//
//     useEffect(() => {
//         if (user) {
//             fetchUserDietsData();
//         }
//     }, [user]);
//
//     const removeDietFromUserDiets = (dietId) => {
//         setUserDiets((prev) => prev.filter((diet) => diet.id !== dietId));
//     };
//
//     const addDietToUserDiets = (diet) => {
//         setUserDiets((prevUserDiets) => [...prevUserDiets, diet]);
//     };
//
//     const removeDietFromDiets = (dietId) => {
//         setDiets((prevDiets) => prevDiets.filter((diet) => diet.id !== dietId));
//     };
//
//     return (
//         <UserDietsContext.Provider
//             value={{
//                 diets,
//                 userDiets,
//                 loading: loadingDiets || loadingUserDiets,
//                 error,
//                 activeOption,
//                 setActiveOption,
//                 filters,
//                 setFilters,
//                 sortBy,
//                 setSortBy,
//                 fetchUserDietsData,
//                 fetchDietsData,
//                 removeDietFromUserDiets,
//                 addDietToUserDiets,
//                 removeDietFromDiets,
//                 replaceDietInDiets,
//                 page,
//                 setPage,
//                 totalPages,
//             }}
//         >
//             {children}
//         </UserDietsContext.Provider>
//     );
// };
//
// UserDietsProvider.propTypes = {
//     children: PropTypes.node.isRequired,
// };
