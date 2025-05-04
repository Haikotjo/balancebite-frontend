import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { macroIcons, macroIconClasses } from "../../utils/helpers/macroIcons.js";
import MyResponsivePie from "../myResponsivePie/MyResponsivePie.jsx";
import AccordionItem from "./AccordionItem.jsx";
import BulletText from "../layout/BulletText.jsx";


const DietDayMetaSection = ({ day }) => {
    const totalNutrients = day.totalNutrients || {};

    return (
        <CustomBox className="mb-4 p-4 rounded-xl border border-border bg-muted dark:bg-mutedDark">
            <CustomTypography className="text-lg font-semibold mb-2">
                {day.dayLabel || `Day ${day.id}`}
            </CustomTypography>

            {day.meals?.length > 0 ? (
                day.meals.map((meal) => (
                    <AccordionItem key={meal.id} title={meal.name} defaultOpen={false} >
                        <CustomBox className="space-y-2">
                            <BulletText showBullet={false}>{meal.mealDescription}</BulletText>

                            <BulletText showBullet={false}>Bereidingstijd: {meal.preparationTime?.replace("PT", "").toLowerCase()}</BulletText>

                            <BulletText showBullet={false}>Ingrediënten:</BulletText>
                            <CustomBox className="pl-4 space-y-1">
                                {meal.mealIngredients?.map((ing) => (
                                    <BulletText key={ing.id} showBullet={false}>
                                        {ing.foodItemName} – {ing.quantity} g
                                    </BulletText>
                                ))}
                            </CustomBox>

                            <BulletText showBullet={false}>Voedingswaarden:</BulletText>
                            <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                <BulletText as="li" showBullet={false}>Calorieën: {meal.totalCalories}  kcal </BulletText>
                                <BulletText as="li" showBullet={false}>Eiwitten: {meal.totalProtein} g</BulletText>
                                <BulletText as="li" showBullet={false}>Koolhydraten: {meal.totalCarbs} g</BulletText>
                                <BulletText as="li" showBullet={false}>Vetten: {meal.totalFat} g</BulletText>
                            </CustomBox>

                            <BulletText showBullet={false}>Type:</BulletText>
                            <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                {meal.mealTypes?.map((type, index) => (
                                    <BulletText as="li" key={index} showBullet={false}>{type}</BulletText>
                                ))}
                            </CustomBox>

                            <BulletText showBullet={false}>Keukens:</BulletText>
                            <CustomBox as="ul" className="pl-4 list-none space-y-1" >
                                {meal.cuisines?.map((cuisine, index) => (
                                    <BulletText as="li" key={index} showBullet={false}>{cuisine}</BulletText>
                                ))}
                            </CustomBox>

                            <BulletText showBullet={false}>Dieetsoorten:</BulletText>
                            <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                {meal.diets?.map((diet, index) => (
                                    <BulletText as="li" key={index} showBullet={false}>{diet}</BulletText>
                                ))}
                            </CustomBox>

                        </CustomBox>
                    </AccordionItem>
                ))
            ) : (
                <CustomTypography variant="h1" className="italic">
                    Geen maaltijden gevonden.
                </CustomTypography>
            )}

            <CustomBox className="flex flex-wrap gap-4">
                {[ "Total lipid (fat) g", "Carbohydrates g", "Protein g" ].map((key) => {
                    const nutrient = totalNutrients[key];
                    if (!nutrient) return null;

                    const Icon = macroIcons[nutrient.nutrientName];
                    const iconClass = macroIconClasses[nutrient.nutrientName];

                    return (
                        <CustomBox key={nutrient.nutrientId} className="flex items-center gap-2">
                            {Icon && <Icon size={20} className={iconClass} />}
                            <CustomTypography variant="xsmallCard">
                                {nutrient.nutrientName}: {Math.round(nutrient.value)} {nutrient.unitName}
                            </CustomTypography>
                        </CustomBox>
                    );
                })}
            </CustomBox>
        </CustomBox>
    );
};

DietDayMetaSection.propTypes = {
    day: PropTypes.object.isRequired,
};

export default DietDayMetaSection;
