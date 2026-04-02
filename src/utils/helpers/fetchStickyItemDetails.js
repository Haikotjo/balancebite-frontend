import Interceptor from "../../services/authInterceptor.js";

/**
 * Fetches detailed data for sticky items (meals and diet plans) by referenceId.
 * Uses public endpoints so no token is required.
 * @param {Array} items - List of sticky items from the backend.
 * @returns {Object} - An object containing arrays: { meals, diets }
 */
const fetchStickyItemDetails = async (items) => {
    const meals = [];
    const diets = [];

    console.log("[fetchStickyItemDetails] raw items:", items);

    for (const item of items) {
        try {
            if (item.type === "MEAL") {
                const res = await Interceptor.get(`/meals/${item.referenceId}`);
                console.log("[fetchStickyItemDetails] meal fetched:", res.data);
                meals.push(res.data);
            } else if (item.type === "DIET_PLAN") {
                console.log("[fetchStickyItemDetails] fetching diet plan id:", item.referenceId);
                const res = await Interceptor.get(`/public/diet-plans/${item.referenceId}`);
                console.log("[fetchStickyItemDetails] diet fetched:", res.data);
                diets.push(res.data);
            }
        } catch (err) {
            console.warn(`[fetchStickyItemDetails] Skipping sticky ${item.type} ${item.referenceId}:`, err?.response?.status, err?.response?.data);
        }
    }

    console.log("[fetchStickyItemDetails] result → meals:", meals, "diets:", diets);
    return { meals, diets };
};

export default fetchStickyItemDetails;