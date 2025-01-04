import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
    palette: {
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
            primary: "#4D5061", // Tekstkleur
            secondary: "#7a7c8b", // Secundaire tekstkleur
        },
        divider: "#4D5061", // Randkleur
        background: {
            default: "#FFFFFF", // Basisachtergrond voor light mode
            paper: "#FAFAFA", // Voor componenten zoals kaarten
        },
        action: {
            selected: "#46B1C9", // Voeg hier je eigen kleur toe
            disabled: "#E0E0E0"
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
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

// Maak typografie automatisch responsief
theme = responsiveFontSizes(theme);

export default theme;
