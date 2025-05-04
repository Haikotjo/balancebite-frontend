// components/dietCard/c.jsx
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import DietDayCard from "../dietDayCard/DietDayCard.jsx";
import DietDayMetaSection from "./DietDayMetaSection.jsx";


const DietCard = ({ diet }) => {
    return (
        <CustomBox className="w-full  p-4 border border-borderLight rounded-xl shadow-md bg-cardLight dark:bg-cardDark">
            <CustomTypography className="text-2xl font-bold text-primary mb-4">
                {diet.name}
            </CustomTypography>


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