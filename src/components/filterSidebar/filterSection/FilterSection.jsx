import PropTypes from "prop-types";
import { formatEnum } from "../../../utils/helpers/formatEnum.js";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";
import CustomDivider from "../../layout/CustomDivider.jsx";
import CustomCardChip from "../../layout/customCardChip.jsx";
import clsx from "clsx";

/**
 * FilterSection component - Renders a section of filter options with selectable chips.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the filter section
 * @param {string[]} props.items - The list of filter options
 * @param {Object} props.selectedFilters - The currently selected filters
 * @param {string} props.category - The filter category (e.g., "mealTypes", "diets", "cuisines")
 * @param {Function} props.onFilterClick - Callback function to handle filter selection
 */
const FilterSection = ({ title, items, selectedFilters, category, onFilterClick }) => {

    // If there are no items, do not render the section
    if (!items.length) return null;

    return (
        <CustomBox>
            <CustomTypography
                as="h3"
                variant="h4"
                className="mt-4"
            >
                {title}
            </CustomTypography>


            {/* Divider with dynamic color based on theme mode */}
            <CustomDivider className="my-2 mb-[15px] bg-borderDark dark:bg-borderLight" />

            {/* Render filter options as selectable Chips */}
            <CustomBox className="flex flex-wrap gap-1.5 mb-1">
            {items.map(item => {
                    const isSelected = selectedFilters[category] === item;
                    return (
                        <CustomCardChip
                            key={item}
                            onClick={() => onFilterClick(category, item)}
                            className={clsx(
                                "border px-2 py-[4px] text-[0.7rem] sm:text-[0.8rem] md:text-[0.9rem] transition-transform duration-200",
                                isSelected && "scale-[1.1]",
                                isSelected
                                    ? "border-primary border-2"
                                    : "border-borderDark dark:border-borderLight"
                            )}

                            textClassName="px-[4px] sm:px-[8px]"
                        >
                            {formatEnum(item)}
                        </CustomCardChip>

                    );
                })}
            </CustomBox>
        </CustomBox>
    );
};

FilterSection.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    selectedFilters: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
    onFilterClick: PropTypes.func.isRequired,
};

export default FilterSection;
