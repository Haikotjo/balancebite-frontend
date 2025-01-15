import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Voeg PropTypes toe
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";

// De functie om de design tokens op te halen
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: "#1687c5",
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
            main: "#7EE081",
        },
        text: {
            primary: mode === "light" ? "#4D5061" : "#ffffff",
            secondary: mode === "light" ? "#7a7c8b" : "#B0B0B0",
            light: "#ffffff",
        },
        divider: mode === "light" ? "#4D5061" : "#303030",
        background: {
            default: mode === "light" ? "#ffffff" : "#121212",
            paper: mode === "light" ? "#f5f5f5" : "#1e1e1e",
        },
        action: {
            selected: "#46B1C9",
            disabled: "#ffffff",
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
});

// Context maken
const ThemeModeContext = createContext();

// Context provider
export const ThemeModeProvider = ({ children }) => {
    const [mode, setMode] = useState("light");

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTokens(mode))), [mode]);

    // useEffect om de dark class toe te voegen aan de <html> tag
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

// Custom hook om de context te gebruiken
export const useThemeMode = () => useContext(ThemeModeContext);

// Voeg PropTypes toe
ThemeModeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
