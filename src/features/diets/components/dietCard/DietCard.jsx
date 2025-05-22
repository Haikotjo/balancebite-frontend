import PropTypes from "prop-types";
import DietDayCard from "../dietDayCard/DietDayCard.jsx";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import {formatEnum} from "../../../../utils/helpers/formatEnum.js";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import DietCardActionButtons from "../dietCardActionButtons/DietCardActionButtons.jsx";
import {getAverageNutrients} from "../../utils/helpers/getAverageNutrients.js";
import AverageNutrientSummary from "../averageNutrientSummary/AverageNutrientSummary.jsx";

const DietCard = ({ diet }) => {
    const averages = getAverageNutrients(diet.dietDays);

    return (
        <CustomBox className="w-full p-4 rounded-xl shadow-md bg-cardLight dark:bg-cardDark">
            <CustomBox className="flex flex-wrap justify-between items-start gap-y-2 mb-2">
                <CustomTypography
                    variant="h1"
                    bold
                    className="mr-4 break-words max-w-full"
                >
                    {diet.name}
                </CustomTypography>
                <DietCardActionButtons diet={diet} />
            </CustomBox>

            {diet.createdBy?.userName && (
                <CustomTypography variant="paragraphCard" className="italic mb-2">
                    Created by: {diet.createdBy.userName}
                </CustomTypography>
            )}
            {diet.dietDescription && (
                <CustomBox>
                    <AccordionItem title="Description" defaultOpen={true}>
                        <CustomTypography variant="paragraphCard" className="italic">
                            {diet.dietDescription}
                        </CustomTypography>
                    </AccordionItem>
                </CustomBox>
            )}

            {/* Average daily macro breakdown */}
            {averages && (
                <CustomBox className="my-4">
                    <AverageNutrientSummary averages={averages} dayCount={diet.dietDays.length} showDivider={false} />
                </CustomBox>
            )}

            {diet.diets?.length > 0 && (
                <CustomBox className="mb-4">
                    <AccordionItem title="Diets" >
                        <CustomBox className="flex flex-wrap gap-2 pl-4">
                            {diet.diets.map((dietName, index) => (
                                <CustomTypography
                                    key={index}
                                    variant="paragraphCard"
                                    italic
                                    className="w-full sm:w-[calc(33.333%-0.5rem)]"
                                >
                                    {formatEnum(dietName)}
                                </CustomTypography>
                            ))}
                        </CustomBox>
                    </AccordionItem>
                </CustomBox>
            )}



            {diet.dietDays?.map((day) => (
                <CustomBox key={day.id}>
                    <DietDayCard day={day} />
                </CustomBox>
            ))}

        </CustomBox>
    );
};

DietCard.propTypes = {
    diet: PropTypes.object.isRequired,
};

export default DietCard;