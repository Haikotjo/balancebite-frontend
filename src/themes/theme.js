import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
    palette: {
        primary: {
            main: "#46B1C9", // Primaire kleur
        },
        secondary: {
            main: "#EDB6A3", // Secundaire kleur
        },
        error: {
            main: "#DD1155", // Error kleur
        },
        success: {
            main: "#7EE081", // Succes kleur
        },
        text: {
            primary: "#4D5061", // Tekstkleur
        },
        divider: "#4D5061", // Randkleur
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
