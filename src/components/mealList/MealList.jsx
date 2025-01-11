import { useEffect, useState, useContext } from "react";
import { fetchMeals } from "../../services/apiService.js";
import MealCard from "../mealCard/MealCard.jsx";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { UserMealsContext } from "../../context/UserMealsContext"; // Import UserMealsContext
import { useNavigate } from "react-router-dom"; // For navigation
import PropTypes from "prop-types";
import CustomButton from "./CreateMealButton/CustomButton.jsx";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

/**
 * A component that fetches and displays a list of meals based on the current endpoint provided by the UserMealsContext.
 */
function MealList({ setCreatedByName }) {
    const [meals, setMeals] = useState([]); // State to store fetched meals
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { currentListEndpoint, updateEndpoint, activeOption, setActiveOption } = useContext(UserMealsContext); // Use updateEndpoint and setActiveOption from context
    const navigate = useNavigate(); // For navigation

    /**
     * Fetch meals from the current endpoint whenever it changes.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const mealsData = await fetchMeals(currentListEndpoint);
                setMeals(mealsData);

                if (mealsData.length > 0 && setCreatedByName) {
                    const createdBy = mealsData[0]?.createdBy?.userName || "Unknown User";
                    setCreatedByName(createdBy);
                }

                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData().catch((err) => console.error("Unhandled error in fetchData:", err));
    }, [currentListEndpoint, setCreatedByName]);

    // Show a loading indicator while data is being fetched
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );

    // Show an error message if fetching meals failed
    if (error)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );

    // Show options to add or view meals if no meals are found
    if (meals.length === 0)
        return (

            <Box
                marginTop={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                minHeight="50vh"
                gap={1} // Consistente ruimte tussen alle elementen
            >
                <Typography variant="h6" gutterBottom>
                    {activeOption === "All Meals" && "No meals available yet!"}
                    {activeOption === "My Meals" && "You haven't saved any meals yet!"}
                    {activeOption === "Created Meals" && "You haven't created any meals yet!"}
                </Typography>
                <CustomButton
                    onClick={() => navigate("/create-meal")}
                    icon={<AddCircleOutlineRoundedIcon />}
                    label="Create a Meal"
                    variant="outlined"
                />

                <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>or</Typography>

                <CustomButton
                    onClick={() => {
                        const newEndpoint = `${import.meta.env.VITE_BASE_URL}/meals`;
                        updateEndpoint(newEndpoint); // Use updateEndpoint from context
                        setActiveOption("All Meals"); // Update the active option in the context
                    }}
                    icon={<MenuBookRoundedIcon />}
                    label="Add a Meal"
                    variant="contained"
                />
            </Box>

        );

    // Render the list of meals
    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={2}
            padding={2}
        >
            {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
            ))}
        </Box>
    );
}

MealList.propTypes = {
    setCreatedByName: PropTypes.func,
};

export default MealList;
