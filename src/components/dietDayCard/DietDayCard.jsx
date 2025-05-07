import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { macroIcons, macroIconClasses } from "../../utils/helpers/macroIcons.js";
import AccordionItem from "../dietCard/AccordionItem.jsx";
import BulletText from "../layout/BulletText.jsx";
import { formatEnum } from "../../utils/helpers/formatEnum.js";
import MealCardCompact from "../MealCardCompact/MealCardCompact.jsx";
import HorizontalScrollSection from "../horizontalScrollSection/HorizontalScrollSection.jsx";
import {formatPreparationTime} from "../../utils/helpers/formatPreparationTime.js";

const DietDayCard = ({ day }) => {
    const totalNutrients = day.totalNutrients || {};

    return (
        <CustomBox className="mb-4 p-4 rounded-xl border border-border bg-muted dark:bg-mutedDark">
            {day.meals?.length > 0 ? (
                <HorizontalScrollSection
                    items={day.meals}
                    className="-mt-2 mb-2"
                    renderItem={(meal) => <MealCardCompact meal={meal} />}
                />
            ) : (
                <CustomBox className="flex justify-center items-center min-h-[20vh]">
                    <CustomTypography as="p" variant="paragraph">No meals found.</CustomTypography>
                </CustomBox>
            )}

            {day.meals?.length > 0 ? (
                day.meals.map((meal) => (
                    <AccordionItem key={meal.id} title={meal.name} defaultOpen={false}>
                        <CustomBox className="space-y-2">
                            <AccordionItem title="Description" defaultOpen={true}>
                                <BulletText showBullet={false}>{meal.mealDescription}</BulletText>
                            </AccordionItem>

                            <CustomBox className="flex flex-wrap gap-4">
                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Preparation time">
                                        <BulletText showBullet={false} variant="paragraphCard" italic>
                                            {formatPreparationTime(meal.preparationTime)}
                                        </BulletText>
                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Ingredients">
                                        <CustomBox className="pl-4 space-y-1">
                                            {meal.mealIngredients?.map((ing) => (
                                                <BulletText key={ing.id} showBullet={false} italic>
                                                    {ing.foodItemName} – {ing.quantity} g
                                                </BulletText>
                                            ))}
                                        </CustomBox>
                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Nutrition">
                                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                            <BulletText as="li" showBullet={false} italic>
                                                Calories: {meal.totalCalories} kcal
                                            </BulletText>
                                            <BulletText as="li" showBullet={false} italic>
                                                Protein: {meal.totalProtein} g
                                            </BulletText>
                                            <BulletText as="li" showBullet={false} italic>
                                                Carbohydrates: {meal.totalCarbs} g
                                            </BulletText>
                                            <BulletText as="li" showBullet={false} italic>
                                                Fat: {meal.totalFat} g
                                            </BulletText>
                                        </CustomBox>
                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Type">
                                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                            {meal.mealTypes?.map((type, index) => (
                                                <BulletText as="li" key={index} showBullet={false} italic>
                                                    {formatEnum(type)}
                                                </BulletText>
                                            ))}
                                        </CustomBox>
                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Cuisine">
                                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                            {meal.cuisines?.map((cuisine, index) => (
                                                <BulletText as="li" key={index} showBullet={false} italic>
                                                    {formatEnum(cuisine)}
                                                </BulletText>
                                            ))}
                                        </CustomBox>
                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Diets">
                                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                            {meal.diets?.map((diet, index) => (
                                                <BulletText as="li" key={index} showBullet={false} italic>
                                                    {formatEnum(diet)}
                                                </BulletText>
                                            ))}
                                        </CustomBox>
                                    </AccordionItem>
                                </CustomBox>
                            </CustomBox>
                        </CustomBox>
                    </AccordionItem>
                ))
            ) : (
                <CustomTypography variant="h1" className="italic">No meals Found</CustomTypography>
            )}

            <CustomBox className="flex flex-wrap gap-4 mt-4">
                {["Total lipid (fat) g", "Carbohydrates g", "Protein g"].map((key) => {
                    const nutrient = totalNutrients[key];
                    if (!nutrient) return null;

                    const Icon = macroIcons[nutrient.nutrientName];
                    const iconClass = macroIconClasses[nutrient.nutrientName];

                    return (
                        <CustomBox key={nutrient.nutrientId} className="flex items-center gap-2">
                            {Icon && <Icon size={20} className={iconClass} />}
                            <CustomTypography variant="paragraphCard">
                                {nutrient.nutrientName}: {Math.round(nutrient.value)} {nutrient.unitName}
                            </CustomTypography>
                        </CustomBox>
                    );
                })}
            </CustomBox>
        </CustomBox>
    );
};

DietDayCard.propTypes = {
    day: PropTypes.object.isRequired,
};

export default DietDayCard;
