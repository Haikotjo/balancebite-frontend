// src/components/
// searchBar/SearchBar.jsx
import PropTypes from "prop-types";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";
import CustomAutocomplete from "../layout/CustomAutocomplete.jsx";
import { Search } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";

/**
 * SearchBar met debounce en styling, gebruikt CustomAutocomplete.
 */
const SearchBar = ({ onSearch, onQuerySubmit, placeholder = "Search..." }) => {
    const [options, , searchQuery, setSearchQuery] = useDebouncedSearch(onSearch, 500);

    return (
        <CustomBox className="self-stretch w-full">
            <CustomAutocomplete
                options={options}
                value={searchQuery}
                onInputChange={setSearchQuery}
                onChange={(opt) => {
                    const q = typeof opt === "string" ? opt : opt?.name;
                    if (q?.trim()) {
                        onQuerySubmit(q.trim());
                        setSearchQuery("");
                    }
                }}
                getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.name || ""
                }
                placeholder={placeholder}
                freeSolo={true}
                renderOption={(option) => (
                    <CustomBox className="flex items-center gap-2 px-2 py-1 text-sm">
                        <Search className="w-4 h-4 text-primary" />
                        <span>{option.name}</span>
                    </CustomBox>
                )}
                classNames={{
                    container: "relative w-full",
                    inputWrapper: "flex items-center border-2 border-primary rounded-md p-1 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]",
                    input: "w-full bg-transparent text-xs lg:text-base text-[var(--text-light)] dark:text-[var(--text-dark)] border-none",
                    dropdown: "absolute left-0 right-0 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] border-x-2 border-b-2 border-primary rounded-b-md mt-1 z-50 max-h-60 overflow-y-auto",
                    option: "px-4 py-2 cursor-pointer transition-colors duration-100",
                    highlight: "bg-[var(--userPrimary)] text-white",
                }}

            />
        </CustomBox>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onQuerySubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default SearchBar;
