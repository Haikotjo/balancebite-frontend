import PropTypes from "prop-types";

import { CircleX } from "lucide-react";
import CustomBox from "../../../components/layout/CustomBox.jsx";
import CustomTypography from "../../../components/layout/CustomTypography.jsx";

const DietsFilterChip = ({ label, colorClass, onRemove }) => {
    return (
        <CustomBox
            onClick={onRemove}
            className={`flex items-center rounded-full px-3 py-1 cursor-pointer ${colorClass} border ${colorClass.replace("text-", "border-")}`}
        >
            <CustomTypography
                as="span"
                variant="xsmallCard"
                className={`mr-2 font-semibold ${colorClass}`}
            >
                {label}
            </CustomTypography>
            <CircleX
                size={16}
                className={`${colorClass} hover:text-red-500`}
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
    colorClass: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default DietsFilterChip;
