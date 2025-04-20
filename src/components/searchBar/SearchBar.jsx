// src/components/searchBar/SearchBar.jsx
import PropTypes from "prop-types";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";
import { Search } from "lucide-react";
import CustomAutocomplete from "../layout/CustomAutocomplete.jsx";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * A reusable search bar component using CustomAutocomplete with debounced API calls.
 *
 * @param {Function} onSearch - Function to fetch search results (returns Promise).
 * @param {Function} onQuerySubmit - Callback when the query is submitted (Enter or click).
 * @param {string} placeholder - Placeholder text.
 */
const SearchBar = ({ onSearch, onQuerySubmit, placeholder = "Search..." }) => {
    const [options, , searchQuery, setSearchQuery] = useDebouncedSearch(onSearch, 500);

    return (
        <CustomAutocomplete
            options={options}
            value={searchQuery}           // ← use searchQuery here instead of null
            onInputChange={setSearchQuery}
            onChange={(opt) => {
                // via mouse click or Enter on highlighted option
                const q = typeof opt === "string" ? opt : opt?.name;
                if (q?.trim()) {
                    onQuerySubmit(q.trim());
                    setSearchQuery("");    // ← clear the input after submit
                }
            }}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option?.name || ""
            }
            placeholder={placeholder}
            freeSolo={true}
            renderOption={(option) => (
                <CustomBox className="flex items-center gap-2 mt:2">
                    <CustomTypography as="span">{option.name}</CustomTypography>
                </CustomBox>
            )}
        />
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onQuerySubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default SearchBar;
