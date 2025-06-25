import PropTypes from "prop-types";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomChip from "../../../../components/layout/CustomChip.jsx";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import { ChevronUp, ChevronDown } from "lucide-react";
import AccordionItem from "../accordionItem/AccordionItem.jsx";
import FilterContent from "../FilterContent/FilterContent.jsx";

const sortOptions = [
    { label: "Protein", field: "avgProtein" },
    { label: "Carbs", field: "avgCarbs" },
    { label: "Fat", field: "avgFat" },
    { label: "Calories", field: "avgCalories" },
    { label: "Popular (All Time)", field: "saveCount" },
    { label: "Popular (Last Week)", field: "weeklySaveCount" },
    { label: "Popular (Last Month)", field: "monthlySaveCount" },
];


const SortControls = ({ className = "", sortKey, sortOrder, onSortChange, filters, setFilters }) => {
    const handleSort = (field) => {
        const isSameField = sortKey === field;
        const newOrder = isSameField && sortOrder === "asc" ? "desc" : "asc";
        onSortChange(field, newOrder);
    };

    return (
        <CustomBox className={className}>
            <CustomBox className="flex items-center gap-4 mb-4 flex-wrap">
                <CustomTypography variant="paragraph" bold className="mr-2 hidden sm:block">
                    Sort by:
                </CustomTypography>
                <CustomBox className="flex gap-2 sm:gap-3 flex-wrap">
                    {sortOptions.map(({ label, field }) => {
                        const isSelected = sortKey === field;
                        const arrowIcon = isSelected
                            ? sortOrder === "asc"
                                ? <ChevronUp size={14} className="ml-1" />
                                : <ChevronDown size={14} className="ml-1" />
                            : (
                                <CustomBox className="flex flex-col ml-1">
                                    <ChevronUp size={10} className="mb-[2px] sm:hidden" />
                                    <ChevronDown size={10} className="sm:hidden" />
                                    <ChevronUp size={12} className="mb-[2px] hidden sm:block" />
                                    <ChevronDown size={12} className="hidden sm:block" />
                                </CustomBox>
                            );

                        return (
                            <CustomChip
                                key={field}
                                selected={isSelected}
                                onClick={() => handleSort(field)}
                                iconMargin={0}
                                iconSize={0}
                                className="w-auto py-1 flex-row"
                                icon={
                                    <CustomBox className="flex items-center">
                                        <CustomTypography variant="small" className="my-1 sm:mr-1">
                                            {label}
                                        </CustomTypography>
                                        {arrowIcon}
                                    </CustomBox>
                                }
                            />
                        );
                    })}
                </CustomBox>
            </CustomBox>

            <CustomBox className="sm:hidden mt-2 mb-4">
                <AccordionItem title="Filters">
                    <FilterContent filters={filters} setFilters={setFilters} />
                </AccordionItem>
            </CustomBox>

            <CustomBox className="hidden sm:block">
                <FilterContent filters={filters} setFilters={setFilters} />
            </CustomBox>
        </CustomBox>
    );
};

SortControls.propTypes = {
    className: PropTypes.string,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
    onSortChange: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default SortControls;
