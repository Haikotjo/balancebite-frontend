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
    useTheme, Grid,
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
import ExpandableTitle from "../expandableTitle/ExpandableTitle.jsx";

const MealDetailCard = ({ meal }) => {
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;

    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

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
                // height: { md: "85vh" },
                maxWidth: "1000px",
                margin: "auto",
                mt: { xs: 2, md: 4 },
                boxShadow: 3,
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            {/* Image Section */}
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "100%", md: "50%" },
                    height: { xs: 200, md: 400 }, // vaste hoogte op md+
                    flexShrink: 0, // voorkom dat hij kleiner wordt
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "8px 8px 12px rgba(0, 0, 0, 0.8)"
                }}
            >
                <CardMedia
                    component="img"
                    image={imageSrc}
                    alt={mealToRender.name}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 2
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
                        cuisine={mealToRender.cuisines}
                        diet={mealToRender.diets}
                        mealType={mealToRender.mealTypes}
                        onFilter={handleFilterRedirect}
                    />

                    {/* Meal Title & Description */}
                    <ExpandableTitle title={mealToRender.name} />

                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />

                    <ExpandableDescription description={mealToRender.mealDescription} />

                    {/* Macros Section */}
                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <Grid container spacing={2} marginTop={2} marginBottom={3}>
                        {Object.entries(macros).map(([key, macro]) => (
                            <Grid item xs={12} sm={6} key={key}>
                                <Box display="flex" alignItems="flex-start" gap={1}>
                                    <Box sx={{ marginTop: "2px" }}>
                                        <Box sx={{ marginTop: "2px" }}>
                                            {key === "Calories" && <Flame size={isSmall ? 20 : 30} color={theme.palette.error.main} />}
                                            {key === "Protein" && <Dumbbell size={isSmall ? 20 : 30} color={theme.palette.primary.main} />}
                                            {key === "Carbs" && <ChartColumnIncreasing size={isSmall ? 20 : 30} color={theme.palette.success.light} />}
                                            {key === "Fats" && <Droplet size={isSmall ? 20 : 30} color={theme.palette.secondary.main} />}
                                        </Box>

                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body1"
                                            sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" }, fontWeight: 500 }}
                                        >
                                            {key === "Calories"
                                                ? `${key}: ${macro.total}`
                                                : `${key}: ${macro.total} ${macro.unit}`}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: { xs: "0.75rem", md: "0.95rem" } }}
                                        >
                                            {`(${macro.per100g} per 100g)`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

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
