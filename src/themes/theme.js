import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Roboto', sans-serif", // Standaard voor gewone tekst
        h1: {
            fontFamily: "'Nunito', sans-serif",
        },
        h2: {
            fontFamily: "'Nunito', sans-serif",
        },
        h3: {
            fontFamily: "'Nunito', sans-serif",
        },
        h4: {
            fontFamily: "'Nunito', sans-serif",
        },
        h5: {
            fontFamily: "'Nunito', sans-serif",
        },
        h6: {
            fontFamily: "'Nunito', sans-serif",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: "'Roboto', sans-serif", // Standaard voor body
                },
                ul: {
                    fontFamily: "'Quicksand', sans-serif", // Voor ongeordende lijsten
                    listStyle: "none", // Verwijdert de bolletjes
                    padding: 0, // Optioneel: verwijdert standaard padding
                    margin: 0, // Optioneel: verwijdert standaard marges
                },
                ol: {
                    fontFamily: "'Quicksand', sans-serif", // Voor geordende lijsten
                    listStyle: "none", // Verwijdert standaard nummering
                    padding: 0,
                    margin: 0,
                },
                li: {
                    fontFamily: "'Quicksand', sans-serif", // Specifiek voor lijstitems
                    fontSize: "0.8rem",
                },
            },
        },
    },
});

export default theme;
