import PropTypes from "prop-types";
import {
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import { getImageSrc } from "../../utils/helpers/getImageSrc.js";
import { calculateMacrosPer100g } from "../../utils/helpers/calculateMacrosPer100g.js";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ExpandableDescription from "../expandableDescription/ExpandableDescription.jsx";
import MealInfoOverlay from "../mealInfoOverlay/MealInfoOverlay.jsx";
import MealTags from "../mealTags/MealTags.jsx";
import { useNavigate } from "react-router-dom";
import {useContext, useState} from "react";
import { UserMealsContext } from "../../context/UserMealsContext.jsx";
import ExpandableTitle from "../expandableTitle/ExpandableTitle.jsx";
import PreparationTimeIcon from "../preparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardMacrosSection from "../MealCardMacrosSection/MeaCardlMacrosSection.jsx";
import { buildMacrosObject } from "../../utils/helpers/buildMacrosObject.js";
import CustomCard from "../layout/CustomCard.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import clsx from "clsx";
import CustomImage from "../layout/CustomImage.jsx";
import { Flame, ChartColumnIncreasing, Dumbbell, Droplet } from "lucide-react";
import CustomDivider from "../layout/CustomDivider.jsx";
import { ChevronUp, ChevronDown } from "lucide-react";

const MealDetailCard = ({ meal, isModal = false, onClose, isListItem = false, onOpenAsModal }) => {
    const { userMeals } = useContext(UserMealsContext);
    const userMealMatch = userMeals.find(m => String(m.originalMealId) === String(meal.id));
    const mealToRender = userMealMatch || meal;
    const showUpdateButton = userMeals.some((m) => m.id === meal.id);
    const [showMacros, setShowMacros] = useState(!isListItem);

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
        <CustomCard
            className={clsx(
                "flex w-full box-border",
                isListItem ? "flex-col" : "flex-row",
                isModal ? "max-w-full h-full m-0 mt-0" : "max-w-[1000px] h-auto mx-auto mt-4"
            )}
        >

        {/* Image Section */}
            <CustomBox className={clsx(
                "relative w-full flex flex-col justify-start shrink-0",
                !isListItem && "md:w-1/2"
            )}>
                <CustomBox className="relative aspect-[4/3] w-full shadow-[8px_8px_12px_rgba(0,0,0,0.8)] overflow-hidden rounded-md">
                    <CustomImage
                        src={imageSrc}
                        alt={mealToRender.name}
                        className="rounded-md"
                    />
                    <MealInfoOverlay meal={mealToRender} fontSize="0.8rem" />
                    {mealToRender.preparationTime && (
                        <CustomBox className="absolute top-[15px] left-[10px]">
                            <PreparationTimeIcon preparationTime={mealToRender.preparationTime} />
                        </CustomBox>
                    )}
                    <MealCardActionButtons
                        meal={mealToRender}
                        showOpenMealButton={isListItem}
                        showUpdateButton={showUpdateButton}
                        onOpenAsModal={onOpenAsModal}
                    />
                </CustomBox>

                {/* MealTags onderaan de image op md+ */}
                <CustomBox className="hidden md:flex px-2 py-1 mt-2">
                    <MealTags
                        cuisines={mealToRender.cuisines}
                        diets={mealToRender.diets}
                        mealTypes={mealToRender.mealTypes}
                        onFilter={handleFilterRedirect}
                        forceExpand
                    />
                </CustomBox>
            </CustomBox>

            {/* Details Section */}
            <CustomBox className="flex flex-col flex-1 p-2">
            <CardContent>
                    <CustomBox className="flex md:hidden">
                        <MealTags
                            cuisines={mealToRender.cuisines}
                            diets={mealToRender.diets}
                            mealTypes={mealToRender.mealTypes}
                            onFilter={handleFilterRedirect}
                        />
                    </CustomBox>

                    <ExpandableTitle title={mealToRender.name} />
                <CustomDivider className="my-6" />

                <CustomBox className="mb-6">
                    <ExpandableDescription description={mealToRender.mealDescription} />
                    <CustomDivider className="my-6" />
                </CustomBox>

                {isListItem && (
                    <CustomBox
                        onClick={() => setShowMacros(prev => !prev)}
                        className={clsx(
                            "my-4 rounded-md p-3 cursor-pointer transition-all duration-300",
                            "bg-lightBackground dark:bg-darkBackground",
                            "shadow-md border border-borderLight dark:border-borderDark"
                        )}
                    >
                        {!showMacros && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <Flame size={16} className="text-error" />
                                    <Dumbbell size={16} className="text-primary" />
                                    <ChartColumnIncreasing size={16} className="text-success" />
                                    <Droplet size={16} className="text-secondary" />
                                    <span className="text-sm">Nutrition</span>
                                </div>
                                <ChevronDown size={18} />
                            </div>
                        )}

                        {showMacros && (
                            <>
                                <MealCardMacrosSection macros={macros} />
                                <div className="flex justify-center mt-4">
                                    <ChevronUp size={18} />
                                </div>
                            </>
                        )}
                    </CustomBox>
                )}


                <CustomDivider className="my-6" />

                <Typography variant="h6" gutterBottom>
                        Ingredients:
                    </Typography>
                    <List sx={{ padding: 0 }}>
                        {mealToRender.mealIngredients?.map((ingredient) => (
                            <ListItem key={ingredient.id} sx={{ py: 0.3 }}>
                                <ListItemIcon sx={{ minWidth: "24px" }}>
                                    <FiberManualRecordIcon sx={{ fontSize: "0.6rem", color: theme.palette.primary.main }} />
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
            </CustomBox>
        </CustomCard>
    );
};

MealDetailCard.propTypes = {
    meal: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    onClose: PropTypes.func,
    isListItem: PropTypes.bool,
    onOpenAsModal: PropTypes.func,
};

export default MealDetailCard;
