import React, { useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "../../../themes/ThemeProvider.jsx";

const DarkModeSwitch = () => {
    const { mode, toggleTheme } = useThemeMode();

    // Laad de modus bij het laden van de component
    useEffect(() => {
        const savedMode = localStorage.getItem("theme-mode");
        if (savedMode && savedMode !== mode) {
            toggleTheme(); // Zorg ervoor dat de modus overeenkomt met de opgeslagen waarde
        }
    }, []); // Alleen uitvoeren bij het laden van de component

    // Sla de modus op in localStorage wanneer deze verandert
    useEffect(() => {
        localStorage.setItem("theme-mode", mode);
    }, [mode]);

    return (
        <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
                onClick={toggleTheme}
                sx={{
                    color: mode === "dark" ? "text.primary" : "text.light",
                }}
            >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    );
};

export default DarkModeSwitch;
