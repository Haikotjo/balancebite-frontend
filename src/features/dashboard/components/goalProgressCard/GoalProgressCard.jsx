// src/features/dashboard/components/goalProgressOverview/GoalProgressCard.jsx
import PropTypes from "prop-types";
import CustomCard from "../../../../components/layout/CustomCard.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import RecommendedNutritionDisplay from "../recommendedNutritionDisplay/RecommendedNutritionDisplay.jsx";

const GoalProgressCard = ({ variant, data, description }) => {
    return (
        <CustomCard hasBorder>
            <RecommendedNutritionDisplay variant={variant} data={data} />
            {description && (
                <CustomTypography variant="xsmallCard" className="m-2" italic>
                    {description}
                </CustomTypography>
            )}
        </CustomCard>
    );
};

GoalProgressCard.propTypes = {
    variant: PropTypes.oneOf([
        "today",
        "base",
        "date",
        "week",
        "month",
        "weekAverage",
        "monthAverage",
    ]).isRequired,
    data: PropTypes.object,
    description: PropTypes.string,
};

export default GoalProgressCard;
