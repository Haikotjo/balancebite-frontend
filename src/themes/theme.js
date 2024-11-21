import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Quicksand', sans-serif",
        h1: {
            fontFamily: "'Roboto', sans-serif,",
            fontWeight: 900, // Dikste variant
        },
        h2: {
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 900,
        },
        h3: {
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 900,
        },
        h4: {
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 600,
        },
        h5: {
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: "'Quicksand', sans-serif",
                },
                ul: {
                    fontFamily: "'Quicksand', sans-serif", // Voor ongeordende lijsten
                },
                ol: {
                    fontFamily: "'Quicksand', sans-serif", // Voor geordende lijsten
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