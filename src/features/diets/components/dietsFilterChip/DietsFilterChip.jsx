import PropTypes from "prop-types";
import { CircleX } from "lucide-react";

import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";

const DietsFilterChip = ({ label, colorClass, onRemove }) => {
    return (
        <CustomBox
            onClick={onRemove}
            className={`flex items-center rounded-full px-3 py-1 cursor-pointer border ${colorClass}`}
        >
            <CustomTypography
                as="span"
                variant="xsmallCard"
                className={`mr-2 ${colorClass}`}
            >
                {label}
            </CustomTypography>
            <CircleX
                size={16}
                className={`${colorClass} stroke-current`}
                onClick={e => {
                    e.stopPropagation();
                    onRemove();
                }}
            />
        </CustomBox>
    );
};

DietsFilterChip.propTypes = {
    label: PropTypes.string.isRequired,
    colorClass: PropTypes.string.isRequired, // e.g. "chip-purple"
    onRemove: PropTypes.func.isRequired,
};

export default DietsFilterChip;
