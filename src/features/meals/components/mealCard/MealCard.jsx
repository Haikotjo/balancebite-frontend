import PropTypes from "prop-types";
import MealCardIngredients from "../mealCardIngredients/MealCardIngredients.jsx";
import MealCardMacrosSection from "../mealCardMacrosSection/MeaCardlMacrosSection.jsx";
import MealCardActionButtons from "../mealCardActionButtons/MealCardActionButtons.jsx";
import MealInfoOverlay from "../mealCardInfoOverlay/MealInfoOverlay.jsx";
import {useNavigate} from "react-router-dom";
import {calculateMacrosPer100g} from "../../utils/helpers/calculateMacrosPer100g.js";
import {buildMacrosObject} from "../../utils/helpers/buildMacrosObject.js";
import PreparationTimeIcon from "../mealCardPreparationTimeIcon/PreparationTimeIcon.jsx";
import MealCardMealTags from "../mealCardMealTags/MealCardMealTags.jsx";
import {getImageSrc} from "../../utils/helpers/getImageSrc.js";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomImage from "../../../../components/layout/CustomImage.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import {AuthContext} from "../../../../context/AuthContext.jsx";
import {useContext} from "react";
import MealShareForm from "../mealshareform/MealShareForm.jsx";

const useAuth = () => useContext(AuthContext);
const MealCard = ({ meal, viewMode = "page", onClose, isPinned = false }) => {
    const imageSrc = getImageSrc(meal);
    const navigate = useNavigate();
    const { user } = useAuth();
    const isCreator = String(user?.id) === String(meal?.createdBy?.id);
    const isDietitian = Array.isArray(user?.roles) && user.roles.includes("DIETITIAN");
    const canShare = isCreator && isDietitian;


    const categoryMap = {
        mealTypes: "mealTypes",
        diets: "diets",
        cuisines: "cuisines",
    };

    const handleFilterRedirect = (category, value) => {

        const mapped = categoryMap[category] || category;
        navigate(`/meals?${mapped}=${value}`);
    };

    const calculatedMacros = calculateMacrosPer100g(meal);
    const macros = buildMacrosObject(meal, calculatedMacros);

    console.log("Current user in MealCard:", user);
    console.log("user.id:", user?.id);
    console.log("meal.createdBy.id:", meal?.createdBy?.id);
    console.log("canShare:", canShare);

    return (
        <CustomBox
            className={`max-w-4xl w-full lg:flex bg-cardLight dark:bg-cardDark rounded-xl shadow-md overflow-hidden border ${
                isPinned ? "border-yellow-500" : "border-border"
            }`}
        >
            {/* Image section */}
            <CustomBox className="h-48 lg:h-auto lg:w-[50%] flex-none relative">
                {/* Afbeelding */}
                <CustomImage
                    src={imageSrc}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                />

                {/* Overlay boven */}
                <CustomBox
                    className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-1 z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CustomBox className="absolute inset-0 rounded-md z-0" />
                    <CustomBox className="flex items-center justify-between w-full z-10">
                        {meal.preparationTime && (
                            <PreparationTimeIcon preparationTime={meal.preparationTime} layout="inline" />
                        )}
                        <MealCardActionButtons
                            meal={meal}
                            showUpdateButton={true}
                            viewMode={viewMode}
                            onClose={onClose}
                        />
                    </CustomBox>
                </CustomBox>

                {/* Overlay onder */}
                <CustomBox
                    className="absolute bottom-0 left-0 w-full z-10 pointer-events-auto cursor-default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MealInfoOverlay meal={meal} fontSize="0.8rem" />
                </CustomBox>
            </CustomBox>

            {/* Content section */}
            <CustomBox className="p-4 flex flex-col justify-between leading-normal">
                <CustomBox className="mb-4">
                    <CustomTypography className="text-4xl font-bold text-primary mb-2">
                        {meal.name}
                    </CustomTypography>

                    <CustomDivider className="my-6" />

                    {canShare && (
                        <CustomBox className="mt-4">
                            <MealShareForm mealId={meal.id} />
                        </CustomBox>
                    )}

                    <CustomTypography className=" italic">
                        {meal.mealDescription}
                    </CustomTypography>
                    <CustomDivider className="my-6" />

                    <MealCardIngredients ingredients={meal.mealIngredients} />
                    <CustomDivider className="my-6" />

                    <MealCardMacrosSection macros={macros} />
                    <CustomDivider className="my-6" />

                    <CustomBox className="flex px-2 py-1 mt-2">
                        <MealCardMealTags
                            cuisines={meal.cuisines}
                            diets={meal.diets}
                            mealTypes={meal.mealTypes}
                            onFilter={(category, value) => {
                                handleFilterRedirect(category, value);
                                if (viewMode === "page" && onClose) onClose();
                            }}
                            forceExpand
                        />
                </CustomBox>
                </CustomBox>

            </CustomBox>
        </CustomBox>
    );
};

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(["page", "list", "modal"]),
    onClose: PropTypes.func,
    isPinned: PropTypes.bool,
};

export default MealCard;
