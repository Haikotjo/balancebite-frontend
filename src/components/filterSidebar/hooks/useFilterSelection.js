import { useState } from "react";

const useFilterSelection = (initialFilters, onFilter) => {
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    const handleFilterClick = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const newFilters = { ...prevFilters };

            if (newFilters[category] === value) {
                delete newFilters[category];
            } else {
                newFilters[category] = value;
            }

            onFilter(newFilters);
            return newFilters;
        });
    };

    return { selectedFilters, setSelectedFilters, handleFilterClick };
};

export default useFilterSelection;
