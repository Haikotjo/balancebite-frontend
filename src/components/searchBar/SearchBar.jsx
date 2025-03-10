import { useState } from "react";
import { TextField, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Meal..."
            value={query}
            onChange={handleChange}
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
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBar;
