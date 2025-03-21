import PropTypes from "prop-types";
import {
    Card,
    CardContent,
    Typography,
    Box,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";
import MealCardActionButtons from "../mealCard/mealCardActionButtons/MealCardActionButtons.jsx";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ExpandableDescription from "../expandableDescription/ExpandableDescription.jsx";
import MealInfoOverlay from "../mealInfoOverlay/MealInfoOverlay.jsx";
import MealTags from "../mealTags/MealTags.jsx";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {UserMealsContext} from "../../context/UserMealsContext.jsx";

const MealDetailCard = ({ meal }) => {
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;

    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));

    const imageSrc = getImageSrc(mealToRender);
    const calculatedMacros = calculateMacrosPer100g(mealToRender);

    const navigate = useNavigate();

    const handleFilterRedirect = (category, value) => {
        navigate(`/meals?${category}=${encodeURIComponent(value)}`);
    };

    const macros = {
        Calories: {
            total: Math.round(meal.totalCalories),
            per100g: Math.round(calculatedMacros.caloriesPer100g),
            unit: "kcal",
        },
        Protein: {
            total: Math.round(meal.totalProtein),
            per100g: Math.round(calculatedMacros.proteinPer100g),
            unit: "g",
        },
        Carbs: {
            total: Math.round(meal.totalCarbs),
            per100g: Math.round(calculatedMacros.carbsPer100g),
            unit: "g",
        },
        Fats: {
            total: Math.round(meal.totalFat),
            per100g: Math.round(calculatedMacros.fatsPer100g),
            unit: "g",
        },
    };


    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row-reverse" },
                width: { xs: "90vw", md: "80vw" },
                minHeight: "auto",
                height: { md: "85vh" },
                maxWidth: "1000px",
                margin: "auto",
                mt: { xs: 2, md: 4 },
                boxShadow: 6,
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            {/* Image Section */}
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardMedia
                    component="img"
                    image={imageSrc}
                    alt={mealToRender.name}
                    sx={{
                        width: "100%",
                        height: { xs: 200, md: "100%" },
                        objectFit: "cover",
                    }}
                />
                <MealInfoOverlay meal={mealToRender} fontSize="0.8rem" />

                <MealCardActionButtons meal={mealToRender} showOpenMealButton={false} />
            </Box>

            {/* Details Section */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
                <CardContent>
                    {/*// MealTags met navigatie*/}
                    <MealTags
                        cuisine={mealToRender.cuisine}
                        diet={mealToRender.diet}
                        mealType={mealToRender.mealType}
                        onFilter={handleFilterRedirect}
                    />

                    {/* Meal Title & Description */}
                    <Typography
                        variant="h4"
                        sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                        gutterBottom
                    >
                        {mealToRender.name}
                    </Typography>

                    <ExpandableDescription description={mealToRender.mealDescription} />

                    {/* Macros Section */}
                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        Total Macros
                    </Typography>
                    <List>
                        {Object.entries(macros).map(([key, macro]) => (
                            <ListItem key={key} sx={{ display: "flex", alignItems: "center" }}>
                                <ListItemIcon>
                                    {key === "Calories" && <Flame size={30} />}
                                    {key === "Protein" && <Dumbbell size={30} />}
                                    {key === "Carbs" && <ChartColumnIncreasing size={30} />}
                                    {key === "Fats" && <Droplet size={30} />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${key}: ${macro.total} ${macro.unit}`}
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                                        >
                                            {`(${macro.per100g} per 100g)`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>

                    {/* Ingredients Section */}
                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <Typography variant="h6" gutterBottom >
                        Ingredients:
                    </Typography>
                    <List sx={{ padding: 0 }}>
                        {mealToRender.mealIngredients?.map((ingredient) => (
                            <ListItem key={ingredient.id} sx={{ py: 0.3 }}>
                                <ListItemIcon sx={{ minWidth: "24px" }}>
                                    <FiberManualRecordIcon sx={{ fontSize: "0.6rem", color: theme.palette.primary.main}} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}>
                                            {`${ingredient.foodItemName} - ${ingredient.quantity}g`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Box>
        </Card>
    );
};

MealDetailCard.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealDetailCard;
