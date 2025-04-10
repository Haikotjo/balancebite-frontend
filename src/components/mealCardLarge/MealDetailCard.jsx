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
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
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
import PreparationTimeIcon from "../preparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardMacrosSection from "../MealCardMacrosSection/MeaCardlMacrosSection.jsx";
import {buildMacrosObject} from "../../utils/helpers/buildMacrosObject.js";

const MealDetailCard = ({ meal, isModal = false, onClose }) => {
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;
    const showUpdateButton = userMeals.some((m) => m.id === meal.id);

    const theme = useTheme();

    const imageSrc = getImageSrc(mealToRender);
    const navigate = useNavigate();


    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const handleFilterRedirect = (category, value) => {
        if (isModal && onClose) {
            onClose();
        }

        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(mealToRender);
    const macros = buildMacrosObject(meal, calculatedMacros);


    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row-reverse" },
                width: isModal ? "100%" : { xs: "90vw", md: "80vw" },
                maxWidth: isModal ? "100%" : "1000px",
                height: isModal ? "100%" : "auto",
                boxShadow: 3,
                borderRadius: 3,
                overflow: "hidden",
                margin: isModal ? 0 : "auto",
                mt: isModal ? 0 : { xs: 2, md: 4 },
            }}
        >
            {/* Image Section */}
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "100%", md: "50%" },
                    height: { xs: 200, md: "auto" },
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start"
                }}
            >
                <Box sx={{ height: { xs: 200, md: 400 }, position: "relative", boxShadow: "8px 8px 12px rgba(0, 0, 0, 0.8)",}}>
                    <CardMedia
                        component="img"
                        image={imageSrc}
                        alt={mealToRender.name}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 2,
                        }}
                    />
                    <MealInfoOverlay meal={mealToRender} fontSize="0.8rem" />
                    {mealToRender.preparationTime && (
                        <Box sx={{ position: "absolute", top: 15, left: 10 }}>
                            <PreparationTimeIcon preparationTime={mealToRender.preparationTime} />
                        </Box>
                    )}
                    <MealCardActionButtons meal={mealToRender} showOpenMealButton={false}    showUpdateButton={showUpdateButton}/>
                </Box>

                {/* MealTags onderaan de image op md+ */}
                <Box sx={{ display: { xs: "none", md: "flex" }, px: 2, py: 1, mt:2 }}>
                    <MealTags
                        cuisines={mealToRender.cuisines}
                        diets={mealToRender.diets}
                        mealTypes={mealToRender.mealTypes}
                        onFilter={handleFilterRedirect}
                        forceExpand
                    />
                </Box>
            </Box>


            {/* Details Section */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 2 }}>
                <CardContent>
                    {/*// MealTags met navigatie*/}
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <MealTags
                            cuisines={mealToRender.cuisines}
                            diets={mealToRender.diets}
                            mealTypes={mealToRender.mealTypes}
                            onFilter={handleFilterRedirect}
                        />
                    </Box>


                    {/* Meal Title & Description */}
                    <ExpandableTitle title={mealToRender.name} />

                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />

                    <ExpandableDescription description={mealToRender.mealDescription} />

                    {/* Macros Section */}
                    <Divider sx={{ width: "100%", my: 2, borderColor: theme.palette.primary.main }} />
                    <MealCardMacrosSection macros={macros} />

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
    isModal: PropTypes.bool,
    onClose: PropTypes.func,
};

export default MealDetailCard;
