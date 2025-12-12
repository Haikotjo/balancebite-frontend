// ExpandableTitle.jsx
import PropTypes from "prop-types";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

const ExpandableTitle = ({ title, onClick }) => {
    return (
        <CustomTypography
            onClick={onClick}
            variant="h3"
            className="cursor-pointer hover:text-primary line-clamp-2"
        >
            {title}
        </CustomTypography>
    );
};

ExpandableTitle.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func, // optional
};

export default ExpandableTitle;
