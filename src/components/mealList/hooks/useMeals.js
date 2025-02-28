// import { useEffect, useState, useContext } from "react";
// import { fetchMeals } from "../../../services/apiService.js";
// import { UserMealsContext } from "../../../context/UserMealsContext.jsx";
//
// const useMeals = (setCreatedByName) => {
//     const [meals, setMeals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { currentListEndpoint } = useContext(UserMealsContext);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//
//                 console.log("Fetching from endpoint:", currentListEndpoint);
//
//                 const mealsData = await fetchMeals(currentListEndpoint);
//                 setMeals(mealsData);
//
//                 if (mealsData.length > 0 && setCreatedByName) {
//                     setCreatedByName(mealsData[0]?.createdBy?.userName || "Unknown User");
//                 }
//
//                 setError(null);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData().catch(console.error);
//     }, [currentListEndpoint, setCreatedByName]);
//
//     const refreshList = async () => {
//         try {
//             setLoading(true);
//             const mealsData = await fetchMeals(currentListEndpoint);
//             setMeals(mealsData);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return { meals, loading, error, refreshList };
// };
//
// export default useMeals;
