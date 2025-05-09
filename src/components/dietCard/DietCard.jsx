// components/dietCard/c.jsx
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import DietDayCard from "../dietDayCard/DietDayCard.jsx";
import AccordionItem from "./AccordionItem.jsx";
import {formatEnum} from "../../utils/helpers/formatEnum.js";


const DietCard = ({ diet }) => {
    return (
        <CustomBox className="w-full p-4 rounded-xl shadow-md bg-cardLight dark:bg-cardDark">
            <CustomTypography variant="h1" bold className="mb-2">
                {diet.name}
            </CustomTypography>
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

            {diet.diets?.length > 0 && (
                <CustomBox className="mb-4">
                    <AccordionItem title="Diets" defaultOpen={false}>
                        <CustomBox as="ul" className="pl-4 list-none space-y-1">
                            {diet.diets.map((dietName, index) => (
                                <CustomTypography as="li" key={index} variant="paragraphCard" italic>
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