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
const CustomGridCompact = ({ children }) => {
    return (
        <CustomBox
            as="div"
            className="
                grid
                w-full
                gap-4
                grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))]
            "
        >
            {children}
        </CustomBox>
    );
};

CustomGridCompact.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default CustomGridCompact;
