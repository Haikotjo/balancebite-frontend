import PropTypes from "prop-types";
import CustomBox from "./CustomBox.jsx";

const Spinner = ({ className = "" }) => {
    return (
        <CustomBox
            className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary ${className}`}
        />
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
};

export default Spinner;
