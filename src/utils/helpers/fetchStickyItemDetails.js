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

    for (const item of items) {
        try {
            if (item.type === "MEAL") {
                const res = await Interceptor.get(`meals/${item.referenceId}`);
                meals.push(res.data);
            } else if (item.type === "DIET_PLAN") {
                const res = await Interceptor.get(`/public/diet-plans/${item.referenceId}`);
                diets.push(res.data);
            }
        } catch (err) {
            console.error(`❌ Failed to fetch ${item.type} with ID ${item.referenceId}`, err);
        }
    }

    return { meals, diets };
};

export default fetchStickyItemDetails;
