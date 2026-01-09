// RenderSector.jsx
import PropTypes from "prop-types";
import { Sector } from "recharts";

const RenderSector = ({ fill, payload, activeName, ...rest }) => {
    if (payload?.name === "__scale__") return null;

    const isHovered = activeName === payload?.name;

    const finalFill = isHovered
        ? fill
        : activeName === null ? fill : `${fill}90`;

    return (
        <Sector
            {...rest}
            fill={finalFill}
            stroke="none"
            style={{
                cursor: 'pointer',
                transition: 'fill 0.6s ease',
                filter: isHovered ? 'brightness(0.9) saturate(1.2)' : 'none'
            }}
        />
    );
};

RenderSector.propTypes = {
    fill: PropTypes.string,
    activeName: PropTypes.string,
    payload: PropTypes.shape({
        name: PropTypes.string,
        fill: PropTypes.string,
    }),
};

export default RenderSector;