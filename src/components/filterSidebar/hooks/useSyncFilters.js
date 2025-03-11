import { useState, useEffect } from "react";

const useSyncFilters = (filters) => {
    const [selectedFilters, setSelectedFilters] = useState(filters);

    useEffect(() => {
        setSelectedFilters(filters);
    }, [filters]);

    useEffect(() => {
        const formattedFilters = Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value.toUpperCase()])
        );
        setSelectedFilters(formattedFilters);
    }, [filters]);

    return { selectedFilters, setSelectedFilters };
};

export default useSyncFilters;
