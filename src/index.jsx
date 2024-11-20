import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./themes/theme";
import "./index.css";
import './styles/cssReset.css';
import {ThemeProvider} from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
