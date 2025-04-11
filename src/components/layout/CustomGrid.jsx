// src/components/layout/CustomGrid.jsx
import PropTypes from "prop-types";

const CustomGrid = ({ children }) => {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 max-w-[1600px] mx-auto">
            {children}
        </div>
    );
};

CustomGrid.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CustomGrid;
