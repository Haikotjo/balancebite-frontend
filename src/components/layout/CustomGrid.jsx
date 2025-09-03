// src/components/layout/CustomGrid.jsx
import PropTypes from "prop-types";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * CustomGrid component — renders its children in a responsive grid layout.
 *
 * @param {object} props
 * @param {React.ReactNode[]} props.children — elements to display in the grid.
 * @returns {JSX.Element}
 */
const CustomGrid = ({ children }) => {
    return (
        // Use CustomBox for consistent box-border handling across web & native
        <CustomBox
            as="div"
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                2xl:grid-cols-4
                gap-4
                py-4
                {/*max-w-[1600px]*/}
                mx-auto
            "
        >
            {children}
        </CustomBox>
    );
};

CustomGrid.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CustomGrid;
