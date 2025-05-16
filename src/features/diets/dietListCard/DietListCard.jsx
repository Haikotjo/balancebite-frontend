import PropTypes from "prop-types";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../components/layout/CustomCard.jsx";
import AccordionItem from "../components/accordionItem/AccordionItem.jsx";
import DietDayAccordion from "../components/dietDayAccordion/DietDayAccordion.jsx";
import CustomDivider from "../../../components/layout/CustomDivider.jsx";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import { UserPen } from "lucide-react";
import {getAverageNutrients} from "../utils/helpers/getAverageNutrients.js";
import MacroSummary from "../components/macroSummary/MacroSummary.jsx";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HorizontalScrollSection from "../../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import MealCardCompact from "../../meals/components/mealCardCompact/MealCardCompact.jsx";

const DietListCard = ({ diet, compact = false }) => {
    console.log("DietListCard received diet:", diet);
    const averages = getAverageNutrients(diet.dietDays);
    const navigate = useNavigate();
    const allMeals = diet.dietDays.flatMap((day) => day.meals || []);

    return (
        <CustomCard className="p-4">
            {/* Diet title with navigation link */}
            <CustomBox
                onClick={() => navigate(`/diet/${diet.id}`)}
                className="mb-2 cursor-pointer flex items-center gap-2 text-primary"
            >
                <CustomTypography variant="h4" className="hover:text-primary">
                    {diet.name}
                </CustomTypography>
                <ChevronRight size={18} />
            </CustomBox>

            <CustomDivider className="my-2" />

            {/* Diet description (if provided) */}
            {diet.dietDescription && (
                <>
                    <CustomTypography variant="paragraph" className="mb-4 italic">
                        {diet.dietDescription}
                    </CustomTypography>
                    <CustomDivider className="mb-2" />
                </>
            )}

            {/* Average daily macro breakdown */}
            {averages && (
                <CustomBox>
                    <CustomTypography variant="small" className="my-2 italic">
                        Average daily intake:
                    </CustomTypography>
                    <MacroSummary
                        className="mb-2"
                        totalNutrients={{
                            "Energy kcal": { value: Math.round(averages.avgCalories) },
                            "Protein g": { value: Math.round(averages.avgProtein) },
                            "Total lipid (fat) g": { value: Math.round(averages.avgFat) },
                            "Carbohydrates g": { value: Math.round(averages.avgCarbs) },
                        }}
                    />
                    <CustomDivider className="my-4" />
                </CustomBox>
            )}


            {/* All diet days */}
            {!compact && diet.dietDays.map((day) => (
                <DietDayAccordion key={day.id} day={day} />
            ))}

            {!compact && <CustomDivider className="my-4" />}

            {/* Scrollable overview of all meals in the diet */}
            {allMeals.length > 0 && (
                <AccordionItem
                    title={
                        <CustomTypography variant="paragraphCard">
                            Meals in diet
                        </CustomTypography>
                    }
                    defaultOpen={!compact}
                    headerClassName="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <HorizontalScrollSection
                        items={allMeals}
                        renderItem={(meal) => <MealCardCompact meal={meal} />}
                        className="my-0 py-0"
                    />
                </AccordionItem>
            )}

            {/* Creator info (if available) */}
            {!compact && diet.createdBy?.userName && (
                <CustomBox className="mt-4 flex items-center gap-1">
                    <UserPen size={14} />
                    <CustomTypography variant="xsmallCard" className="italic">
                        {diet.createdBy.userName}
                    </CustomTypography>
                </CustomBox>
            )}
        </CustomCard>
    );
};

DietListCard.propTypes = {
    diet: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        dietDescription: PropTypes.string,
        createdBy: PropTypes.shape({
            userName: PropTypes.string.isRequired,
        }),
        dietDays: PropTypes.array.isRequired,
    }).isRequired,
    compact: PropTypes.bool,
};


export default DietListCard;
