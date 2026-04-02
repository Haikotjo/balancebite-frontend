import PropTypes from "prop-types";
import { formatEnum } from "../../../utils/helpers/formatEnum.js";
import clsx from "clsx";

const FilterSection = ({ title, items, selectedFilters, category, onFilterClick }) => {
    if (!items.length) return null;

    return (
        <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-muted">
                {title}
            </p>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                    const isSelected = selectedFilters[category] === item;
                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onFilterClick(category, item)}
                            className={clsx(
                                "rounded-full px-3 py-1 text-sm transition-all duration-150",
                                isSelected
                                    ? "border-2 border-primary bg-primary/10 font-semibold text-primary scale-[1.05]"
                                    : "border border-border-strong bg-surface-sunken text-content-muted hover:border-primary/40 hover:text-content"
                            )}
                        >
                            {formatEnum(item)}
                        </button>
                    );
                })}
            </div>
        </div>
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
