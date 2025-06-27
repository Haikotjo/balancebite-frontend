// src/components/searchBar/SearchBar.jsx
import PropTypes from "prop-types";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";
import CustomAutocomplete from "../layout/CustomAutocomplete.jsx";
import { Soup, User } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";

/**
 * SearchBar with debounce, grouping headers, and custom styling.
 * Uses CustomTypography for all text.
 */
const SearchBar = ({ onSearch, onQuerySubmit, placeholder = "Search..." }) => {
    const [options, , searchQuery, setSearchQuery] = useDebouncedSearch(onSearch, 500);

    // Ensure meals come first
    const sortedOptions = [...options].sort((a, b) =>
        a.type === b.type ? 0 : a.type === "meal" ? -1 : 1
    );

    return (
        <CustomBox className="self-stretch w-full">
            <CustomAutocomplete
                options={sortedOptions}
                value={searchQuery}
                onInputChange={setSearchQuery}
                onChange={(opt) => {
                    if (!opt) return;
                    if (opt.type === "user") {
                        onQuerySubmit({ creatorId: opt.id, creatorUserName: opt.name });
                    } else {
                        onQuerySubmit(opt.name);
                    }
                    setSearchQuery("");
                }}
                getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.name)}
                placeholder={placeholder}
                freeSolo={true}
                renderOption={(opt) => {
                    const Icon = opt.type === "user" ? User : Soup;
                    return (
                        <CustomBox className="flex items-center gap-2 px-2 py-1">
                            <Icon className="w-4 h-4 text-primary" />
                            <CustomTypography variant="paragraph">{opt.name}</CustomTypography>
                        </CustomBox>
                    );
                }}
                groupBy={(opt) => opt.type}
                renderGroup={({ key, group, children }) => (
                    <CustomBox key={key} className="mt-1">
                        <CustomBox className="flex items-center gap-2 py-1 px-2">
                            <div className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
                            {group === "meal" ? (
                                <>
                                    <Soup className="w-5 h-5 text-primary" />
                                    <CustomTypography variant="h5" bold>
                                        Meals
                                    </CustomTypography>
                                </>
                            ) : (
                                <>
                                    <User className="w-5 h-5 text-primary" />
                                    <CustomTypography variant="h5" bold>
                                        Users
                                    </CustomTypography>
                                </>
                            )}
                            <div className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
                        </CustomBox>
                        <ul className="list-none m-0 p-0">{children}</ul>
                    </CustomBox>
                )}
                classNames={{
                    container: "relative w-full",
                    inputWrapper:
                        "flex items-center border-2 border-primary rounded-md p-1 bg-[var(--bg-light)] dark:bg-[var(--bg-dark)]",
                    input:
                        "w-full bg-transparent text-xs lg:text-base text-[var(--text-light)] dark:text-[var(--text-dark)] border-none",
                    dropdown:
                        "absolute left-0 right-0 bg-lightBackground dark:bg-darkBackground border-x-2 border-b-2 border-primary rounded-b-md mt-1 z-50 max-h-60 overflow-y-auto",
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
