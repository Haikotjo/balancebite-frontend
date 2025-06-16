import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import DietDayAccordion from "../dietDayAccordion/DietDayAccordion.jsx";
import CustomDivider from "../../../../components/layout/CustomDivider.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import {getAverageNutrients} from "../../utils/helpers/getAverageNutrients.js";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HorizontalScrollSection from "../../../../components/horizontalScrollSection/HorizontalScrollSection.jsx";
import MealCardCompact from "../../../meals/components/mealCardCompact/MealCardCompact.jsx";
import DietCardActionButtons from "../dietCardActionButtons/DietCardActionButtons.jsx";
import AverageNutrientSummary from "../averageNutrientSummary/AverageNutrientSummary.jsx";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";
import {useContext} from "react";
import CustomButton from "../../../../components/layout/CustomButton.jsx";
import { Users, UserPen } from "lucide-react";

const DietListCard = ({ diet, compact = false, isPinned }) => {
    const averages = getAverageNutrients(diet.dietDays);
    const navigate = useNavigate();
    const allMeals = diet.dietDays.flatMap((day) => day.meals || []);
    const { setCreatorIdFilter, setActiveOption } = useContext(UserDietsContext);

    return (
        <CustomCard className="p-4" isPinned={isPinned}>
            <CustomBox className="mb-2 flex gap-2 justify-end">
                <DietCardActionButtons diet={diet} viewMode="list" />
            </CustomBox>
            {/* Diet title with navigation link */}
            <CustomBox
                onClick={() => navigate(`/diet/${diet.id}`)}
                className="mb-2 cursor-pointer flex items-center gap-2 max-w-full min-w-0"
            >
            <CustomTypography variant="h4" className="hover:text-primary break-words truncate max-w-full">
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
                <AverageNutrientSummary averages={averages} dayCount={diet.dietDays.length} />

            )}


            {/* All diet days */}
            {!compact && diet.dietDays.map((day) => (
                <DietDayAccordion key={day.id} day={day} compact />
            ))}

            {!compact && <CustomDivider className="my-4" />}

            {/* Scrollable overview of all meals in the diet */}
            {allMeals.length > 0 && (
                <AccordionItem
                    title={
                        <CustomTypography variant="paragraphCard">
                            All Meals in diet
                        </CustomTypography>
                    }
                    defaultOpen={!compact}
                    headerClassName="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <HorizontalScrollSection
                        items={allMeals}
                        renderItem={(meal) => <MealCardCompact meal={meal} />}
                        className="my-0"
                    />
                </AccordionItem>
            )}

            {/* Creator info (if available) */}
            {(diet.createdBy?.userName || diet.saveCount !== undefined) && (
                <CustomBox className="flex flex-wrap items-center gap-4 mt-2">
                    {diet.createdBy?.userName && (
                        <CustomButton
                            type="button"
                            onClick={() => {
                                setCreatorIdFilter(diet.createdBy.id);
                                setActiveOption("All Diets");
                                if (!window.location.pathname.includes("/diets")) {
                                    navigate("/diets");
                                }
                            }}
                            className="flex items-center gap-1 bg-transparent text-inherit hover:text-primary"
                        >
                            <UserPen size={14} />
                            {diet.createdBy.userName}
                        </CustomButton>
                    )}
                    {diet.saveCount !== undefined && (
                        <CustomTypography
                            variant="paragraphCard"
                            className="italic flex items-center gap-1"
                        >
                            <Users size={14} />
                            {diet.saveCount}
                        </CustomTypography>
                    )}
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
            id: PropTypes.number.isRequired,
            userName: PropTypes.string.isRequired,
        }),
        dietDays: PropTypes.array.isRequired,
        saveCount: PropTypes.number
    }).isRequired,
    compact: PropTypes.bool,
    isPinned: PropTypes.bool,
};


export default DietListCard;
