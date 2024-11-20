import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: "'Quicksand', sans-serif",
        h1: {
            fontFamily: "'Roboto Slab', serif",
            fontWeight: 900, // Dikste variant
        },
        h2: {
            fontFamily: "'Roboto Slab', serif",
            fontWeight: 900,
        },
        h3: {
            fontFamily: "'Roboto Slab', serif",
            fontWeight: 900,
        },
        h4: {
            fontFamily: "'Roboto Slab', serif",
            fontWeight: 900,
        },
        h5: {
            fontFamily: "'Roboto Slab', serif",
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
                    fontSize: "0.9rem",
                },
            },
        },
    },
});

export default theme;