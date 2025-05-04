import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";
import StaticMealList from "./StaticMealList.jsx";
import DietDayMetaSection from "../dietCard/DietDayMetaSection.jsx";

const DietDayCard = ({ day }) => {
    return (
        <CustomBox className="w-full p-4 border border-borderLight rounded-xl shadow-md bg-cardLight dark:bg-cardDark mb-6">
            <DietDayMetaSection day={day} />
            <CustomBox className="mt-4">
                <StaticMealList meals={day.meals} />
            </CustomBox>
        </CustomBox>
    );
};

DietDayCard.propTypes = {
    day: PropTypes.object.isRequired,
};

export default DietDayCard;
