import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography, { Inline } from "../../../../components/layout/CustomTypography.jsx";
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";

const LastWeekOverview = ({ dailyRdiList }) => {
    return (
        <CustomBox className="flex flex-col gap-2 text-center">
            <CustomTypography variant="h3" className="mt-4">
                Last Week's Overview
            </CustomTypography>

            <CustomTypography variant="xsmallCard" className="mx-4 mb-2" italic>
                Daily values show how much you deviated from your recommended intake.{" "}
                <Inline color="#38adb5" weight="700">Green positive values</Inline>{" "}
                mean you ate less than recommended (remaining intake),{" "}
                <Inline color="#F43F5E" weight="700">red negative values</Inline>{" "}
                mean you ate more than recommended. The closer the value is to zero,
                the more balanced your intake was for that nutrient. Your weekly and
                monthly pattern is more important than any single day.
            </CustomTypography>

            <CustomBox className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...dailyRdiList]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(({ date, data }) => {
                        const daysAgo = Math.floor((new Date() - new Date(date)) / 86400000);
                        const label = daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;

                        return (
                            <CustomCard key={date} hasBorder>
                                <RecommendedNutritionDisplay
                                    variant="date"
                                    data={data}
                                    newCustomTitle={label}
                                />
                            </CustomCard>
                        );
                    })}
            </CustomBox>
        </CustomBox>
    );
};

LastWeekOverview.propTypes = {
    dailyRdiList: PropTypes.array.isRequired,
};

export default LastWeekOverview;
