import { useState } from "react";
import { TextField, InputAdornment, useTheme, useMediaQuery, Autocomplete, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";

/**
 * A reusable search bar component with autocomplete functionality and debounced API calls.
 *
 * @param {Function} onSearch - Function to fetch search results (must return a Promise).
 * @param {Function} onSelect - Callback when a user selects an item from the autocomplete list.
 * @param {string} placeholder - Placeholder text for the search input.
 */
const SearchBar = ({ onSearch, onSelect, placeholder = "Search..." }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
    const [options, loading, searchQuery, setSearchQuery] = useDebouncedSearch(onSearch, 500);

    const handleChange = (event, newInputValue) => {
        setSearchQuery(newInputValue);
    };

    return (
        <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.name || ""}
            loading={loading}
            onInputChange={handleChange}
            onChange={(event, newValue) => onSelect(newValue)}
            renderOption={(props, option) => (
                <li {...props} key={option.id || option.name}>
                    {option.name}
                </li>
            )}
            PaperComponent={(props) => (
                <Paper
                    {...props}
                    sx={{
                        borderLeft: `1px solid ${theme.palette.primary.main}`,
                        borderRight: `1px solid ${theme.palette.primary.main}`,
                        borderBottom: `1px solid ${theme.palette.primary.main}`,
                        borderTop: "none",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "0px",
                    }}
                />
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    placeholder={placeholder}
                    sx={{
                        marginBottom: 4,
                        width: isLargeScreen ? 550 : "100%",
                        maxWidth: 550,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "8px",
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: theme.palette.primary.main,
                            },
                            "&:hover fieldset": {
                                borderColor: theme.palette.primary.dark,
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: theme.palette.primary.main,
                            },
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};

export default SearchBar;
