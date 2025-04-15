import PropTypes from "prop-types";

const Spinner = ({ className = "" }) => {
    return (
        <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary ${className}`} />
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
};

export default Spinner;
