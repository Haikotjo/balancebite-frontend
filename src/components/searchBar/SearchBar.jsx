import PropTypes from "prop-types";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";
import { Apple, Soup, User, Search } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomAutocomplete from "../layout/CustomAutocomplete.jsx";

/**
 * SearchBar with debounce, grouping headers, and custom styling.
 */
const SearchBar = ({ onSearch, onQuerySubmit, placeholder = "Search..." }) => {
    const [options, , searchQuery, setSearchQuery] = useDebouncedSearch(onSearch, 500);

    const typeOrder = { meal: 0, diet: 1, user: 2 };
    const sortedOptions = [...options].sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    return (
        <CustomBox className="w-full max-w-[350px] md:max-w-[350px] my-6 mx-auto">
        <CustomAutocomplete
                className="w-full"
                options={sortedOptions}
                value={searchQuery}
                onInputChange={setSearchQuery}
                onChange={(opt) => {
                    if (!opt) return;
                    if (typeof opt === "string") {
                        onQuerySubmit(opt);
                        setSearchQuery("");
                        return;
                    }
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
                    const Icon = opt.type === "user" ? User : opt.type === "diet" ? Apple : Soup;
                    return (
                        <CustomBox className="flex items-center gap-2 px-2 py-1">
                            <Icon className="w-4 h-4 text-primary" />
                            <CustomTypography variant="paragraph">{opt.name}</CustomTypography>
                        </CustomBox>
                    );
                }}
                groupBy={(opt) => opt.type}
                renderGroup={({ key, group, children }) => {
                    let Icon, label;
                    if (group === "meal") { Icon = Soup; label = "Meals"; }
                    else if (group === "diet") { Icon = Apple; label = "Diets"; }
                    else { Icon = User; label = "Users"; }
                    return (
                        <CustomBox key={key} className="mt-1">
                            <CustomBox className="flex items-center gap-2 py-1 px-2">
                                <CustomBox className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
                                <Icon className="w-5 h-5 text-primary" />
                                <CustomTypography variant="h5" bold>{label}</CustomTypography>
                                <CustomBox className="flex-1 h-px bg-borderLight dark:bg-borderDark" />
                            </CustomBox>
                            <ul className="list-none m-0 p-0">{children}</ul>
                        </CustomBox>
                    );
                }}
                // shows search icon at the end (decorative)
                endAdornment={<Search size={18} />}
                // classNames.option/highlight are still honored:
                classNames={{
                    option: "px-4 py-2 cursor-pointer transition-colors duration-100",
                    highlight: "bg-primary text-white",
                }}
                name="global-search"
                label={placeholder}
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
