import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
