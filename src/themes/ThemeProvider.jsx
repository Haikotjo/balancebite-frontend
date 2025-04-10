import { createContext, useContext, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: "#46B1C9",
            light: "#7ed7ec",
        },
        secondary: {
            main: "#EDB6A3",
            light: "#f6cec0",
        },
        error: {
            main: "#DD1155",
            light: "#fb75a3",
        },
        success: {
            main: mode === "light" ? "#62b806" : "#7EE081",
            light: "#65f605",
        },
        text: {
            primary: mode === "light" ? "#4D5061" : "#ffffff",
            secondary: mode === "light" ? "#7a7c8b" : "#B0B0B0",
            light: "#ffffff",
        },
        divider: mode === "light" ? "#4D5061" : "#303030",
        homePageDivider: mode === "light" ? "#2D2F39" : "#ffffff",
        background: {
            default: mode === "light" ? "#ffffff" : "#121212",
            paper: mode === "light" ? "#f5f5f5" : "#1e1e1e",
        },
        action: {
            selected: "#46B1C9",
            disabled: mode === "light" ? "#dfdfdf" : "#5A5A5A",
        },
    },
    typography: {
        fontFamily: "'Nunito', sans-serif",
        h1: {
            fontFamily: "'Nunito', sans-serif",
        },
        body1: {
            fontSize: "1rem",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: "'Roboto', sans-serif",
                },
                ul: {
                    fontFamily: "'Quicksand', sans-serif",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                },
                ol: {
                    fontFamily: "'Quicksand', sans-serif",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                },
                li: {
                    fontFamily: "'Quicksand', sans-serif",
                },
            },
        },
    },
    MuiAutocomplete: {
        styleOverrides: {
            popper: {
                backgroundColor: mode === "light" ? "#e3f2fd" : "#2c2c2c",
                borderRadius: "5px",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.9rem",
            },
            option: {
                "&:hover": {
                    backgroundColor: mode === "light" ? "#ffffff" : "#444444",
                    color: mode === "light" ? "#000000" : "#ffffff",
                },
            },
        },
    },
});

// Create context
const ThemeModeContext = createContext();

// Context provider
export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState("dark");

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTokens(mode))), [mode]);

    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ThemeModeContext.Provider>
    );
};

export const useThemeMode = () => useContext(ThemeModeContext);

ThemeModeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
