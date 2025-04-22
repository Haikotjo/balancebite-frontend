// src/components/mealList/activeFilters/ActiveFilters.jsx
import PropTypes from "prop-types";
import { CircleX } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import { formatEnum } from "../../utils/helpers/formatEnum.js";

/**
 * ActiveFilters component - toont actieve filters als “chips” met een close-icon.
 *
 * @param {Object} filters - { categorie: waarde, … }
 * @param {Function} onFilterClick - callback bij verwijderen per categorie
 */
const ActiveFilters = ({ filters, onFilterClick }) => {
    return (
        <CustomBox className="flex justify-center items-center flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => (
                <CustomBox
                    key={key}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 border border-primary rounded-full px-3 py-1"
                >
                    <CustomTypography as="span" className="text-xs font-bold mr-2">
                        {formatEnum(value)}
                    </CustomTypography>
                    <CircleX
                        size={16}
                        className="cursor-pointer text-primary hover:text-red-500"
                        onClick={() => onFilterClick(key)}
                    />
                </CustomBox>
            ))}
        </CustomBox>
    );
};

ActiveFilters.propTypes = {
    filters: PropTypes.object.isRequired,
    onFilterClick: PropTypes.func.isRequired,
};

export default ActiveFilters;
