import { useState, useEffect } from "react";

/**
 * Custom hook to handle debounced searching.
 * @param {Function} onSearch - Function to fetch search results.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {Array} - [options, loading, searchQuery, setSearchQuery]
 */
const useDebouncedSearch = (onSearch, delay = 500) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.length < 1) {
            setOptions([]);
            return;
        }

        const controller = new AbortController();

        const handler = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await onSearch(searchQuery);
                if (!controller.signal.aborted) setOptions(results || []);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Error fetching search results:", error);
                    setOptions([]);
                }
            }
            if (!controller.signal.aborted) setLoading(false);
        }, delay);

        return () => {
            clearTimeout(handler);
            controller.abort();
        };
    }, [searchQuery, onSearch, delay]);

    return [options, loading, searchQuery, setSearchQuery];
};

export default useDebouncedSearch;
