import PropTypes from "prop-types";

const CustomGrid = ({ children }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 p-4 max-w-[1600px] mx-auto">
            {children}
        </div>
    );
};

CustomGrid.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CustomGrid;
