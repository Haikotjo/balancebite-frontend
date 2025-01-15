import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            main: "#46B1C9", // Primaire kleur
            light: "#7ed7ec", // Primaire kleur light
        },
        secondary: {
            main: "#EDB6A3", // Secundaire kleur
            light: "#f6cec0", // Secundaire kleur light
        },
        error: {
            main: "#DD1155", // Error kleur
            light: "#fb75a3", // Error kleur light
        },
        success: {
            main: "#7EE081", // Succes kleur
        },
        text: {
            primary: mode === "light" ? "#4D5061" : "#E0E0E0", // Tekstkleur
            secondary: mode === "light" ? "#7a7c8b" : "#B0B0B0", // Secundaire tekstkleur
            light: "#ffffff",
        },
        divider: mode === "light" ? "#4D5061" : "#303030", // Randkleur
        background: {
            default: mode === "light" ? "#FFFFFF" : "#121212", // Achtergrond light/dark mode
            paper: mode === "light" ? "#FAFAFA" : "#1E1E1E", // Voor componenten
        },
        action: {
            selected: "#46B1C9",
            disabled: "#E0E0E0",
        },
    },
    typography: {
        fontFamily: "'Nunito', sans-serif",
        h1: {
            fontFamily: "'Nunito', sans-serif",
        },
        body1: {
            fontSize: "1rem", // Basis font-grootte
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

let theme = createTheme(getDesignTokens("light")); // Standaard light mode
theme = responsiveFontSizes(theme);

export default theme;
