import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const ExpandableTitle = ({ title, mealId }) => {
    const handleNavigate = () => {
        const url = `${window.location.origin}/meal/${mealId}`;
        window.open(url, "_blank");
    };

    return (
        <CustomTypography
            onClick={handleNavigate}
            variant="h3"
            className="cursor-pointer hover:text-primary line-clamp-2"
        >
            {title}
        </CustomTypography>
    );
};


ExpandableTitle.propTypes = {
    title: PropTypes.string.isRequired,
    mealId: PropTypes.string.isRequired,
};

export default ExpandableTitle;
