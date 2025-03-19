// import {useState, useEffect, useContext} from "react";
// import {fetchMealById, fetchMealNutrientsById, fetchMeals} from "../services/apiService.js";
// import {UserMealsContext} from "../context/UserMealsContext.jsx";
//
// /**
//  * Custom hook to fetch meal data and nutrients based on a given meal ID.
//  *
//  * @param {number} mealId - The ID of the meal to fetch.
//  * @returns {Object} - Contains meal data, nutrients, loading states, and error states.
//  */
// export function useMeal(mealId) {
//     const [meal, setMeal] = useState(null); // Stores the fetched meal data
//     const [nutrients, setNutrients] = useState([]); // Stores fetched nutrients
//
//     const [loadingNutrients, setLoadingNutrients] = useState(true); // Indicates loading state for nutrients
//
//     const [nutrientError, setNutrientError] = useState(null); // Stores error messages for nutrients
//     const { currentListEndpoint, setMeals, setLoading, setError, loading, error } = useContext(UserMealsContext);
//
//
//
//     useEffect(() => {
//         if (!mealId) {
//             console.warn("Meal ID is not provided. Skipping fetch."); // Log missing mealId
//             setLoading(false);
//             setLoadingNutrients(false);
//             return;
//         }
//
//         // Fetch meal data
//         const fetchMealData = async () => {
//             setLoading(true);
//             try {
//                 const mealData = await fetchMealById(mealId);
//                 setMeal(mealData);
//                 setError(null);
//             } catch (err) {
//                 console.error("Error fetching meal data:", err.message);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         // Fetch nutrients data
//         const fetchNutrientsData = async () => {
//             setLoadingNutrients(true);
//             try {
//                 const nutrientsData = await fetchMealNutrientsById(mealId);
//                 setNutrients(nutrientsData);
//                 setNutrientError(null);
//             } catch (err) {
//                 console.error("Error fetching nutrients:", err.message);
//                 setNutrientError(err.message);
//             } finally {
//                 setLoadingNutrients(false);
//             }
//         };
//
//         // Call the functions
//         void fetchMealData();
//         void fetchNutrientsData();
//     }, [mealId]); // Re-run the effect if mealId changes
//
//
//     /**
//      * Fetch the list of meals from the current endpoint.
//      */
//     const refreshList = async () => {
//         setLoading(true);
//         try {
//             console.log("🔄 Refreshing meals from:", currentListEndpoint);
//             const mealsData = await fetchMeals(currentListEndpoint);
//             setMeals(mealsData);
//             setError(null);
//         } catch (err) {
//             console.error("❌ Error fetching meals:", err.message);
//             setError(err.message);
//         } finally {
//             setLoading(false);
//             console.log("🛑 Refresh process finished");
//         }
//     };
//
//     return {
//         meal,
//         nutrients,
//         loading,
//         loadingNutrients,
//         error,
//         nutrientError,
//         refreshList,
//     };
// }
