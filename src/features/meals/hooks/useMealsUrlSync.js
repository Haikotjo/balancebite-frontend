import { useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

/**
 * Syncs MealsPage state with URL search params and location state.
 * Handles redirect filters, URL filter params, active option, and sidebar auto-open.
 */
export default function useMealsUrlSync({
    setFilters,
    setPage,
    setActiveOption,
    setFilterSidebarOpen,
    setSortSidebarOpen,
}) {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Apply filters from homepage redirect
    useEffect(() => {
        if (location.state?.filtersFromRedirect) {
            setFilters(location.state.filtersFromRedirect);
            setPage(1);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, setFilters, setPage, location.pathname]);

    // Support URL query filters
    useEffect(() => {
        const urlFilters = {};
        ["mealTypes", "diets", "cuisines"].forEach((param) => {
            const value = searchParams.get(param);
            if (value) urlFilters[param] = value;
        });
        if (Object.keys(urlFilters).length) setFilters(urlFilters);
    }, [searchParams, setFilters]);

    // Active option from URL
    useEffect(() => {
        const option = searchParams.get("option");
        if (option) setActiveOption(option.replace("-", " "));
    }, [searchParams, setActiveOption]);

    // Auto-open sidebars from URL params (navigated from homepage)
    useEffect(() => {
        if (searchParams.get("openFilter") === "true") setFilterSidebarOpen(true);
        if (searchParams.get("openSort") === "true") setSortSidebarOpen(true);
    }, [searchParams, setFilterSidebarOpen, setSortSidebarOpen]);
}
