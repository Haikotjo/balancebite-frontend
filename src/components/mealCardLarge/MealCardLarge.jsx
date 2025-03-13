import PropTypes from "prop-types";
import { Card, CardContent, Typography, Box, CardMedia, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme, Chip } from "@mui/material";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";
import MealCardActionButtons from "../mealCard/mealCardActionButtons/MealCardActionButtons.jsx";
import {formatEnum} from "../filterSidebar/helper/formatEnum.js";
import {getImageSrc} from "../../utils/helpers/getImageSrc.js";
import CustomChip from "./customChip/CustomChip.jsx";
import {calculateMacrosPer100g} from "../../utils/helpers/calculateMacrosPer100g.js";

const MealCardLarge = ({ meal }) => {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up("md"));
    const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
    const imageSrc = getImageSrc(meal);
    const calculatedMacros = calculateMacrosPer100g(meal);
    const macros = {
        Calories: { total: Math.round(meal.totalCalories), per100g: Math.round(calculatedMacros.caloriesPer100g), unit: "kcal" },
        Protein: { total: Math.round(meal.totalProtein), per100g: Math.round(calculatedMacros.proteinPer100g), unit: "g" },
        Carbs: { total: Math.round(meal.totalCarbs), per100g: Math.round(calculatedMacros.carbsPer100g), unit: "g" },
        Fats: { total: Math.round(meal.totalFat), per100g: Math.round(calculatedMacros.fatsPer100g), unit: "g" }
    };

    return (
        <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, height: "auto", position: "relative" }}>
            <Box sx={{
                position: "relative",
                width: { xs: "100%", md: "50%" },
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }}>
                <Box sx={{ flexGrow: 1, position: "relative" }}>
                    <CardMedia
                        component="img"
                        image={imageSrc}
                        alt={meal.name}
                        sx={{ width: "100%", height: { xs: 200, md: "100%" }, objectFit: "cover" }}
                    />

                    <Box sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: theme.palette.text.light,
                        padding: "5px 10px",
                    }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            {`Created By: ${meal.createdBy?.userName}`}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            {`User Count: ${meal.userCount}`}
                        </Typography>
                    </Box>
                </Box>

                <MealCardActionButtons meal={meal} showOpenMealButton={false} />
            </Box>


            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {Array.isArray(meal.cuisine) ? meal.cuisine.map((cuisine, index) => (
                            <CustomChip key={index} label={formatEnum(cuisine)} color="primary" />
                        )) : (
                            <CustomChip label={formatEnum(meal.cuisine)} color="primary" />
                        )}

                        {Array.isArray(meal.diet) ? meal.diet.map((diet, index) => (
                            <CustomChip key={index} label={formatEnum(diet)} color="secondary" />
                        )) : (
                            <CustomChip label={formatEnum(meal.diet)} color="secondary" />
                        )}

                        {Array.isArray(meal.mealType) ? meal.mealType.map((type, index) => (
                            <CustomChip key={index} label={formatEnum(type)} color="success" />
                        )) : (
                            <CustomChip label={formatEnum(meal.mealType)} color="success" />
                        )}
                    </Box>
                    <Typography variant="h2" gutterBottom>
                        {meal.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {meal.mealDescription}
                    </Typography>
                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        Total Macros
                    </Typography>
                    <List>
                        {Object.entries(macros).map(([key, macro]) => (
                            <ListItem key={key} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <ListItemIcon>
                                        {key === "Calories" && <Flame size={30} />}
                                        {key === "Protein" && <Dumbbell size={30} />}
                                        {key === "Carbs" && <ChartColumnIncreasing size={30} />}
                                        {key === "Fats" && <Droplet size={30} />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${key}: ${macro.total} ${macro.unit}`}
                                        secondary={
                                            <Typography variant="body2" color="textSecondary">
                                                {`(${macro.per100g} per 100g)`}
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </ListItem>

                        ))}
                    </List>

                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <Typography variant="h6" gutterBottom>
                        Ingredients:
                    </Typography>
                    <List>
                        {meal.mealIngredients?.map((ingredient) => (
                            <ListItem key={ingredient.id}>
                                <ListItemText primary={`${ingredient.foodItemName} - ${ingredient.quantity}g`} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Box>
        </Card>
    );
};

MealCardLarge.propTypes = {
    meal: PropTypes.object.isRequired,
};

export default MealCardLarge;