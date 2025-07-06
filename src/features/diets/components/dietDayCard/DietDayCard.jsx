import PropTypes from "prop-types";
import MealCardCompact from "../../../meals/components/mealCardCompact/MealCardCompact.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import BulletText from "../../../../components/layout/BulletText.jsx";
import {formatPreparationTime} from "../../../../utils/helpers/formatPreparationTime.js";
import {macroIconClasses, macroIcons} from "../../../../utils/helpers/macroIcons.js";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import HorizontalScrollSection from "../../../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import MacroSummary from "../macroSummary/MacroSummary.jsx";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { ExternalLink } from "lucide-react";
import PromotionInfo from "../../../../components/promotioninfo/PromotionInfo.jsx";

const DietDayCard = ({ day }) => {

    return (
        <CustomBox className="mb-4 p-4 rounded-xl border border-border bg-muted dark:bg-mutedDark">
            <CustomTypography variant="h2" bold className="mb-2">
                {day.dayLabel}
            </CustomTypography>

            {day.dietDayDescription && (
                <AccordionItem title="Day Description" defaultOpen={true}>
                    <CustomTypography variant="paragraphCard" className="italic">
                        {day.dietDayDescription}
                    </CustomTypography>
                </AccordionItem>
            )}

            <MacroSummary
                className="my-4"
                totalNutrients={{
                    "Energy kcal": { value: Math.round(day.totalCalories) },
                    "Protein g": { value: Math.round(day.totalProtein) },
                    "Carbohydrates g": { value: Math.round(day.totalCarbs) },
                    "Total lipid (fat) g": { value: Math.round(day.totalFat) },
                    "Saturated fat g": { value: Math.round(day.totalSaturatedFat) },
                    "Unsaturated fat g": { value: Math.round(day.totalUnsaturatedFat) },
                    "Sugars g": { value: Math.round(day.totalSugars) },
                }}
            />


            <AccordionItem title="Meals" defaultOpen={true}>
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
                day.meals.map((meal, index) => (
                    <CustomBox key={`${meal.id}-${index}`} className="mb-4">
                        <AccordionItem key={`${meal.id}-${index}`} title={meal.name}>
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
                                                <CustomBox key={ing.id}>
                                                    <BulletText showBullet={false} italic>
                                                        {ing.foodItemName} – {ing.quantity} g
                                                    </BulletText>
                                                    {ing.foodItem?.promoted && (
                                                        <PromotionInfo
                                                            start={ing.foodItem.promotionStartDate}
                                                            end={ing.foodItem.promotionEndDate}
                                                            source={ing.foodItem.source}
                                                            className="ml-6 mt-1"
                                                        />
                                                    )}
                                                </CustomBox>
                                            ))}
                                        </CustomBox>

                                    </AccordionItem>
                                </CustomBox>

                                <CustomBox className="w-full md:w-[calc(50%-0.5rem)]">
                                    <AccordionItem title="Nutrition">
                                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                                            {[
                                                { label: "Calories", key: "totalCalories", unit: "kcal" },
                                                { label: "Protein", key: "totalProtein", unit: "g" },
                                                { label: "Carbs", key: "totalCarbs", unit: "g" },
                                                { label: "Fats", key: "totalFat", unit: "g" },
                                                { label: "Sat Fat", key: "totalSaturatedFat", unit: "g" },
                                                { label: "Unsat Fat", key: "totalUnsaturatedFat", unit: "g" },
                                                { label: "Sugar", key: "totalSugars", unit: "g" }
                                            ].map(({ label, key, unit }) => {
                                                const value = meal[key];
                                                if (value == null) return null;

                                                const Icon = macroIcons[label];
                                                const iconClass = macroIconClasses[label];

                                                return (
                                                    <CustomBox key={label} className="flex items-center gap-2">
                                                        {Icon && <Icon size={16} className={iconClass} />}
                                                        <BulletText as="li" showBullet={false} italic>
                                                            {label}: {Math.round(value)} {unit}
                                                        </BulletText>
                                                    </CustomBox>
                                                );
                                            })}
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
                    </CustomBox>
                ))
            ) : (
                <CustomTypography variant="h1" className="italic">No meals Found</CustomTypography>
            )}

            </AccordionItem>

        </CustomBox>
    );
};

DietDayCard.propTypes = {
    day: PropTypes.object.isRequired,
};

export default DietDayCard;
