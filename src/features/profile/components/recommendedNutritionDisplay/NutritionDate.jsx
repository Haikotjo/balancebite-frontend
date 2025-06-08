import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const NutritionDate = ({ createdAt }) => {
    return (
        <CustomTypography
            variant="small"
            as="p"
            className="italic mt-2 text-right"
        >
            {createdAt || "N/A"}
        </CustomTypography>
    );
};

NutritionDate.propTypes = {
    createdAt: PropTypes.string,
};

export default NutritionDate;


